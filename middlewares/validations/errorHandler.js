const { APIError } = require("../../utils/errors");

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  return res.status(500).json({
    success: false,
    message: "Bir hata ile karşılaşıldı. Lütfen API sağlayıcınızla iletişime geçin."
  });
};

module.exports = errorHandlerMiddleware;
