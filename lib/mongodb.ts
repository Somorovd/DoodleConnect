import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      retryWrites: true,
    });
  } catch (error) {
    console.log("Error connecting to MongoDB\n", error);
  }
};

export default connectMongoDB;
