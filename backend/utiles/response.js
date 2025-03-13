/**
 * פונקציה לשליחת תגובות אחידות ל-API
 * @param {Object} res - אובייקט התגובה של Express
 * @param {number} code - קוד הסטטוס של HTTP (200, 400, 500 וכו')
 * @param {Object} data - הנתונים שיוחזרו בתגובה
 * @returns {Object} - תגובת JSON עם הקוד והנתונים המתאימים
 */
export const responseReturn = (res, code, data) => {
  return res.status(code).json(data);
};
