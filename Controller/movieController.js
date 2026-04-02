const Movie = require('../Model/movieSchema')

//  Add Movie
const addMovie = async (req, res) => {
  try {
    const { title, poster, category, genre, videoUrl, releaseDate, description } = req.body

    // validation
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and Category are required"
      })
    }

    const movie = await Movie.create({
      title,
      poster,
      category,
      genre,
      videoUrl,
      releaseDate,
      description
    })

    res.status(201).json({
      success: true,
      message: "Movie added successfully",
      data: movie
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get All Movies
const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find()

    res.json({
      success: true,
      data: movies
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// Get by Category
const getByCategory = async (req, res) => {
  try {
    const { type } = req.params

    const movies = await Movie.find({
      category: { $regex: type, $options: "i" }
    })

    res.json({
      success: true,
      data: movies
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//  Get by Genre
const getByGenre = async (req, res) => {
  try {
    const { genre } = req.params

    const movies = await Movie.find({
      genre: { $regex: genre, $options: "i" }
    })

    res.json({
      success: true,
      data: movies
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//  Update Movie
const updateMovie = async (req, res) => {
  try {
    const { id } = req.params

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { $set: req.body }, 
      { new: true } //
    )

    if (!updatedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      })
    }

    res.json({
      success: true,
      message: "Movie updated successfully",
      data: updatedMovie
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

//  Delete Movie
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params

    const deletedMovie = await Movie.findByIdAndDelete(id)

    if (!deletedMovie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      })
    }

    res.json({
      success: true,
      message: "Movie deleted successfully"
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {addMovie, getAllMovies, getByCategory, getByGenre, updateMovie, deleteMovie}