import { Model, model, ObjectId, Schema } from "mongoose";

type IStudent = {
  email: string;
  isVerified: boolean;
  password: string;
  details?: ObjectId;
};

const studentSchema = new Schema<IStudent, Model<IStudent>>(
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
    },
    isVerified: {
      type: Schema.Types.Boolean,
      default: false,
      required: false,
    },
    details: {
      type: Schema.Types.ObjectId,
      ref: "studentDetails",
      default: null,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Student = model<IStudent>("student", studentSchema);

export { Student };
