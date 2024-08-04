const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.auth = async (req, res, next) => {
  let { authorization } = req.headers;
  //   console.log("authorization = ", authorization);
  //   console.log("req.headers = ", req.headers);
  if (!authorization)
    return res.status(401).json({ message: "you must login first" });
  try {
    let decoded = await promisify(jwt.verify)(
      authorization,
      process.env.SECRET
    );
    req.role = decoded.role;
    req.id = decoded.id;
    // console.log("decoded = ", decoded);
    next();
  } catch (err) {
    res.status(401).json({ message: "you are not authontcated" });
  }
};

exports.restrictTo = (...roles) => {
  return function (req, res, next) {
    if (!roles.includes(req.role))
      return res.status(403).json({ message: "you are not authorized" });
    else next();
  };
};
