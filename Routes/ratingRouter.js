const express = require("express")
const router = express.Router()

const { addRating, getRatings } = require("../Controller/ratingContoller")

router.post("/add", addRating)
router.get("/:movieId", getRatings)

module.exports = router