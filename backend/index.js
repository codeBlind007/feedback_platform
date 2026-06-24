import express from "express";
import dotenv from "dotenv";
import sql from "./utils/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "server is running",
    })
})

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});