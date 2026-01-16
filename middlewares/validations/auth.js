const authMiddleware = (req, res, next) => {
  // Bu projede kullanıcı doğrulama yok
  // Gerekli olursa JWT / session burada kontrol edilir
  next();
};

module.exports = authMiddleware;
