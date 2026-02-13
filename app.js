import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userroutes.js";

dotenv.config();
const app = express();
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));

app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => 
    console.log(`Server running on port ${process.env.PORT}`)
);