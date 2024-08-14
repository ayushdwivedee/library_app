const express = require("express");
const userModel = require("../schema/user.schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.post("/register", (req, res) => {
  const { name, email, password, roles } = req.body;
  try {
    bcrypt.hash(password, 5, function (err, hash) {
      if (err) {
        return res
          .status(501)
          .json({ msg: `error occured while hashing ${err}` });
      }
      const user = new userModel({ name, email, password: hash, roles });
      user.save();
      res.status(201).json({ msg: `user registered successfully` });
    });
  } catch (error) {
    console.log(`error occured while registering the user ${error}`);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(501).json({ msg: `user not found !` });
    }
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res
          .status(501)
          .json({ msg: `error occured while login user ${err}` });
      }
      if (result) {
        const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET_KEY);
        res.status(201).json({ msg: "Login successfull", token });
      } else {
        return res.status(400).json({
          msg: `wrong password ,error in result using bcrypt compare the user  `,
        });
      }
    });
  } catch (error) {
    console.log(`error email , please enter the correctOne ${error}`);
  }
});

module.exports = userRouter;
