import express from "express";
const app = express();
import cors from "cors";
import "dotenv/config";
import usersRoutes from "./routes/users-routes.js";

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8081;

app.use("/", express.static("public/images"));

// all routes
app.use("/api/users", usersRoutes);


app.listen(PORT, () => {
    console.log(`Express server listening on ${PORT}`);
});