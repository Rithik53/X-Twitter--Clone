import * as dotenv from "dotenv";
import { initserver } from "./app";

dotenv.config();
async function init() {
  const app = await initserver();
  app.listen(8000, () => console.log("server started at port:8000"));
}

init();
