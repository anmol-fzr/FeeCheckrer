import mongoose from "mongoose";

const connnectMongo = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("MongoDB Already Connected");
      return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected Successfully ");
  } catch (error: Error | any) {
    console.log(error);
    console.log("error connecting mongodb");
  }
};

export { connnectMongo };
