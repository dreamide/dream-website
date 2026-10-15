import type { Token } from "./data";

/** Colours matching Dream's code view (GitHub dark dimmed). */
export const SYNTAX = {
  keyword: "#f47067",
  fn: "#dcbdfb",
  string: "#96d0ff",
  constant: "#6cb6ff",
  text: "#e5e5e5",
};

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "const",
  "let",
  "async",
  "await",
  "return",
  "if",
  "else",
  "throw",
  "new",
  "function",
  "true",
  "false",
  "null",
]);

const PATTERN =
  /("[^"]*"|'[^']*'|`[^`]*`)|(\d+(?:\.\d+)?)|([A-Za-z_$][\w$]*)|(===|!==|=>|\|\||\?\?|&&|!(?!=))|(\s+)|(.)/g;

/**
 * A deliberately small JavaScript highlighter: enough to colour the snippets
 * shown in the app mock the way Dream's own code view does.
 */
export function highlight(line: string): Token[] {
  const tokens: Token[] = [];
  const push = (text: string, color?: string) => {
    const last = tokens[tokens.length - 1];
    if (last && last[1] === color) last[0] += text;
    else tokens.push([text, color]);
  };

  let previous = "";
  for (const match of line.matchAll(PATTERN)) {
    const [text, str, num, word, op, space] = match;
    const index = match.index ?? 0;
    const next = line.slice(index + text.length).match(/^\s*(.)/)?.[1];

    if (str) push(text, SYNTAX.string);
    else if (num) push(text, SYNTAX.constant);
    else if (word) {
      if (KEYWORDS.has(word)) push(text, SYNTAX.keyword);
      else if (next === "(" || previous === "new") push(text, SYNTAX.fn);
      else if (/^[A-Z][A-Z0-9_]+$/.test(word) || word === "meta")
        push(text, SYNTAX.constant);
      else push(text);
    } else if (op) push(text, SYNTAX.keyword);
    else if (space) push(text);
    else push(text);

    if (!space) previous = word ?? text;
  }

  return tokens;
}
