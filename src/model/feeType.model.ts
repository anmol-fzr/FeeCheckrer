import { type Model, model, Schema, type Types } from "mongoose";

type IFeeType = {
	name: string;
};

const feeTypeSchema = new Schema<IFeeType, Model<IFeeType>>(
	{
		name: {
			type: Schema.Types.String,
			required: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	},
);

const FeeType = model<IFeeType>("fee-types", feeTypeSchema);

export { FeeType };
