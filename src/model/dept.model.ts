import { Model, model, ObjectId, Schema } from "mongoose";

type IDept = {
  name: string;
  createdBy: ObjectId;
};

/*
 * The Department Model
 * */
const deptSchema = new Schema<IDept, Model<IDept>>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Dept = model<IDept>("depts", deptSchema);

export { Dept };
