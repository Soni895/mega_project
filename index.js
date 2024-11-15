const express = require("express");
const app = express();
app.use(express.json());
require("dotenv").config();
const { db_connect } = require("./config/db_connect");
const port = process.env.port || 4000;
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const Cors = require("cors");
const fileupload = require("express-fileupload");
const { cloudinary_connect } = require("./config/cloudinary_connect");
const CourseRoutes = require("./routes/courses");
const PaymentRoutes = require("./routes/payments");
const ProfileRoutes = require("./routes/profile");
const UserRoutes = require("./routes/User");
const ContactUsRoutes= require("./routes/ContactUs");
app.use(
  Cors({
    origin: "http://localhost:3000",
    Credential: true,
  })
);

app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);



app.listen(port, () => {
  console.log("server startted successfully", port);
});

// mount the route

app.use("/api/v1/Course", CourseRoutes);    
app.use("/api/v1/Profile", ProfileRoutes); //6 routes     //  one route pending get all enrolled courses   //completed
app.use("/api/v1/Payment", PaymentRoutes);   //pending
app.use("/api/v1/Auth", UserRoutes);  //6 routes                 //completed
app.use("/api/v1/Contact", ContactUsRoutes);  // 1 routes     //completed

app.get("*", (req, res) => {
  res.send("hi");
});
db_connect();
cloudinary_connect();

