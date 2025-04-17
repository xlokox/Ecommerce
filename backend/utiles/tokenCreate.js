// 📌 מייבא את הספרייה jsonwebtoken (JWT) ליצירת טוקנים
import jwt from 'jsonwebtoken';

/**
 * 📌 פונקציה ליצירת טוקן (JWT) עבור משתמשים
 * @param {Object} data - הנתונים שנרצה לקודד בתוך הטוקן (למשל, מזהה המשתמש ותפקידו)
 * @returns {string} - מחזיר מחרוזת (String) שהיא ה-Token שנוצר
 */
export const createToken = (data) => {
  return jwt.sign(
    data, // 🔹 הנתונים שנקודד בתוך הטוקן (אובייקט עם מידע על המשתמש)
    process.env.JWT_SECRET || 'your-very-long-secret-key-here', // 🔹 מפתח סודי (Secret Key) ששומר על אבטחת הטוקן (נמצא ב-.env)
    { expiresIn: '7d' } // 🔹 קובע שתוקף הטוקן יפוג אחרי 7 ימים
  );
};
