import admin from "firebase-admin";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Initialize Firebase Admin once
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    }

    const db = admin.firestore();

    await db.collection("leads").add({
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("🔥 FIRESTORE ERROR:", err);
    return res.status(500).json({ error: "Failed to save email" });
  }
}
