import express from "express";
const app = express();
import cors from "cors";
import "dotenv/config";
import { appLimiter, authLimiter } from "./middlewares/rate-limit.js";
import usersRoutes from "./routes/users-routes.js";
import loansRoutes from "./routes/loans-routes.js";
import authRoutes from "./routes/auth-routes.js";

// app.use(cors());
const allowedOrigins = [
    "https://instaloanx.netlify.app",
    "http://localhost:5173",
];

app.use(
    cors({
        origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
        },
        methods: "GET,POST,PUT,DELETE",
        allowedHeaders: "Content-Type,Authorization",
        credentials: true,
    })
);
app.use(express.json());
// app.use(express.urlencoded({extended: false}));

const PORT = process.env.PORT || 8081;

app.use("/", express.static("public/images"));

// all routes
app.use("/api/v1/users", appLimiter, usersRoutes);
app.use("/api/v1/loans", appLimiter, loansRoutes);
app.use("/api/v1/auth", authLimiter, authRoutes);

app.get("/", (req, res) => {
    res.status(200).send("Welcome to InstaloanX API")
});

app.listen(PORT, () => {
    console.log(`Express server listening on ${PORT}`);
});