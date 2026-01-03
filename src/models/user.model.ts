import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is a required field"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "email is a required field"],
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "password is a required field"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is a required field"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verify code expiry is a required field"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});


export const User = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);
