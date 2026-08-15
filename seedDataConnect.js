import { initializeApp } from "firebase/app";
import { getDataConnect } from "firebase/data-connect";
import { connectorConfig } from "@work4abit/dataconnect";
import { 
  createUser, 
  createHelpRequest, 
  createApplication,
  updateApplicationStatus,
  createConversation,
  createMessage 
} from "@work4abit/dataconnect";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAu53ZLxN_6p_BKZUWSE6R8aMbn_iKP91s",
  authDomain: "work4abit.firebaseapp.com",
  projectId: "work4abit",
  storageBucket: "work4abit.firebasestorage.app",
  messagingSenderId: "1019650332467",
  appId: "1:1019650332467:web:70a55093445cbf4689d046",
};

const app = initializeApp(firebaseConfig);
getDataConnect(app, connectorConfig);

async function seed() {
  console.log("🌱 Seeding database...");

  const user1Id = "user1_" + Date.now();
  const user2Id = "user2_" + Date.now();

  try {
    // 1. Create Users
    console.log("Creating users...");
    await createUser({
      id: user1Id,
      email: "poster@test.com",
      fullName: "Job Poster",
      studentId: "2021-0001",
      facultyReference: "CPE",
      certificateUrl: "none",
      gender: "Male"
    });

    await createUser({
      id: user2Id,
      email: "applicant@test.com",
      fullName: "Eager Applicant",
      studentId: "2021-0002",
      facultyReference: "CPE",
      certificateUrl: "none",
      gender: "Female"
    });

    // 2. Create Help Request (Job)
    console.log("Creating job...");
    const jobRes = await createHelpRequest({
      title: "Need help building a React App",
      description: "I need someone to help me fix some UI bugs in my React app using Tailwind.",
      budget: 1500,
      requesterId: user1Id,
      category: "Programming",
      urgency: "Urgent",
      deadline: "2026-09-01"
    });
    
    // We get the inserted UUID from the response
    const jobId = jobRes.data.helpRequest_insert.id;

    // 3. Create Application
    console.log("Creating application...");
    const appRes = await createApplication({
      helpRequestId: jobId,
      applicantId: user2Id,
      priceOffer: 1200,
      message: "I have 3 years of experience in React and Tailwind. I can fix this in a day!"
    });
    const appId = appRes.data.application_insert.id;

    // 4. Approve Application & Create Conversation
    console.log("Approving application and starting conversation...");
    await updateApplicationStatus({
      id: appId,
      status: "APPROVED"
    });

    const convRes = await createConversation({
      applicationId: appId,
      posterId: user1Id,
      applicantId: user2Id
    });
    const convId = convRes.data.conversation_insert.id;

    await createMessage({
      conversationId: convId,
      senderId: user2Id,
      content: "Application accepted. Price offer: ₱1200\n\nMessage: I have 3 years of experience in React and Tailwind. I can fix this in a day!"
    });

    await createMessage({
      conversationId: convId,
      senderId: user1Id,
      content: "Awesome! Let's get started. Do you have a github account?"
    });

    console.log("✅ Database seeded successfully!");
    process.exit(0);

  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seed();
