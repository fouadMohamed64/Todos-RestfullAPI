const express = require("express");
const router = express.Router();

const {
  getAllUser,
  addUser,
  getUserByID,
  deleteUserByID,
  updateUserByID,
  login,
  refreshTaken,
  viewAllUsers,
} = require("../Controller/users");

router.get("/", getAllUser);
router.post("/", addUser);
router.get("/:id", getUserByID);
router.delete("/:id", deleteUserByID);
router.patch("/:id", updateUserByID);
router.post("/login", login);
router.post("/refreshTaken", refreshTaken);
router.get("/view/api", viewAllUsers);

module.exports = router;
