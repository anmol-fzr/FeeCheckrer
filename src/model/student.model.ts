import { model, Schema } from "mongoose";
import type { Model } from "mongoose";

type IStudent = {
	email: string;
	name: string;
	mobile: number;
	admissionNo: number;
	rollNo: number;
	batch: number;
	avatar?: string;
};

const studentSchema = new Schema<IStudent, Model<IStudent>>(
	{
		email: {
			type: Schema.Types.String,
			required: true,
			index: true,
			unique: true,
		},
		avatar: {
			type: Schema.Types.String,
			required: false,
		},
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

const Student = model<IStudent>("student", studentSchema);

export { Student };
