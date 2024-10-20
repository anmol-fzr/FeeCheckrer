import { Model, model, ObjectId, Schema } from "mongoose";

const roles = ["superadmin", "hod", "clerk", "student"] as const;

type Role = (typeof roles)[number];

type IUser = {
  name: string;
  mobile: number;
  email: string;
  password: string;
  role: Role;
  createdBy?: ObjectId;
  deptId: ObjectId;
};

const userSchema = new Schema<IUser, Model<IUser>>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    mobile: {
      type: Schema.Types.Number,
      required: true,
      index: true,
      unique: true,
    },
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
    role: {
      type: Schema.Types.String,
      enum: roles,
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: false,
      index: true,
    },
    deptId: {
      type: Schema.Types.ObjectId,
      required: false,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const User = model<IUser>("users", userSchema);

export { User };
export type { Role };
