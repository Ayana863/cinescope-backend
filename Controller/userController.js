const User = require("../Model/authSchema")


//  Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")

    res.status(200).json({
      success: true,
      data: users
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


//  Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


//  Block / Unblock User
const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    user.isBlocked = !user.isBlocked
    await user.save()

    res.status(200).json({
      success: true,
      message: user.isBlocked
        ? "User blocked successfully"
        : "User unblocked successfully"
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


//  Admin Dashboard Stats
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()

    const loggedInUsers = await User.countDocuments({
      isLoggedIn: true
    })

    const premiumUsers = await User.countDocuments({
      isPremium: true
    })

    //  Revenue 
    const revenueData = await User.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$subscriptionAmount" }
        }
      }
    ])

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      totalUsers,
      loggedInUsers,
      premiumUsers,
      totalRevenue
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


module.exports = { getAllUsers, deleteUser, toggleBlockUser, getUserStats}