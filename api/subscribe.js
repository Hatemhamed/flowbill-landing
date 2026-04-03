import admin from "firebase-admin";

export default async function handler(req, res) {
  try {
    console.log("DEBUG: PROJECT_ID =", process.env.FIREBASE_PROJECT_ID);
    console.log("DEBUG: CLIENT_EMAIL =", process.env.FIREBASE_CLIENT_EMAIL);
    console.log("DEBUG: PRIVATE_KEY length =", process.env.FIREBASE_PRIVATE_KEY?.length);

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("🔥 FIREBASE INIT ERROR:", err);
    return res.status(500).json({ error: "Init failed", details: err.message });
  }
}
