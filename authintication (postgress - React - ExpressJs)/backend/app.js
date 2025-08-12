import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";

const app = express();
app.use(cors());
const PORT = 4000;

app.use(express.json());
app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
