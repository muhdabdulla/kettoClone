const express = require("express");
const router  = express.Router();
const {
  register,
  signIn,
  checkUsername,
  getUsers,
  getUserById,
  getMe
} = require("../controllers/userController");

// Auth routes
router.post("/register",        register);       // POST /api/users/register
router.post("/signup",          register);       // POST /api/users/signup (alias)
router.post("/signin",          signIn);         // POST /api/users/signin
router.post("/login",           signIn);         // POST /api/users/login (alias)
router.get("/check-username",   checkUsername);  // GET  /api/users/check-username?username=xxx
router.get("/me",               getMe);          // GET  /api/users/me?id=xxx

// User management routes
router.get("/",    getUsers);                    // GET  /api/users
router.get("/:id", getUserById);                 // GET  /api/users/:id

module.exports = router;
