import jwt from "jsonwebtoken";
import logger from "../../utils/logger.js";
import AppError from "../../utils/AppError.js";

const authMiddleware = (req, res, next) => {
    try{
        const token = req.cookies.token;

        if(!token){
            throw new AppError("Authentication token is missing", 401);
        }
       
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError("Internal Server Error", 500);
    }
}

export default authMiddleware;