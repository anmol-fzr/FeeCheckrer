import { Model, model, ObjectId, Schema } from "mongoose";

type ICourse = {
  name: ObjectId;
  deptId: ObjectId;
  createdBy: ObjectId;
  duration: number; // years 3,4,5 etc...
};

const courseSchema = new Schema<ICourse, Model<ICourse>>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    deptId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    duration: {
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

const Course = model<ICourse>("course", courseSchema);

export { Course };
