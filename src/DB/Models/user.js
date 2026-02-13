import mongoose from "mongoose";
import { hash } from "../../utils/hashing/hash.js";
import mongoosePaginate from "mongoose-paginate-v2";

import { roles, providers } from "../../utils/enums/enums.js";
const user = new mongoose.Schema(
  {
    userName: {
      type: String,
      minlength: 5,
      maxlength: 15,
      required: [true, "must have a name"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "you must enter email"],
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) =>
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
        message: "must be a valid email",
      },
    },
    password: {
      type: String,
      required: (data) => {
        return data?.provider == providers.google ? false : true;
      },
      minlength: [8, "password must be at least 8 characters"],
    },
    profilePicture: {
      secure_url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    isAcctivated: { type: Boolean, default: false },

    role: { type: String, enum: Object.values(roles), default: "user" },

    passwordChangeTime: Date,
    isDeleted: { type: Boolean, default: false },
    isLogged: { type: Boolean, default: false },
    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.system,
    },

    phone: { type: String, default: "" },
    address: [
      {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        country: { type: String, default: "" },
        postalCode: { type: String, default: "" },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },
    ],
  },
  { timestamps: true },
);
user.plugin(mongoosePaginate);
user.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = hash({ plainText: this.password });
  }
  return next();
});

export const User = mongoose.model("Users", user);
