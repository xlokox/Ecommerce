import jwt from 'jsonwebtoken';

export const tokenService = {
  generateTokens(userData) {
    const accessToken = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES });
    const refreshToken = jwt.sign(userData, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES });
    
    return { accessToken, refreshToken };
  },

  setTokenCookies(res, { accessToken, refreshToken }) {
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  },

  clearTokenCookies(res) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  }
};