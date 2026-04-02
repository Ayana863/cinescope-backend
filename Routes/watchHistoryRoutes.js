const express = require("express")

const {addHistory,getHistory, deleteHistory, clearHistory,} = require("../Controller/watchHistoryController")

const authMiddleware = require("../middleware/CheckToken")

const router = express.Router()

router.post("/add-history", authMiddleware, addHistory)
router.get("/get", authMiddleware, getHistory)
router.delete("/delete/:id", authMiddleware, deleteHistory)
router.delete("/clear", authMiddleware, clearHistory)

module.exports = router