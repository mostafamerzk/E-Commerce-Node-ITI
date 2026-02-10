import { globalHandler } from "../utils/error handling/globalHandler.js";
import authRouter from "./auth/auth.controller.js";
import userRouter from "./User/user.controller.js";
import cors from "cors";
const bootstrap = async (app, express) => {
  app.use(cors());
  app.use(express.json());

  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  // not found route
  app.use((req, res) => {
    return res.status(404).json({ message: "Route not found" });
  });

  // global err handling
  app.use(globalHandler);
};
export default bootstrap;
