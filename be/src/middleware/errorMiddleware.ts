import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
}

// Centralized Error Handling Middleware
const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "dev" ? err.stack : undefined, // Hide stack trace in production
  });
};

export default errorHandler;
