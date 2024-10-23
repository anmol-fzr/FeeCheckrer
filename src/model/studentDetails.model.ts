import { Model, model, ObjectId, Schema } from "mongoose";

type IUser = {
  name: string;
  mobile: number;
  admissionNo: number;
  rollNo: number;

  studentId: ObjectId; // DB internal
  deptId: ObjectId;
  courseId: ObjectId;
  batch: number; // will show current to back 5 years only
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

const User = model<IUser>("studentDetails", userSchema);

export { User };
