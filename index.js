require('dotenv').config()

const cors = require('cors')
const express = require('express')
const connectDB = require('./DB/Connection')
const cookieParser = require("cookie-parser")

const authRouter = require('./Routes/authRouter')
const movieRouter = require('./Routes/movieRouter')
const userRoutes = require('./Routes/userRoutes')
const watchHistoryRoutes = require("./Routes/watchHistoryRoutes")
const ratingRoutes = require("./Routes/ratingRouter")

const app = express()

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://mern-cine-project-gdf4kaape-ayana-ms-projects.vercel.app/"
]

// CORS setup
app.use(cors({
  origin: function (origin, callback) {
    // Allow tools like Postman
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error("Not allowed by CORS"))
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}))

// Middlewares
app.use(express.json())
app.use(cookieParser())

//  Static files
app.use("/uploads", express.static("uploads"))

// Routes
app.use('/auth', authRouter)
app.use('/admin', movieRouter)
app.use("/admin/users", userRoutes)
app.use("/watch-history", watchHistoryRoutes)
app.use("/ratings", ratingRoutes)

// Connect DB and start server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000")
  })
})