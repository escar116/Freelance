# Mentoring Feature Implementation Plan

## Goal Description
Add a new "Mentoring" page to the website. The page will list all users on the platform along with their skills and rating. Students can "Apply for Mentoring" from a specific user (the Mentor), proposing a topic, description, amount, and expected time. The Mentor will receive this proposal in a new "Mentoring" section inside their Applications tab, and can Accept it to open a chat.

## No Schema Changes Required (Architectural Genius)
To avoid touching the Firebase Data Connect schema and forcing a backend deployment, we will use the existing HelpRequest and Application entities with a role-reversal trick:
1. When Student A (Mentoree) applies to Student B (Mentor):
   - Student A will programmatically create a HelpRequest on behalf of Student B. (i.e. equesterId = B.id). The category will be explicitly marked as MENTORING.
   - Student A will immediately create an Application to that HelpRequest (pplicantId = A.id), containing their proposed price and message.
2. Because Student B is technically the "Requester", they will see this proposal in their "Applications" tab (under a new Mentoring list). They will have the power to click "Approve/Reject".
3. Once Approved, a standard Conversation is created, and the chat flow works flawlessly without any backend modifications.

## Proposed Changes

### index.html
- **Navigation**: Add a new .nav-btn for "Mentoring" in the sidebar.
- **Mentoring Page**: Add a new <section id="section-mentoring" class="content-section hidden">.
  - Include a grid to display all users (id="mentoring-users-grid").
- **Apply for Mentoring Dialog**: Add <dialog id="dialog-mentoring-apply"> with fields:
  - Mentoring Name (Title)
  - Description
  - Amount to Pay
  - Expected Time
- **Applications Page**: Add a new sub-tab inside the Applications page for "Mentoring Requests" (id="app-tab-mentoring").
  - This tab will display incoming mentoring requests for the logged-in user.

### src/main.js
- **Navigation**: Update setupDashboardLinks and initialization to support the new mentoring section.
- **Load Mentors**: Create loadMentoring() to fetch all users via listAllUsers(dc), compute their ratings (using Firestore eviews), and render them as cards in #mentoring-users-grid.
- **Apply Flow**:
  - Implement #dialog-mentoring-apply submit event.
  - Call createHelpRequest with equesterId = targetMentor.id, category = 'MENTORING'.
  - Immediately call createApplication with helpRequestId = newly_created_id and priceOffer = amount.
- **Mentoring Tab in Applications**:
  - In loadApplications(), separate standard requests from Mentoring requests (where category === 'MENTORING').
  - Render Mentoring requests into the new "Mentoring Requests" tab.
  - Standard Approve/Reject and Chat logic will naturally inherit from the existing HelpRequest architecture!

## Verification Plan
1. Ensure the UI updates properly when switching to the Mentoring tab.
2. Verify that clicking "Apply" creates the proper DataConnect records.
3. Verify that the targeted Mentor sees the request in their Applications -> Mentoring tab, and can accept it to spawn a chat.
