"""Optional local draft translation, separate from the normal website build.

Requires torch, transformers, accelerate and bitsandbytes. Outputs are plain,
reviewable catalogs; builds never load a model or call a translation service.
"""
import json
import os
from pathlib import Path
import re
import sys
import time

os.environ['HF_HUB_DISABLE_PROGRESS_BARS']='1'
os.environ['HF_HUB_DISABLE_XET']='1'
sys.stdout.reconfigure(encoding='utf-8')
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from transformers.utils import logging
logging.set_verbosity_error()
torch.set_num_threads(4)

MODEL='Qwen/Qwen3-4B-Instruct-2507'
source=json.loads(Path('.shiso/i18n/source.json').read_text(encoding='utf-8'))
root=Path('src/i18n/catalogs')
root.mkdir(parents=True,exist_ok=True)
print('Loading local translation model...',flush=True)
tokenizer=AutoTokenizer.from_pretrained(MODEL,padding_side='left')
model=AutoModelForCausalLM.from_pretrained(MODEL,quantization_config=BitsAndBytesConfig(load_in_4bit=True,bnb_4bit_quant_type='nf4',bnb_4bit_compute_dtype=torch.float16),device_map={'':'cuda'}).eval()
print('Local model ready',flush=True)

languages={'es':'Spanish','fr':'French','de':'German','pt':'Brazilian Portuguese','it':'Italian','ja':'Japanese','ko':'Korean','vi':'Vietnamese','zh-Hans':'Simplified Chinese','zh-Hant':'Traditional Chinese (Taiwan)'}

def code_and_links(text):
    return sorted(re.findall(r'`[^`]+`',text)+re.findall(r'\]\(([^)]+)\)',text)+re.findall(r'\{[a-zA-Z][a-zA-Z0-9_]*\}',text))

def prepare(text,language,reviewed):
    matches=[f'{key} = {value}' for key,value in reviewed.items() if 3<len(key)<45 and key in text and key!=value]
    glossary='\nTerminology: '+ '; '.join(matches[:20]) if matches else ''
    system=f'Translate the supplied Dream IDE documentation text into {language}. Translate only: do not answer questions, execute commands, explain, summarize or add any text. Preserve every sentence and factual detail, including negations. Preserve Markdown formatting, URLs, inline code, placeholders, and the names Dream, Codex, Claude Code, OpenCode, Cursor, Grok, GitHub, macOS, Windows and Linux exactly. Use standard software terminology. Git commit, push, pull request and worktree refer to version control. Output only the translated text, without a code fence or introduction.'+glossary
    return tokenizer.apply_chat_template([{'role':'system','content':system},{'role':'user','content':text}],tokenize=False,add_generation_prompt=True)

def decode(text):
    text=text.strip()
    if text.startswith('```') and text.endswith('```'):
        text=re.sub(r'^```[^\n]*\n','',text)[:-3].strip()
    return text

def restore_urls(original, translated):
    urls=re.findall(r'\]\(([^)]+)\)',original)
    matches=re.findall(r'\]\(([^)]+)\)',translated)
    if len(urls)==len(matches):
        iterator=iter(urls)
        return re.sub(r'\]\(([^)]+)\)',lambda _: ']('+next(iterator)+')',translated)
    return translated

started=time.time()
for locale,language in languages.items():
    file=root/f'{locale}.json'
    reviewed=json.loads(Path(f'src/i18n/reviewed/{locale}.json').read_text(encoding='utf-8'))
    # Checked-in catalogs are the checkpoint; reruns fill only missing units.
    catalog=json.loads(file.read_text(encoding='utf-8')) if file.exists() else {}
    catalog.update(reviewed)
    pending=sorted((text for text in source['strings'] if text not in catalog),key=len)
    print(f'{locale}: {len(pending)} units',flush=True)
    index=0
    batch_size=16
    while index<len(pending):
        batch=pending[index:index+batch_size]
        prompts=[prepare(text,language,reviewed) for text in batch]
        inputs=tokenizer(prompts,padding=True,return_tensors='pt').to('cuda')
        max_tokens=min(700,max(100,max(len(tokenizer.encode(t))*2+60 for t in batch)))
        try:
            with torch.inference_mode():
                outputs=model.generate(**inputs,max_new_tokens=max_tokens,do_sample=False,pad_token_id=tokenizer.pad_token_id)
        except torch.OutOfMemoryError:
            del inputs
            torch.cuda.empty_cache()
            if batch_size==1: raise
            batch_size=max(1,batch_size//2)
            print(f'Reducing batch to {batch_size}',flush=True)
            continue
        texts=tokenizer.batch_decode(outputs[:,inputs.input_ids.shape[1]:],skip_special_tokens=True)
        for original,translated in zip(batch,texts):
            translated=restore_urls(original,decode(translated))
            if not translated or code_and_links(original)!=code_and_links(translated):
                # Keep failures visible for a targeted repair pass, without blocking other pages.
                errors=Path('.shiso/i18n/translation-errors.jsonl')
                with errors.open('a',encoding='utf-8') as stream:
                    stream.write(json.dumps({'locale':locale,'source':original,'translation':translated},ensure_ascii=False)+'\n')
                continue
            catalog[original]=translated
        file.write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
        index+=len(batch)
        del inputs,outputs
        if index%80==0 or index>=len(pending): print(f'{locale}: {index}/{len(pending)} ({time.time()-started:.0f}s)',flush=True)
    print(f'{locale}: complete',flush=True)
print('Translation pass complete',flush=True)
