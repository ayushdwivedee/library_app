const express = require("express");
const server = express();
const dotenv = require("dotenv");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const connectToDB = require("./config");
const userRouter = require("./routes/user.route");
const bookRouter = require("./routes/book.route");
const cors = require("cors");

dotenv.config();
const port = process.env.PORT;

const logStream = fs.createWriteStream(path.join(__dirname, "logs", "api.log"));
server.use(morgan("combined", { stream: logStream }));
server.use(express.json());
server.use("/user", userRouter);
server.use("/book", bookRouter);
server.use(
  cors({
    origin: "*"
  })
);
server.get("/", (req, res) => {
  res.status(200).json({ msg: "Server is running fine" });
});

server.listen(port, async () => {
  try {
    await connectToDB();
    console.log(`server running on port ${port} and connected to db`);
  } catch (error) {
    console.log(`server error ${error}`);
  }
});
