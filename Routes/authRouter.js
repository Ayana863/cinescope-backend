const express=require('express')
const{UserRegister,UserLogin,updateUser,verifyUser,logoutUser}=require('../Controller/authController')
const upload=require('../middleware/upload')
const authMiddlewear=require('../middleware/CheckToken')

const authRouter=express.Router()
// Register
authRouter.post('/register',upload.single("profilePic"),UserRegister)
authRouter.post('/login',UserLogin)
authRouter.patch('/update',authMiddlewear, upload.single("profilePic"), updateUser)
authRouter.get('/verify',authMiddlewear,verifyUser)
authRouter.post('/logout',logoutUser)
module.exports=authRouter