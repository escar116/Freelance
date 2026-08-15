# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateUserStatus, createHelpRequest, createApplication, updateApplicationStatus, createConversation, createMessage, listPendingUsers, getUser, listHelpRequests } from '@work4abit/dataconnect';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation UpdateUserStatus:  For variables, look at type UpdateUserStatusVars in ../index.d.ts
const { data } = await UpdateUserStatus(dataConnect, updateUserStatusVars);

// Operation CreateHelpRequest:  For variables, look at type CreateHelpRequestVars in ../index.d.ts
const { data } = await CreateHelpRequest(dataConnect, createHelpRequestVars);

// Operation CreateApplication:  For variables, look at type CreateApplicationVars in ../index.d.ts
const { data } = await CreateApplication(dataConnect, createApplicationVars);

// Operation UpdateApplicationStatus:  For variables, look at type UpdateApplicationStatusVars in ../index.d.ts
const { data } = await UpdateApplicationStatus(dataConnect, updateApplicationStatusVars);

// Operation CreateConversation:  For variables, look at type CreateConversationVars in ../index.d.ts
const { data } = await CreateConversation(dataConnect, createConversationVars);

// Operation CreateMessage:  For variables, look at type CreateMessageVars in ../index.d.ts
const { data } = await CreateMessage(dataConnect, createMessageVars);

// Operation ListPendingUsers: 
const { data } = await ListPendingUsers(dataConnect);

// Operation GetUser:  For variables, look at type GetUserVars in ../index.d.ts
const { data } = await GetUser(dataConnect, getUserVars);

// Operation ListHelpRequests: 
const { data } = await ListHelpRequests(dataConnect);


```