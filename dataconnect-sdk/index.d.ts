import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateHelpRequestData {
  helpRequest_insert: HelpRequest_Key;
}

export interface CreateHelpRequestVariables {
  title: string;
  description: string;
  budget: number;
  requesterId: string;
  category?: string | null;
  urgency?: string | null;
  deadline?: string | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  id: string;
  email: string;
  fullName: string;
  studentId?: string | null;
  facultyReference?: string | null;
  certificateUrl: string;
}

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

export interface GetUserVariables {
  id: string;
}

export interface HelpRequest_Key {
  id: UUIDString;
  __typename?: 'HelpRequest_Key';
}

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

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface Service_Key {
  id: UUIDString;
  __typename?: 'Service_Key';
}

export interface UpdateUserStatusData {
  user_update?: User_Key | null;
}

export interface UpdateUserStatusVariables {
  id: string;
  status: string;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface UpdateUserStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserStatusVariables): MutationRef<UpdateUserStatusData, UpdateUserStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserStatusVariables): MutationRef<UpdateUserStatusData, UpdateUserStatusVariables>;
  operationName: string;
}
export const updateUserStatusRef: UpdateUserStatusRef;

export function updateUserStatus(vars: UpdateUserStatusVariables): MutationPromise<UpdateUserStatusData, UpdateUserStatusVariables>;
export function updateUserStatus(dc: DataConnect, vars: UpdateUserStatusVariables): MutationPromise<UpdateUserStatusData, UpdateUserStatusVariables>;

interface CreateHelpRequestRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateHelpRequestVariables): MutationRef<CreateHelpRequestData, CreateHelpRequestVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateHelpRequestVariables): MutationRef<CreateHelpRequestData, CreateHelpRequestVariables>;
  operationName: string;
}
export const createHelpRequestRef: CreateHelpRequestRef;

export function createHelpRequest(vars: CreateHelpRequestVariables): MutationPromise<CreateHelpRequestData, CreateHelpRequestVariables>;
export function createHelpRequest(dc: DataConnect, vars: CreateHelpRequestVariables): MutationPromise<CreateHelpRequestData, CreateHelpRequestVariables>;

interface ListPendingUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListPendingUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListPendingUsersData, undefined>;
  operationName: string;
}
export const listPendingUsersRef: ListPendingUsersRef;

export function listPendingUsers(options?: ExecuteQueryOptions): QueryPromise<ListPendingUsersData, undefined>;
export function listPendingUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListPendingUsersData, undefined>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;
export function getUser(dc: DataConnect, vars: GetUserVariables, options?: ExecuteQueryOptions): QueryPromise<GetUserData, GetUserVariables>;

interface ListHelpRequestsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListHelpRequestsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListHelpRequestsData, undefined>;
  operationName: string;
}
export const listHelpRequestsRef: ListHelpRequestsRef;

export function listHelpRequests(options?: ExecuteQueryOptions): QueryPromise<ListHelpRequestsData, undefined>;
export function listHelpRequests(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListHelpRequestsData, undefined>;

