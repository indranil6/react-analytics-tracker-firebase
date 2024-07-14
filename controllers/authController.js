const { firestore, firebase } = require("../config/firebase");
const formatDate = require("../utils/formatDate");
const { USERS } = require("../constants/collections");
const registerUser = async (req, res) => {
  const { uid, appName } = req.body;

  try {
    // Save appName to Firestore under the user's UID
    await firestore.collection(USERS).doc(uid).set({ appName });

    res.status(201).send({ uid });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { uid } = req.body;
  try {
    // find user and user appName
    const user = await firestore.collection(USERS).doc(uid).get();
    if (!user.exists) {
      return res.status(400).send({ message: "User does not exist" });
    }
    const { appName } = user.data();

    res.status(200).send({ appName, uid });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
