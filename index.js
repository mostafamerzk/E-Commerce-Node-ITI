import "dotenv/config";
import bootstrap from "./src/modules/app.controller.js";
import express from "express";
import { connectionDB } from "./src/DB/connection.js";
const app = express();

await bootstrap(app, express);
await connectionDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
