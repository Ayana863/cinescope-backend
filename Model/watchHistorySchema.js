const mongoose = require('mongoose')

const watchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    title: String,
    poster: String,
  },
  { timestamps: true }
)


module.exports = mongoose.model("WatchHistory", watchHistorySchema)