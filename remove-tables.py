with open('dataconnect/schema/schema.gql', 'r') as f:
    content = f.read()

import re
# Remove Review table
content = re.sub(r'type Review @table \{.*?\n\}\n', '', content, flags=re.DOTALL)
# Remove Message table
content = re.sub(r'type Message @table \{.*?\n\}\n', '', content, flags=re.DOTALL)

with open('dataconnect/schema/schema.gql', 'w') as f:
    f.write(content)
