import jwt from 'jsonwebtoken';

export const tokenService = {
  generateTokens(userData) {
    const accessToken = jwt.sign(userData, process.env.JWT_SECRET, {
      expiresIn: '15m',
      algorithm: 'HS256'
    });
    
    const refreshToken = jwt.sign(userData, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
      algorithm: 'HS256'
    });
    
    return { accessToken, refreshToken };
  },

  setTokenCookies(res, { accessToken, refreshToken }) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      path: '/',
      domain: isProduction ? '.your-domain.com' : undefined
    };

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  },

  clearTokenCookies(res) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
  },

  verifyToken(token, isRefresh = false) {
    try {
      return jwt.verify(
        token, 
        isRefresh ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET
      );
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
};
