const mongoose = require("mongoose")

const authSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    profilePic: {
      type: String,
      default: ""
    },

    isLoggedIn: {
      type: Boolean,
      default: false
    },


    isPremium: {
      type: Boolean,
      default: false
    },


    subscriptionAmount: {
      type: Number,
      default: 0
    },
    isBlocked: {
      type: Boolean,
      default: false
    }

  },

  { timestamps: true }
)

module.exports = mongoose.model("User", authSchema)