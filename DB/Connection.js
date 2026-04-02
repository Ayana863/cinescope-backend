const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_STRING)
        console.log(" MongoDB Connected Successfully");
    } catch (error) {
        console.error(" MongoDB Connection Failed:", error.message);
    }
}
module.exports = connectDB