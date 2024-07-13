const { firestore, firebase } = require("../config/firebase");
const formatDate = require("../utils/formatDate");
const { USERS } = require("../constants/collections");
const registerUser = async (req, res) => {
  const { email, password, appName } = req.body;

  try {
    const user = await firebase.auth().createUser({ email, password });

    // Save appName to Firestore under the user's UID
    await firestore.collection(USERS).doc(user.uid).set({ appName });

    res.status(201).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
module.exports = {
  registerUser,
};
