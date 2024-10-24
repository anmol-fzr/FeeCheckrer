import { Model, model, Schema } from "mongoose";

type IStudentDetailsModel = {
  name: string;
  mobile: number;
  admissionNo: number;
  rollNo: number;
  batch: number; // will show current to back 5 years only
};

const studentDetailsSchema = new Schema<
  IStudentDetailsModel,
  Model<IStudentDetailsModel>
>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    mobile: {
      type: Schema.Types.Number,
      required: true,
    },
    admissionNo: {
      type: Schema.Types.Number,
      required: true,
      index: true,
      unique: true,
    },
    rollNo: {
      type: Schema.Types.Number,
      required: true,
      index: true,
      unique: true,
    },
    batch: {
      type: Schema.Types.Number,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const StudentDetails = model<IStudentDetailsModel>(
  "studentDetails",
  studentDetailsSchema,
);

export { StudentDetails };
