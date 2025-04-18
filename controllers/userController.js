import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bycrypt from "bcrypt"
import validator from "validator"

//login user

const loginUser = async (req,res) =>{

    const {email, password} =req.body
    console.log(email, password)

    try {
        const user=await userModel.findOne({email})
        if (!user){
            return res.json({success:false, message:"User Doesn't exists"})
        }
        const isMatch =await bycrypt.compare(password, user.password)
        if (!isMatch){
            return res.json({success:false, message :"Invalid credentails"})
        }

        const token=createToken(user._id)
        res.json({success:true, token})
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }

}

const createToken =(id)=>{
    return jwt.sign({id}, process.env.JWT_TOKEN)
}

//Register user
const registerUser = async (req,res ) =>{
    const {name, email, password}=req.body
    try {
        //exist or not
    const exists= await userModel.findOne({email});
    if (exists){
        return res.json({success:false, message :"User already exists"})
    }

    if (!validator.isEmail(email)){
        return res.json({success:false, message :"Please enter a valid email"})
    }

    if (password.length<5){
        return res.json({success:false, message: "Please enter a stong password"})
    }

    //hashing user password

    const salt=await bycrypt.genSalt(10)
    const hashedpassword = await bycrypt.hash(password, salt)

    const newUser= new userModel({
        name:name,
        email:email,
        password:hashedpassword
    })

    const user=  await newUser.save()
    const token = createToken(user._id)
     res.json({success:true, token, user})
        
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error while creating uer"})
        
    }
    
    

}


export  {loginUser, registerUser}