class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
  }
}

const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);

const notFound = (req, res, next) =>
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return;
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal server error';
  let errors = error.details;
  if (error.name === 'ValidationError') {
    statusCode = 422;
    errors = Object.values(error.errors).map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }
  if (error.code === 11000) {
    statusCode = 409;
    errors = Object.keys(error.keyPattern || {}).map((field) => ({
      field,
      message: `${field} already exists`,
    }));
    message = 'Duplicate resource';
  }
  if (error.name === 'CastError') statusCode = 400;
  res
    .status(statusCode)
    .json({
      success: false,
      message,
      ...(errors ? { errors } : {}),
      ...(process.env.NODE_ENV === 'development' ? { stack: error.stack } : {}),
    });
};

module.exports = { AppError, asyncHandler, notFound, errorHandler };
