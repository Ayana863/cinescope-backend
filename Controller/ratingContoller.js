// controllers/ratingController.js
const Rating = require("../Model/RatingSchema")

//  ADD OR UPDATE RATING
const addRating = async (req, res) => {
  try {
    const { movieId, movieTitle, rating, review, userId } = req.body

    if (!movieId || !rating || !userId) {
      return res.status(400).json({ message: "Missing fields" })
    }

    //  CHECK EXISTING RATING
    let existingRating = await Rating.findOne({ movieId, userId })

    if (existingRating) {
      // UPDATE
      existingRating.rating = rating
      existingRating.review = review
      await existingRating.save()

    } else {
      // CREATE (FIRST TIME)
      const newRating = new Rating({
        movieId,
        movieTitle,
        rating,
        review,
        userId
      })

      await newRating.save()
    }

    //  RETURN UPDATED AVG + COUNT
    const ratings = await Rating.find({ movieId })

    const total = ratings.length

    const avg =
      total > 0
        ? ratings.reduce((acc, r) => acc + r.rating, 0) / total
        : 0

    res.status(200).json({
      totalRatings: total,
      averageRating: Number(avg.toFixed(1))
    })

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message })
  }
}



//  GET RATINGS 
// const getRatings = async (req, res) => {
//   try {
//     const ratings = await Rating.find({ movieId: req.params.movieId })

//     const total = ratings.length

//     const avg =
//       total > 0
//         ? ratings.reduce((acc, r) => acc + r.rating, 0) / total
//         : 0

//     res.json({
//       totalRatings: total,
//       averageRating: Number(avg.toFixed(1))
//     })

//   } catch (err) {
//     res.status(500).json({ error: err.message })
//   }
// }
const getRatings = async (req, res) => {
  try {
    const { movieId } = req.params

    if (!movieId) {
      return res.status(400).json({ message: "movieId is required" })
    }

    const ratings = await Rating.find({ movieId })

    const total = ratings.length

    const avg =
      total > 0
        ? ratings.reduce((acc, r) => acc + r.rating, 0) / total
        : 0

    res.json({
      totalRatings: total,
      averageRating: Number(avg.toFixed(1))
    })

  } catch (err) {
    console.log("GET RATING ERROR:", err) // 👈 important
    res.status(500).json({ error: err.message })
  }
}
module.exports = { addRating, getRatings }