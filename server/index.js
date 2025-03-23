import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

const app = express();
const PORT = process.env.PORT || 8000;

//connecting database
mongoose
  .connect(process.env.MONGO_URL, {
    dbName: "mern_auth",
  })
  .then(() => console.log("Mongo Database Connected"))
  .catch((err) => console.log(`Error connecting Database, ${err}`));

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

//api routes
app.get("/", (req, res) => {
  res.send("hello, server is runnning");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
