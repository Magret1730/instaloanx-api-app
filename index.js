import express from "express";
const app = express();
import cors from "cors";
import "dotenv/config";
import usersRoutes from "./routes/users-routes.js";
import loansRoutes from "./routes/loans-routes.js";
import authRoutes from "./routes/auth-routes.js";

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({extended: false}));

const PORT = process.env.PORT || 8081;

app.use("/", express.static("public/images"));

// all routes
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/loans", loansRoutes);
app.use("/api/v1/auth", authRoutes);


app.listen(PORT, () => {
    console.log(`Express server listening on ${PORT}`);
});