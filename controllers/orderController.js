import orderModel from "../models/OrderModel.js";
import userModel from "../models/userModel.js";

//placing user order from Frontend 
const placeOrder = async(req, res) => {
    try {
        // Validate the required fields
        const { userId, items, amount, address } = req.body;
        
        if (!userId || !items || !amount || !address) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Create the order with validated data
        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            payment: false,
            paymentMethod: 'COD',
            status: 'Food Processing'
        });
        
        // Save the order
        const savedOrder = await newOrder.save();
        
        // Clear the user's cart
        await userModel.findByIdAndUpdate(
            userId, 
            { cartData: {} },
            { new: true }
        );
        
        return res.status(200).json({
            success: true, 
            message: "Order placed successfully",
            orderId: savedOrder._id
        });

    } catch (error) {
        console.error("Order placement error:", error);
        return res.status(500).json({
            success: false, 
            message: "Error placing order",
            error: error.message
        });
    }
}

//user Order for frontend 
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId: req.body.userId})
        res.json({success: true, data: orders})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Error fetching orders"})
    }
}

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success: true, data: orders})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Error listing orders"})
    }
}

const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, {
            status: req.body.status,
            // If the status is "Delivered", we can also update payment to true
            ...(req.body.status === "Delivered" && {payment: true})
        })
        res.json({success: true, message: "Status updated"})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Error updating status"})
    }
}

export {placeOrder, userOrders, listOrders, updateStatus}