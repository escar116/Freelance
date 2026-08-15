# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListPendingUsers*](#listpendingusers)
  - [*GetUser*](#getuser)
  - [*ListHelpRequests*](#listhelprequests)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUserStatus*](#updateuserstatus)
  - [*CreateHelpRequest*](#createhelprequest)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@work4abit/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@work4abit/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@work4abit/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListPendingUsers
You can execute the `ListPendingUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listPendingUsers(options?: ExecuteQueryOptions): QueryPromise<ListPendingUsersData, undefined>;

interface ListPendingUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPendingUsersData, undefined>;
}
export const listPendingUsersRef: ListPendingUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listPendingUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPendingUsersData, undefined>;

interface ListPendingUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListPendingUsersData, undefined>;
}
export const listPendingUsersRef: ListPendingUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listPendingUsersRef:
```typescript
const name = listPendingUsersRef.operationName;
console.log(name);
```

### Variables
The `ListPendingUsers` query has no variables.
### Return Type
Recall that executing the `ListPendingUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListPendingUsersData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListPendingUsersData {
  users: ({
    id: string;
    email: string;
    fullName: string;
    studentId?: string | null;
    facultyReference?: string | null;
    certificateUrl: string;
    verificationStatus: string;
  } & User_Key)[];
}
```
### Using `ListPendingUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listPendingUsers } from '@work4abit/dataconnect';


// Call the `listPendingUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listPendingUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listPendingUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listPendingUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListPendingUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listPendingUsersRef } from '@work4abit/dataconnect';


// Call the `listPendingUsersRef()` function to get a reference to the query.
const ref = listPendingUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listPendingUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
getUser(vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query requires an argument of type `GetUserVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    id: string;
    email: string;
    fullName: string;
    studentId?: string | null;
    facultyReference?: string | null;
    certificateUrl: string;
    verificationStatus: string;
    preferredRole?: string | null;
  } & User_Key;
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser, GetUserVariables } from '@work4abit/dataconnect';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser(getUserVars);
// Variables can be defined inline as well.
const { data } = await getUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect, getUserVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser(getUserVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef, GetUserVariables } from '@work4abit/dataconnect';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef(getUserVars);
// Variables can be defined inline as well.
const ref = getUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect, getUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListHelpRequests
You can execute the `ListHelpRequests` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
listHelpRequests(options?: ExecuteQueryOptions): QueryPromise<ListHelpRequestsData, undefined>;

interface ListHelpRequestsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListHelpRequestsData, undefined>;
}
export const listHelpRequestsRef: ListHelpRequestsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listHelpRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListHelpRequestsData, undefined>;

interface ListHelpRequestsRef {
  ...
  (dc: DataConnect): QueryRef<ListHelpRequestsData, undefined>;
}
export const listHelpRequestsRef: ListHelpRequestsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listHelpRequestsRef:
```typescript
const name = listHelpRequestsRef.operationName;
console.log(name);
```

### Variables
The `ListHelpRequests` query has no variables.
### Return Type
Recall that executing the `ListHelpRequests` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListHelpRequestsData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListHelpRequestsData {
  helpRequests: ({
    id: UUIDString;
    title: string;
    description: string;
    budget: number;
    category?: string | null;
    urgency?: string | null;
    deadline?: string | null;
    requester: {
      id: string;
      fullName: string;
      email: string;
      certificateUrl: string;
      verificationStatus: string;
    } & User_Key;
  } & HelpRequest_Key)[];
}
```
### Using `ListHelpRequests`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listHelpRequests } from '@work4abit/dataconnect';


// Call the `listHelpRequests()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listHelpRequests();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listHelpRequests(dataConnect);

console.log(data.helpRequests);

// Or, you can use the `Promise` API.
listHelpRequests().then((response) => {
  const data = response.data;
  console.log(data.helpRequests);
});
```

### Using `ListHelpRequests`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listHelpRequestsRef } from '@work4abit/dataconnect';


// Call the `listHelpRequestsRef()` function to get a reference to the query.
const ref = listHelpRequestsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listHelpRequestsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.helpRequests);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.helpRequests);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  id: string;
  email: string;
  fullName: string;
  studentId?: string | null;
  facultyReference?: string | null;
  certificateUrl: string;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@work4abit/dataconnect';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  email: ..., 
  fullName: ..., 
  studentId: ..., // optional
  facultyReference: ..., // optional
  certificateUrl: ..., 
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ id: ..., email: ..., fullName: ..., studentId: ..., facultyReference: ..., certificateUrl: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@work4abit/dataconnect';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  email: ..., 
  fullName: ..., 
  studentId: ..., // optional
  facultyReference: ..., // optional
  certificateUrl: ..., 
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ id: ..., email: ..., fullName: ..., studentId: ..., facultyReference: ..., certificateUrl: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUserStatus
You can execute the `UpdateUserStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
updateUserStatus(vars: UpdateUserStatusVariables): MutationPromise<UpdateUserStatusData, UpdateUserStatusVariables>;

interface UpdateUserStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserStatusVariables): MutationRef<UpdateUserStatusData, UpdateUserStatusVariables>;
}
export const updateUserStatusRef: UpdateUserStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserStatus(dc: DataConnect, vars: UpdateUserStatusVariables): MutationPromise<UpdateUserStatusData, UpdateUserStatusVariables>;

interface UpdateUserStatusRef {
  ...
  (dc: DataConnect, vars: UpdateUserStatusVariables): MutationRef<UpdateUserStatusData, UpdateUserStatusVariables>;
}
export const updateUserStatusRef: UpdateUserStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserStatusRef:
```typescript
const name = updateUserStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserStatus` mutation requires an argument of type `UpdateUserStatusVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserStatusVariables {
  id: string;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateUserStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserStatusData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserStatusData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserStatus, UpdateUserStatusVariables } from '@work4abit/dataconnect';

// The `UpdateUserStatus` mutation requires an argument of type `UpdateUserStatusVariables`:
const updateUserStatusVars: UpdateUserStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateUserStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserStatus(updateUserStatusVars);
// Variables can be defined inline as well.
const { data } = await updateUserStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserStatus(dataConnect, updateUserStatusVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserStatus(updateUserStatusVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserStatusRef, UpdateUserStatusVariables } from '@work4abit/dataconnect';

// The `UpdateUserStatus` mutation requires an argument of type `UpdateUserStatusVariables`:
const updateUserStatusVars: UpdateUserStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateUserStatusRef()` function to get a reference to the mutation.
const ref = updateUserStatusRef(updateUserStatusVars);
// Variables can be defined inline as well.
const ref = updateUserStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserStatusRef(dataConnect, updateUserStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## CreateHelpRequest
You can execute the `CreateHelpRequest` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-sdk/index.d.ts](./index.d.ts):
```typescript
createHelpRequest(vars: CreateHelpRequestVariables): MutationPromise<CreateHelpRequestData, CreateHelpRequestVariables>;

interface CreateHelpRequestRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateHelpRequestVariables): MutationRef<CreateHelpRequestData, CreateHelpRequestVariables>;
}
export const createHelpRequestRef: CreateHelpRequestRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createHelpRequest(dc: DataConnect, vars: CreateHelpRequestVariables): MutationPromise<CreateHelpRequestData, CreateHelpRequestVariables>;

interface CreateHelpRequestRef {
  ...
  (dc: DataConnect, vars: CreateHelpRequestVariables): MutationRef<CreateHelpRequestData, CreateHelpRequestVariables>;
}
export const createHelpRequestRef: CreateHelpRequestRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createHelpRequestRef:
```typescript
const name = createHelpRequestRef.operationName;
console.log(name);
```

### Variables
The `CreateHelpRequest` mutation requires an argument of type `CreateHelpRequestVariables`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateHelpRequestVariables {
  title: string;
  description: string;
  budget: number;
  requesterId: string;
  category?: string | null;
  urgency?: string | null;
  deadline?: string | null;
}
```
### Return Type
Recall that executing the `CreateHelpRequest` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateHelpRequestData`, which is defined in [dataconnect-sdk/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateHelpRequestData {
  helpRequest_insert: HelpRequest_Key;
}
```
### Using `CreateHelpRequest`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createHelpRequest, CreateHelpRequestVariables } from '@work4abit/dataconnect';

// The `CreateHelpRequest` mutation requires an argument of type `CreateHelpRequestVariables`:
const createHelpRequestVars: CreateHelpRequestVariables = {
  title: ..., 
  description: ..., 
  budget: ..., 
  requesterId: ..., 
  category: ..., // optional
  urgency: ..., // optional
  deadline: ..., // optional
};

// Call the `createHelpRequest()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createHelpRequest(createHelpRequestVars);
// Variables can be defined inline as well.
const { data } = await createHelpRequest({ title: ..., description: ..., budget: ..., requesterId: ..., category: ..., urgency: ..., deadline: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createHelpRequest(dataConnect, createHelpRequestVars);

console.log(data.helpRequest_insert);

// Or, you can use the `Promise` API.
createHelpRequest(createHelpRequestVars).then((response) => {
  const data = response.data;
  console.log(data.helpRequest_insert);
});
```

### Using `CreateHelpRequest`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createHelpRequestRef, CreateHelpRequestVariables } from '@work4abit/dataconnect';

// The `CreateHelpRequest` mutation requires an argument of type `CreateHelpRequestVariables`:
const createHelpRequestVars: CreateHelpRequestVariables = {
  title: ..., 
  description: ..., 
  budget: ..., 
  requesterId: ..., 
  category: ..., // optional
  urgency: ..., // optional
  deadline: ..., // optional
};

// Call the `createHelpRequestRef()` function to get a reference to the mutation.
const ref = createHelpRequestRef(createHelpRequestVars);
// Variables can be defined inline as well.
const ref = createHelpRequestRef({ title: ..., description: ..., budget: ..., requesterId: ..., category: ..., urgency: ..., deadline: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createHelpRequestRef(dataConnect, createHelpRequestVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.helpRequest_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.helpRequest_insert);
});
```

