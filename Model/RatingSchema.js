const mongoose = require("mongoose")

const ratingSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  movieTitle: String,
  rating: Number,
  review: String,
  userId: String
}, { timestamps: true })

module.exports = mongoose.model("Rating", ratingSchema)