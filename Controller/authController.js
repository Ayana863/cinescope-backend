const User = require("../Model/authSchema")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// REGISTER
const UserRegister = async (req, res) => {
  const { name, email, password, role } = req.body

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let profilePic = ""
    const baseUrl = process.env.BASE_URL || "http://localhost:5000"

    if (req.file) {
      profilePic = `${baseUrl}/uploads/${req.file.filename}`
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      profilePic,
    })

    await newUser.save()

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    })

  } catch (error) {
    console.error("REGISTER ERROR:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}



// LOGIN
const UserLogin = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    )

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })

  } catch (error) {
    console.error("LOGIN ERROR:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}



// UPDATE USER
const updateUser = async (req, res) => {
  try {
    const userId = req.user.id   

    let updateData = {}

    if (req.body.name) {
      updateData.name = req.body.name
    }

    if (req.file) {
      const baseUrl = process.env.BASE_URL || "http://localhost:5000"
      updateData.profilePic = `${baseUrl}/uploads/${req.file.filename}`
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    })

  } catch (error) {
    console.error("UPDATE ERROR:", error)

    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


// VERIFY USER
const verifyUser = (req, res) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      })
    }

    return res.status(200).json({
      success: true,
      message: "User verified",
    })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    })
  }
}


// LOGOUT
const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

      const user = await User.findById(decoded.id) 

      if (user) {
        user.isLoggedIn = false
        await user.save()
      }
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    })

  } catch (error) {
    console.error("LOGOUT ERROR:", error)

    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    })
  }
}


module.exports = {UserRegister, UserLogin, updateUser, verifyUser, logoutUser,}