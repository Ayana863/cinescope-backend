// require('dotenv').config()
// const cors=require('cors')
// const express = require('express')
// const connectDB = require('./DB/Connection')
// const cookieParser = require("cookie-parser")
// const authRouter = require('./Routes/authRouter')
// const movieRouter=require('./Routes/movieRouter')
// const userRoutes=require('./Routes/userRoutes')
// const watchHistoryRoutes = require("./Routes/watchHistoryRoutes")
// const ratingRoutes = require("./Routes/ratingRouter")

// const app = express()
// app.use(
//   cors({
//     origin: "http://localhost:5173", 
//     credentials: true, 
//   })
// )
// app.use(cookieParser())
// app.use(express.json())
// app.use("/uploads", express.static("uploads"))
// app.use('/auth', authRouter)
// app.use('/admin', movieRouter)
// app.use("/admin/users", userRoutes)
// app.use("/watch-history", watchHistoryRoutes)
// app.use("/ratings", ratingRoutes)



// connectDB().then(() => {
//   app.listen(5000, () => {
//     console.log("Server running on port 5000")
//   })
// })
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./DB/Connection");
const cookieParser = require("cookie-parser");

const authRouter = require("./Routes/authRouter");
const movieRouter = require("./Routes/movieRouter");
const userRoutes = require("./Routes/userRoutes");
const watchHistoryRoutes = require("./Routes/watchHistoryRoutes");
const ratingRoutes = require("./Routes/ratingRouter");

const app = express();

// ✅ CORRECT CORS SETUP
const allowedOrigins = [
  "http://localhost:5000",

];

app.use(
  cors({
    origin: function (origin, callback) {
      // 🔥 DEBUG LOG
      console.log("Origin:", origin);

      // ✅ allow ALL for now (temporary fix)
      callback(null, true);
    },
    credentials: true
  })
);


// ✅ Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static files
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/auth", authRouter);
app.use("/admin", movieRouter);
app.use("/admin/users", userRoutes);
app.use("/watch-history", watchHistoryRoutes);
app.use("/ratings", ratingRoutes);

// ✅ PORT FIX (RENDER)
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });