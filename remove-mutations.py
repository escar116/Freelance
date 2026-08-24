with open('dataconnect/connector/mutations.gql', 'r') as f:
    content = f.read()

import re
# Remove CreateReview
content = re.sub(r'mutation CreateReview\([^)]*\)\s*@auth\(level:\s*PUBLIC\)\s*\{[^}]*\}\n', '', content, flags=re.DOTALL)
# Remove CreateMessage
content = re.sub(r'mutation CreateMessage\([^)]*\)\s*@auth\(level:\s*PUBLIC\)\s*\{[^}]*\}\n', '', content, flags=re.DOTALL)

with open('dataconnect/connector/mutations.gql', 'w') as f:
    f.write(content)
