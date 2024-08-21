const jwt = require("jsonwebtoken");
const userModel = require("../schema/user.schema");
const auth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({
      msg: ` Token not found  `,
    });
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            msg: ` Invalid token `,
          });
        }
        if (decoded) {
          
          const username = decoded.name;
          const user = await userModel.findOne({ name:username });
          
          if (!user) {
            return res.status(401).json({
              msg: ` User Not found `,
            });
          }
          req.user = user;
          next();
        }
      });
    }
  } catch (error) {
    console.log(`Error occured in auth middleware ${error}`);
  }
};

module.exports=auth
