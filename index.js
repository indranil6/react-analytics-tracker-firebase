const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Add this line to enable CORS

const collection = "react-analytics-tracking-collection";

// POST API to accept payload and store it in Firestore
app.post("/data", async (req, res) => {
  try {
    const data = req.body;
    const docRef = await db.collection(collection).add(data);
    res.status(201).send({ id: docRef.id });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET API to retrieve data where domain = value
app.get("/data", async (req, res) => {
  try {
    const { domain, value } = req.query;
    const snapshot = await db
      .collection(collection)
      .where(domain, "==", value)
      .get();

    if (snapshot.empty) {
      res.status(404).send({ message: "No matching documents found" });
      return;
    }

    const results = [];
    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
