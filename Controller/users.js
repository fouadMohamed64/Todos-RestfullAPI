const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getAllUser = async (req, res) => {
  try {
    let users = await userModel.find();
    res.status(200).json({ message: "sucsses", data: users });
  } catch (err) {
    res.status(400).json({ message: "fail to get" });
  }
};

exports.addUser = async (req, res) => {
  let newUser = req.body;
  try {
    let user = await userModel.create(newUser);
    res.status(201).json({ message: "success", data: user });
  } catch (err) {
    res.status(400).json({ message: "fail to add" });
  }
};

exports.getUserByID = async (req, res) => {
  let { id } = req.params;
  console.log(id);
  try {
    let user = await userModel.findById(id);
    if (!user) return res.status(400).json({ message: "fail to get user" });
    res.status(200).json({ message: "succses", data: user });
  } catch (err) {
    res.status(400).json({ message: "not found this user" });
  }
};

exports.deleteUserByID = async (req, res) => {
  let { id } = req.params;
  try {
    let user = await userModel.findByIdAndDelete(id);
    res.status(204).json();
  } catch (err) {
    res.status(400).json({ message: "fail to delete" });
  }
};

exports.updateUserByID = async (req, res) => {
  let { id } = req.params;
  let newUser = req.body;
  try {
    let user = await userModel.findByIdAndUpdate(id, newUser);
    res.status(200).json({ message: "sucsses", data: user });
  } catch (err) {
    res.status(400).json({ message: "fail to update user" });
  }
};

exports.login = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "you must provide email or password" });
  let user = await userModel.findOne({ email: email });
  if (!user) return res.status(404).json({ message: "not found this email" });
  let isVaid = await bcrypt.compare(password, user.password);
  if (!isVaid) return res.status(401).json({ message: "invalid password" });
  // generate  taken
  let taken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
  let refreshTaken = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  await userModel.findOneAndUpdate(
    { _id: user._id },
    { refreshTaken: refreshTaken }
  );
  res.status(200).json({ taken, refreshTaken });
};

exports.refreshTaken = async (req, res) => {
  let { refreshTaken } = req.body;
  if (!refreshTaken)
    res.status(403).json({ message: "refreshTaken is required..." });
  try {
    let decoded = await promisify(jwt.verify)(
      refreshTaken,
      process.env.REFRESH_SECRET
    );
    let user = await userModel.findOne({ _id: decoded.id });
    if (!user || user.refreshTaken != refreshTaken)
      res.status(403).json({ message: "invalid taken" });
    else {
      let refreshTaken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
      );
      res.status(200).json({ token });
    }
  } catch (err) {
    res.status(403).json({ message: "invalid refreshTaken" });
  }
};

exports.viewAllUsers = async (req, res) => {
  let users = await userModel.find();
  res.render("users", { users });
};
