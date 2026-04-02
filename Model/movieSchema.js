const mongoose = require('mongoose')

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    poster: String,
    backdrop: String,

    category: [String],
    genre: [String],

    videoUrl: String,
    releaseDate: {
        type: Date
    },
    description: {
        type: String
    }
})

module.exports = mongoose.model("Movie", movieSchema)