# Database Architecture Map

This file serves as a permanent reference for exactly how data is structured and stored across Firebase in this project. We will update this file every time the database architecture changes.

## 1. Firebase Data Connect (Cloud SQL Postgres)
*Status: Active*
**Purpose:** Stores highly structured, relational data that requires complex queries, strict relationships, and easy navigation/filtering.

**Currently Stored Here:**
*   `User`: Student profiles, ID verification status, credentials, gender, roles.
*   `Category`: The static list of job categories.
*   `Service`: Services offered by users (Title, Description, Price, Provider).
*   `HelpRequest`: Job postings created by users (Budget, Urgency, Deadline, Status).
*   `Application`: The link between a User and a HelpRequest when they apply (Price Offer, Message, Status).
*   `Conversation`: The metadata linking the Poster, the Applicant, and the Application.
*   `Review`: Ratings and comments left by users after a job is completed.
*   *Note: The `Message` table still exists in the schema file but is no longer being used by the application code.*

## 2. Firebase Realtime Database (RTDB)
*Status: Active*
**Purpose:** Extremely high-speed NoSQL database using WebSockets for instant, low-cost data delivery.

**Currently Stored Here:**
*   `conversations/{conversationId}/messages`: The actual chat text exchanged between users. We migrated this here to bypass Data Connect quotas and make chat instant.

## 3. Cloud Firestore (NoSQL Document Store)
*Status: Planned (Not yet implemented)*
**Purpose:** Flexible document storage for unstructured data and real-time listeners for things that do not fit well into strict SQL tables.

**Planned Integrations:**
*(To be updated when we begin integrating Firestore)*
