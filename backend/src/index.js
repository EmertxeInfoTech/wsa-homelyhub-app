import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import { router } from "./routes/userRoutes.js";
import { propertyRouter } from "./routes/propertyRouter.js";
import { bookingRouter } from "./routes/bookingRouter.js";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: process.env.ORIGIN_ACCESS_URL,
    credentials: true,
  })
);

console.log(process.env.ORIGIN_ACCESS_URL);
app.use(express.json({ limit: "100mb" })); // ✅ Fix here
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
// app.use(express.json());

const port = process.env.PORT || 8081;

//Run database
connectDB();

//Run Routes
app.use("/api/v1/rent/user", router);
app.use("/api/v1/rent/listing", propertyRouter);
app.use("/api/v1/rent/user/booking", bookingRouter);
//Connection
app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
