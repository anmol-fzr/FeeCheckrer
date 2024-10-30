import { Model, model, Schema, Types } from "mongoose";

const feeStatuses = ["pending", "accepted", "rejected"] as const;
const feeTypes = [
  "Full Fee",
  "PMSS 40",
  "PMSS 60",
  "PMSS 100",
  "Scholarship Bihar",
  "Scholarship J & K",
  "Pre-registration",
  "Re-appear",
  "Any Other",
] as const;
type Status = (typeof feeStatuses)[number];

type IFee = {
  sbCollRef: string;
  amount: number;
  sem: number;
  feeType: string;
  hostelFeeAmount: number;
  securityAmount: number;
  fineAmount: number;
  studentId: Types.ObjectId;
  status: Status;
  rejection?: string;
};

const feeSchema = new Schema<IFee, Model<IFee>>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    sbCollRef: {
      type: Schema.Types.String,
      required: true,
    },
    amount: {
      type: Schema.Types.Number,
      required: true,
    },
    sem: {
      type: Schema.Types.Number,
      required: true,
    },
    feeType: {
      type: Schema.Types.String,
      enum: feeTypes,
      required: true,
    },
    hostelFeeAmount: {
      type: Schema.Types.Number,
      required: true,
    },
    securityAmount: {
      type: Schema.Types.Number,
      required: true,
    },
    fineAmount: {
      type: Schema.Types.Number,
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: feeStatuses,
      default: "pending",
    },
    rejection: {
      type: Schema.Types.String,
      enum: feeStatuses,
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Fee = model<IFee>("fees", feeSchema);

export { Fee };
export { feeStatuses, feeTypes };
