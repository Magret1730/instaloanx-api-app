// Handles Rate Limit Request (Number of request per a given period of time)
import { rateLimit } from 'express-rate-limit';

// Handles auth controllers rate limit (15 requests per 15 minutes)
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 15, // Limit each IP to 15 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests from this IP, please try again later.",
});

// Handles other controllers within the application (150 requests per 15 minutes)
export const appLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 150, // Limit each IP to 150 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Too many requests from this IP, please try again later.",
});
