const express = require("express")
const router = express.Router()

const { getAllUsers, deleteUser, toggleBlockUser, getUserStats} = require("../Controller/userController")

//  Users
router.get("/all-users", getAllUsers)

// Delete
router.delete("/delete/:id", deleteUser)

// Block / Unblock
router.patch("/block/:id", toggleBlockUser)

//  Stats
router.get("/stats", getUserStats)

module.exports = router