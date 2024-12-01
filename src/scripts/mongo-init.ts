import { passHelper } from "@/helper";
import { User } from "@/model";
import { connnectMongo } from "@/config";
import { envs } from "@/utils";

const { EMAIL, PASSWORD, NAME, MOBILE } = envs.SA;

async function onInit() {
	connnectMongo();

	const foundSA = await User.findOne({ role: "superadmin" });

	if (foundSA) {
		console.log("A Superadmin already Exists Exiting ...");
		process.exit(1);
	}

	const password = await passHelper.getHashedPassword(PASSWORD);

	const sa = new User({
		name: NAME,
		role: "superadmin",
		email: EMAIL,
		password,
		mobile: Number(MOBILE),
	});

	try {
		const savedSA = await sa.save();
		console.log("Superadmin Created SuccessFully with creds ", savedSA);
		process.exit(0);
	} catch (error) {
		console.log("Unable to Create a new superadmin");
		console.log(error);
		process.exit(1);
	}
}

onInit();
