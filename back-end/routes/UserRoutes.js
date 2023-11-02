const express = require("express");
const router = express.Router();

//Controller
const {
  register,
  login,
  getCurrentUser,
  updateCurrentUser,
  getUserById,
  updateUserById,

} = require("../controllers/UserController");

//middlewares
const validate = require("../middlewares/handleValidation");
const {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
} = require("../middlewares/userValidations");
const authGuard = require("../middlewares/authGuard");

//Routes
router.post("/register", userCreateValidation(), validate, register);
router.post("/login", loginValidation(), validate, login);
router.get("/profile", authGuard, getCurrentUser);
router.put("/", authGuard, userUpdateValidation(), validate, updateCurrentUser)
router.get("/:id", getUserById)
router.put("/permission/:id", authGuard, updateUserById)
module.exports = router;
