import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://kiranchavan0502:123projectkiran@cluster0.xi9mf.mongodb.net/food-del').then(()=>{
        console.log("DB connected")
    })
}

