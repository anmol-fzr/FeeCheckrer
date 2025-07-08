import { connnectMongo } from "../config";

const startup = () => {
	connnectMongo();
};

export { startup };
