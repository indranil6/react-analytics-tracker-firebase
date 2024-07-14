const { firebase, firestore } = require("../config/firebase");

const authMiddleware = async (req, res, next) => {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  const appName = req.headers.appname || req.query?.appname;

  if (!idToken) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  try {
    const decodedToken = await firebase.auth().verifyIdToken(idToken);
    const userDoc = await firestore
      .collection("users")
      .doc(decodedToken.uid)
      .get();

    if (!userDoc.exists) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const userAppName = userDoc.data().appName;

    if (userAppName !== appName) {
      return res.status(403).send({ message: "Forbidden" });
    }

    req.user = decodedToken;
    req.appName = userAppName;
    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthorized", error: error.message });
  }
};

module.exports = authMiddleware;
