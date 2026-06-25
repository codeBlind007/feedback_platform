import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import sql from "./utils/db.js";
import authRoutes from "./module/auth/auth.routes.js";
import feedbackRoutes from "./module/feedback/feedback.routes.js";
import requestLogger from "./utils/requestLogger.js"

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());
app.use(requestLogger); // Use the request logger middleware
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "server is running",
    })
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});