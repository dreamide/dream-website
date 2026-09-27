# Regenerate documentation crops from the original interface screenshots.
# Run from any directory with PowerShell on Windows.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$imageRoot = Join-Path $PSScriptRoot '../public/images'
$outputRoot = Join-Path $imageRoot 'docs'
New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null

# Output name, source name, x, y, width, height (original screenshot pixels).
$crops = @(
    @('project-tabs', 'tabs', 8, 0, 1256, 48),
    @('chat-composer', 'multiple-chats', 48, 928, 600, 108),
    @('chat-tools', 'multiple-chats', 48, 100, 600, 184),
    @('files-panel', 'file-explorer', 922, 56, 950, 610),
    @('changes-panel', 'changes-diffs', 922, 56, 950, 680),
    @('terminal-panel', 'terminal', 1017, 56, 855, 350),
    @('browser-panel', 'browser', 773, 56, 1099, 480),
    @('browser-toolbar', 'browser', 773, 56, 1099, 92),
    @('commit-dialog', 'git-commit', 624, 321, 672, 439),
    @('push-dialog', 'git-push', 624, 358, 672, 364),
    @('create-pr-dialog', 'create-pr', 624, 200, 672, 680),
    @('provider-models', 'providers', 575, 64, 1016, 440),
    @('model-defaults', 'settings', 575, 64, 1016, 246),
    @('appearance-settings', 'settings', 575, 526, 1016, 255),
    @('checkpoint-setting', 'settings', 583, 967, 1000, 68),
    @('stash-prompts', 'stashed-chats', 922, 56, 950, 389),
    @('stash-composer', 'stashed-chats', 1039, 952, 716, 115)
)

foreach ($crop in $crops) {
    $name, $source, $x, $y, $width, $height = $crop
    $original = [System.Drawing.Bitmap]::new((Join-Path $imageRoot "screen-$source.png"))
    try {
        $region = [System.Drawing.Rectangle]::new($x, $y, $width, $height)
        $cropped = $original.Clone($region, $original.PixelFormat)
        try {
            $cropped.Save((Join-Path $outputRoot "$name.png"), [System.Drawing.Imaging.ImageFormat]::Png)
        } finally {
            $cropped.Dispose()
        }
    } finally {
        $original.Dispose()
    }
    Write-Output "$name.png ($width x $height)"
}
