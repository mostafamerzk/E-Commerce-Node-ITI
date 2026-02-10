import mongoose from "mongoose";

export const connectionDB = async () => {
  await mongoose
    .connect(process.env.CONNECTION_URI)
    .then(() => console.log("db connected successfully"))
    .catch((err) => console.log(`db error: ${err.message}`));
};
