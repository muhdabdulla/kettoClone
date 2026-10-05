// ==========================================
// CENTRALIZED ERROR HANDLING MIDDLEWARE
// Catches all synchronous and asynchronous route errors
// ==========================================
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Mongoose Bad ObjectId (CastError)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found. Invalid ID format.";
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Mongoose Duplicate Key Error (e.g. unique email)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // Log error stack in server console for debugging
  console.error(`❌ [Error ${statusCode}] ${req.method} ${req.originalUrl}: ${message}`);

  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = errorHandler;
