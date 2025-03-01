import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  try {
    // שולף את העוגייה בשם accessToken
    const { accessToken } = req.cookies;

    // אם אין טוקן, מחזירים 401 (Unauthorized)
    if (!accessToken) {
      console.log("AuthMiddleware: No token found in cookies.");
      return res.status(401).json({ error: "Unauthorized: No Token" });
    }

    // מנסה לפענח את הטוקן בעזרת הסוד מה־.env
    const decodedToken = jwt.verify(accessToken, process.env.SECRET);

    // שומר את התפקיד וה־id ב־req, כדי שהנתיבים יוכלו להשתמש בהם
    req.role = decodedToken.role;
    req.id = decodedToken.id;

    // ממשיך לנתיב הבא
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    // אם הפענוח נכשל, מחזירים 403 (Forbidden)
    return res.status(403).json({ error: "Forbidden: Invalid Token" });
  }
};

export default authMiddleware;
