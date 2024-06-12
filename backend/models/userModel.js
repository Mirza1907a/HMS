const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

userSchema.statics.signup = async function (
  first_name,
  last_name,
  email,
  phoneNumber,
  password,
) {
  const exists = await this.findOne({ email });
  //validation
  if (!first_name || !last_name || !email || !password || !phoneNumber) {
    throw Error("All fields must be filled ");
  }
  if (!validator.isEmail(email)) {
    throw Error(`Email isn't valid`);
  }
  if (!validator.isStrongPassword(password)) {
    throw Error(`Password not strong enough`);
  }

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    first_name,
    last_name,
    email,
    phoneNumber,
    password: hash,
  });

  return user;
};

userSchema.statics.updatePassword = async function (
  password,
  newPassword,
  userId
) {
  if (!password || !newPassword) {
    throw new Error("All fields must be filled");
  }

  const user = await this.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Incorrect password");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedNewPassword;
  await user.save();

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled ");
  }
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return user;
};
module.exports = mongoose.model("User", userSchema);
