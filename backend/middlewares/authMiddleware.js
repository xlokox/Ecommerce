export const authMiddleware = (req, res, next) => {
  // ביטול בדיקת הטוקן לצורך הדגמהת production!
  next();
};

export default authMiddleware;


// import jwt from 'jsonwebtoken';  // ייבוא מודול של jsonwebtoken לאימות טוקנים

// // הגדרת ה-middleware לאימות טוקן
// export const authMiddleware = (req, res, next) => {
//   // ניסיון לשלוף את הטוקן מה-header של הבקשה
//   const token = req.header('Authorization');  // הטוקן בדרך כלל נמצא ב-"Authorization" header

//   // אם אין טוקן, מחזירים שגיאה 401
//   if (!token) {
//     return res.status(401).json({ message: 'Access denied. No token provided.' });
//   }

//   // אם יש טוקן, אנחנו מנסים לאמת אותו
//   try {
//     // Verify הטוקן, ומחזירים את המידע אם הוא תקין
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);  // ה-secret צריך להיות אותו secret שהשתמשנו בו בהנפקת הטוקן
//     req.user = decoded;  // שמירה של המידע המפוענח מהטוקן בתוך ה-req כדי שנוכל להשתמש בו בהמשך
//     next();  // אם הטוקן תקין, נמשיך לשלבים הבאים
//   } catch (error) {
//     // אם יש בעיה עם הטוקן (כמו שהוא לא תקין), מחזירים שגיאה 400
//     return res.status(400).json({ message: 'Invalid token' });
//   }
// };

// export default authMiddleware;
