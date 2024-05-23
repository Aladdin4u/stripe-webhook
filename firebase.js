const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");
const { initializeApp, getApps, cert } = require("firebase-admin/app");

const serviceAccount = require("./serviceAccountKey.json");

const firebaseConfig = {
  credential: cert(serviceAccount),
};
const { getAuth } = require("firebase-admin/auth");

// Initialize Firebase
const app = getApps();

if (!app.length) {
  initializeApp(firebaseConfig);
}

const db = getFirestore();

async function getUser(email) {
  try {
    const user = await getAuth().getUserByEmail(email);
    return user.uid;
  } catch (error) {
    console.error("Error fetching user data: " + error);
  }
}
async function createTransaction(userId, receipt) {
  try {
    const transactionRef = db.collection("transaction").doc();
    const data = await transactionRef.set({
      user_id: userId,
      receipt_url: receipt,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getUser, createTransaction };
