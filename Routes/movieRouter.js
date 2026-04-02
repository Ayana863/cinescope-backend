const express=require('express')
// const authMiddlewear=require('../middleware/CheckToken')
const{addMovie,getAllMovies,getByCategory,getByGenre,updateMovie,deleteMovie}=require('../Controller/movieController')
const movieRouter=express.Router()

// Admin routes
movieRouter.post('/add-movie', addMovie)
movieRouter.patch('/update/:id',  updateMovie)
movieRouter.delete('/delete/:id', deleteMovie)

// NO auth
movieRouter.get('/movies', getAllMovies)
movieRouter.get('/movies/category/:type', getByCategory)
movieRouter.get('/movies/genre/:genre', getByGenre)
movieRouter.get('/client/movie',getAllMovies)



module.exports=movieRouter