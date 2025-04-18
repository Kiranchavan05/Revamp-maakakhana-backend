import jwt from "jsonwebtoken"

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.token || req.headers.authorization?.split(' ')[1]
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN)
        req.user = decoded
        next()
    } catch (error) {
        console.error("Auth middleware error:", error)
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        })
    }
}

export default authMiddleware