import jwt from "jsonwebtoken";
import logger from "../../utils/logger.js";

const authMiddleware = (req, res, next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Access Denied. No token provided."
            })
        }
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger.error("Token Verification Failed", {
            error: error.message,
            stack: error.stack
        });
        return res.status(401).json({
            success: false,
            message: "Invalid token."
        });
    }
}

export default authMiddleware;