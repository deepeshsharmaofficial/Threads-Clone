import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // To avoid warnings in the console
			useNewUrlParser: true,
			useUnifiedTopology: true,
    });

    console.log('MongoDB Connected Successfully: ', conn.connection.host);

  } catch (error) {
    console.log("Error", error.message);
  }
}

export default connectDB;