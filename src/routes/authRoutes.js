const router = require("express").Router();
const { registerUser } = require("../controllers/authController");

router.post("/register", registerUser);

module.exports = router;
