with open('dataconnect/connector/queries.gql', 'r') as f:
    content = f.read()

import re
# Remove ListMessages
content = re.sub(r'query ListMessages\([^)]*\)\s*@auth\(level:\s*PUBLIC\)\s*\{[^}]*\}\n', '', content, flags=re.DOTALL)
# Remove reviews_on_targetUser from GetUserProfile
content = re.sub(r'reviews_on_targetUser\s*\{[^}]*\}', '', content, flags=re.DOTALL)

with open('dataconnect/connector/queries.gql', 'w') as f:
    f.write(content)
