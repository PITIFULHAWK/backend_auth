import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/myauthapp';

    await mongoose.connect(mongoURL);
    console.log('MongoDB Connected Successfully!');
  } catch (err: any) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

export default connectDB;