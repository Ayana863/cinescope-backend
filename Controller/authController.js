const User = require("../Model/authSchema")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')

// REGISTER
const UserRegister = async (req, res) => {
  const { name, email, password } = req.body

  try {
    //  Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    //  Check existing user
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Handle uploaded image
    let profilePic = ""
    if (req.file) {
      profilePic = `http://localhost:3000/uploads/${req.file.filename}`
    }

    //  Create new user 
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    role: role || "user",
      profilePic
    })

    //  Save user
    await newUser.save()

    //  Response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,

        profilePic: newUser.profilePic
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}



// LOGIN

const UserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,  
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPDATE USER
const updateUser = async (req, res) => {
  try {
    console.log("BODY:", req.body)
    console.log("FILE:", req.file)

    const userId = req.user.userId

    let updateData = {}

    if (req.body.name) {
      updateData.name = req.body.name
    }

    if (req.file) {
      updateData.profilePic = `http://localhost:5000/uploads/${req.file.filename}`
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    )

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    })

  } catch (error) {
    console.log("ERROR:", error)
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


const verifyUser = (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized" })
    }

    return res.status(200).json({ success: true, message: "User verified" })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" })
  }
}


// LOGOUT
const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

      const user = await User.findById(decoded.userId)

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
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    })
  }
}




module.exports = { UserRegister, UserLogin, updateUser, verifyUser, logoutUser }

