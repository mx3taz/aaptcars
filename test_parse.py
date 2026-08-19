import re

with open('.system_generated/steps/377/content.md', 'r') as f:
    text = f.read()

start_marker = "[Linkedin](https://www.linkedin.com/company/cotumau)"
end_marker = "### newsletter"

start_idx = text.rfind(start_marker)
if start_idx != -1:
    start_idx += len(start_marker)
    end_idx = text.find(end_marker, start_idx)
    if end_idx != -1:
        desc = text[start_idx:end_idx].strip()
        print("DESCRIPTION:", repr(desc))
