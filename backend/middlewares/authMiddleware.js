export const authMiddleware = (req, res, next) => {
  // ביטול בדיקת הטוקן לצורך הדגמה – אל תשתמש כך בסביבת production!
  next();
};

export default authMiddleware;
