const jwt = require("jsonwebtoken")

const checkToken = (req, res, next) => {
  let token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null)

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized - No Token",
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    console.log("Decoded User:", decoded)


    req.user = decoded

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or Expired Token",
    })
  }
}

module.exports = checkToken