# Debugger Agent Instructions: System Architecture & Data Flow

Hello, Debugger Agent! This file outlines how everything in the `Work 4 a bit` web application is connected. 

## 1. Tech Stack Overview
- **Frontend Framework:** React (Vite)
- **Styling:** Tailwind CSS + custom UI components (inspired by shadcn/ui) in `src/components/`
- **Routing:** React Router v6
- **Authentication:** Firebase Auth (Email/Password & Google Sign-In)
- **Database:** Firebase Data Connect (PostgreSQL backend)
  > **CRITICAL NOTE:** We do *not* use Firestore for application data anymore. We fully migrated to PostgreSQL via Firebase Data Connect.

## 2. Database & Data Connect Integration
The database is strictly typed using GraphQL.
- **Schema & Operations Location:** The database schema is located in `dataconnect/schema/schema.gql`. The queries and mutations are in `dataconnect/connector/`.
- **SDK Generation:** The GraphQL queries are compiled into a JavaScript SDK located in the `dataconnect-sdk/` folder.
- **Importing:** The app imports database functions directly from the local SDK (e.g., `import { createUser, getUser } from "@work4abit/dataconnect";`).
- **Syncing Changes:** If you ever modify the `.gql` files, the user *must* run `firebase deploy --only dataconnect` and then `firebase dataconnect:sdk:generate`.

## 3. Authentication & Registration Flow
This is the most complex part of the app and a common source of bugs.
- **Global State:** Auth state is managed in `AuthContext.jsx`. It listens to Firebase `onAuthStateChanged`. When a Firebase login occurs, it instantly calls `getUser()` (from PostgreSQL) to fetch the user's profile and verification status.
- **Ghost Users:** If a user logs into Firebase Auth but *doesn't* have a PostgreSQL record (e.g., they closed the tab during registration), `AuthContext` flags them with `hasPostgresData: false`.
- **Protected Routes (`ProtectedRoute.jsx`):** 
  - If `hasPostgresData: false`, the user is hard-redirected to `/register` to finish setting up their database record.
  - If `hasPostgresData: true` but their `verificationStatus` is `"unverified"` or `"pending"`, they are redirected to `/pending`.
  - Only `verified` users (or the hardcoded admin email) can access protected routes.

## 4. Google Sign-In (Two-Step Flow)
Because the app requires custom fields (Student ID, Certificate, Faculty) that Google doesn't provide, Google Sign-In in `Register.jsx` is a two-step process:
1. `signInWithPopup` is called with `prompt: 'select_account'`.
2. We check the database using `getUser`.
3. If they exist, they are redirected home (Login).
4. If they don't exist, we save their Firebase credential to state, hide the email/password fields, and show the "Step 2" form (Student ID, Certificate) so they can finish registering. Only when they click "Complete Setup" do we execute the `createUser` mutation.

## 5. Image Compression & Storage
To avoid Firebase Storage billing/limitations, we do **not** use Firebase Storage for the Certificate of Enrollment (COE) images.
- Images uploaded during registration are aggressively compressed using a hidden `<canvas>` in `Register.jsx` and converted into a **Base64 String**.
- The Base64 string is stored directly inside the PostgreSQL `User` table under the `certificateUrl` field.
- In `AdminDashboard.jsx`, the images are rendered natively as `<img src={certificateUrl} />`.

## 6. Admin Dashboard
- Located at `/admin`, heavily restricted in `ProtectedRoute.jsx` to `charlesjanparaggua@gmail.com`.
- Uses `listPendingUsers` from the SDK to fetch all unverified accounts.
- Uses `updateUserStatus` to toggle them to verified/rejected.
- Has a built-in fullscreen modal to view the Base64 certificate strings since modern browsers block opening raw data URIs in new tabs.

## 7. Where to Start Debugging
- **UI/Layout Issues:** Check `App.jsx` for the router structure and `Layout.jsx` for the navigation bar.
- **Database/Fetching Errors:** Check the network tab to see if the Data Connect API returns 404. Ensure `firebase.js` is initializing `getDataConnect` properly.
- **Redirect Loops:** If the app is flashing or looping between `/`, `/pending`, and `/login`, inspect the logic in `ProtectedRoute.jsx` and `AuthContext.jsx`.
