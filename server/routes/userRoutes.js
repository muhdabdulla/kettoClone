const express = require("express");
const router  = express.Router();
const {
  register,
  signIn,
  checkUsername,
  getUsers,
  getUserById
} = require("../controllers/userController");

// Auth routes
router.post("/register",        register);       // POST /api/users/register
router.post("/signin",          signIn);          // POST /api/users/signin
router.get("/check-username",   checkUsername);  // GET  /api/users/check-username?username=xxx

// User management routes
router.get("/",    getUsers);                    // GET  /api/users
router.get("/:id", getUserById);                 // GET  /api/users/:id

module.exports = router;
