import os
import re

directory = "frontend/src"

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original_content = content

    # Replace max-w-sm, max-w-md, max-w-lg, max-w-xl, max-w-2xl on <p> tags
    # with w-full max-w-[60ch] block
    
    # We will look for <p className="..."
    def replacer(match):
        attrs = match.group(1)
        # remove w-fit, w-min, max-w-min, max-w-sm, max-w-md, max-w-lg, max-w-xl, max-w-2xl
        attrs = re.sub(r'\b(w-fit|w-min|max-w-min|max-w-xs|max-w-sm|max-w-md|max-w-lg|max-w-xl|max-w-2xl|inline-flex|inline-grid)\b', '', attrs)
        # remove multiple spaces
        attrs = re.sub(r'\s+', ' ', attrs).strip()
        # Ensure w-full max-w-[60ch] block is present
        if 'w-full' not in attrs:
            attrs += ' w-full'
        if 'max-w-[60ch]' not in attrs and 'max-w-[550px]' not in attrs:
            attrs += ' max-w-[60ch]'
        if 'block' not in attrs and 'hidden' not in attrs:
            attrs += ' block'
        
        return f'<p className="{attrs.strip()}"'

    new_content = re.sub(r'<p\s+className="([^"]+)"', replacer, content)

    if new_content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith(".jsx") or file.endswith(".js"):
            process_file(os.path.join(root, file))

print("Done")
