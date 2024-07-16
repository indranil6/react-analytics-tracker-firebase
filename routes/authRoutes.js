const router = require("express").Router();
const {
  registerUser,
  loginUser,
  getTeamMembers,
} = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/team-members", authMiddleware, getTeamMembers);

module.exports = router;
