const WatchHistory = require("../Model/watchHistorySchema")

//  ADD HISTORY
const addHistory = async (req, res) => {
  try {
    const { movieId, title, poster } = req.body
    const userId = req.user.id

    const exists = await WatchHistory.findOne({ userId, movieId })

    if (exists) {
      return res.status(200).json({ message: "Already in history" })
    }

    const newHistory = new WatchHistory({
      userId,
      movieId,
      title,
      poster,
    })

    await newHistory.save()

    res.status(201).json(newHistory)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

//  GET HISTORY
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id

    const history = await WatchHistory
      .find({ userId })
      .sort({ createdAt: -1 })

    res.status(200).json(history)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

//  DELETE ONE
const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params

    await WatchHistory.findByIdAndDelete(id)

    res.status(200).json({ message: "Deleted successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

//  CLEAR ALL
const clearHistory = async (req, res) => {
  try {
    const userId = req.user.id

    await WatchHistory.deleteMany({ userId })

    res.status(200).json({ message: "All history cleared" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

//  EXPORT
module.exports = {addHistory,getHistory,deleteHistory,clearHistory}