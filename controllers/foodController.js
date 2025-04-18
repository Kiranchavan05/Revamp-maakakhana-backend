import foodModel from "../models/foodModel.js";
import fs from "fs"


//add food item 

    const addFood = async (req, res) => {
        try {
            // Check if file exists
            if (!req.file) {
                return res.status(400).json({ 
                    success: false, 
                    message: "No image file provided" 
                });
            }

            const image_filename = req.file.filename;

            const food = new foodModel({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                image: image_filename
            });

            await food.save();
            res.json({ success: true, message: "Food Added successfully", food });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Error adding food item" });
        }
    }


    const  listFood =async (req, res)=>{
        try {
            const foods=await foodModel.find({});
            res.json({success:true, data:foods})
            
        } catch (error) {
            console.log(error)
            res.json({success:false, message:"Error"})
        }

    } 

//remove food Item
    const removeFood = async (req,res) =>{
        try {
            const food= await foodModel.findById(req.body.id)
            console.log(food, "food remove")
            fs.unlink(`uploads/${food.image}`, ()=>{})

            await foodModel.findByIdAndDelete(req.body.id)
            res.json({success:true, message:"Food Removed successfully"})
            
        } catch (error) {
            console.log(error)
            res.json({success:false, message:"Error"})
            
        }
    }

export {addFood, listFood, removeFood }