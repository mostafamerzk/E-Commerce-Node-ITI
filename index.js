import "dotenv/config";
import bootstrap from "./src/modules/app.controller.js";
import express from "express";
import { connectionDB } from "./src/DB/connection.js";
const app = express();

await bootstrap(app, express);
await connectionDB();

<<<<<<< HEAD

=======
>>>>>>> 4ecbde4d92f2417f4213691ee5eda2b5539f6ca2
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("server is running on port 3000");
  });
}

export default app;
