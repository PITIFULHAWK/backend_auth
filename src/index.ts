import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.routes";
import connectDB from "./config/db";

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRoute);

app.get("/", (req, res) => {
    res.send("Auth API is running!");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
