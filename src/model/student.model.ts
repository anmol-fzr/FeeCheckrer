import { Model, model, Schema } from "mongoose";

type IUser = {
  email: string;
  password: string;
};

const userSchema = new Schema<IUser, Model<IUser>>(
  {
    email: {
      type: Schema.Types.String,
      required: true,
      index: true,
      unique: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
      index: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const User = model<IUser>("student", userSchema);

export { User };
