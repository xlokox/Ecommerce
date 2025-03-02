export const authMiddleware = (req, res, next) => {
  // ביטול זמני של האימות
  // (הסר/הגב את כל הקוד הקודם כאן)
  next();
};

export default authMiddleware;
