const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      unique: [true, "userName must be unique"],
      require: [true, "user name required"],
      minLength: [3, "userName must be at lest 3 chracters"],
      maxLength: [15, "userName max be 15"],
    },
    email: {
      type: String,
      require: [true, "email required"],
      validate: {
        validator: function (v) {
          return /^[a-zA-Z]{3,8}[0-9]{0,5}(@)(gmail|yahoo|hotmail)(.com)$/.test(
            v
          );
        },
        message: ({ value }) => `${value} is not valid email`,
      },
    },
    password: {
      type: String,
      required: [true, "password required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    refreshTaken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let salt = await bcrypt.genSalt(10);
  let hashedPassword = await bcrypt.hash(this.password, salt); // [ this ] refer to this user who is created now
  this.password = hashedPassword;
});

let userModel = mongoose.model("User", userSchema);

module.exports = userModel;
