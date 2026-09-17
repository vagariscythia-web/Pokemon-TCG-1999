with open('src/index.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re

for term in ['gbaGrowlithe', 'gbaVulpix']:
    matches = list(re.finditer(term, css))
    print(f"{term}: found {len(matches)} occurrences")
    if matches:
        first = matches[0].start()
        last = matches[-1].end()
        # print line numbers
        print(f"  first at line: {css[:first].count(chr(10))+1}")
        print(f"  last at line: {css[:last].count(chr(10))+1}")
