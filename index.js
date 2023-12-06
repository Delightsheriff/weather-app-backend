require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

const authRoute = require("./routes/authRoute");

app.use("/api", authRoute);

//test
app.get("/api/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Server" });
});
//server listening
const PORT = process.env.PORT || 5000;
try {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
} catch (err) {
  console.error(`Error starting the server: ${err.message}`);
}
