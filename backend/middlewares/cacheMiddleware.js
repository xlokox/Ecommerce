import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes

export const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    return res.json(cachedResponse);
  }

  res.originalJson = res.json;
  res.json = (body) => {
    cache.set(key, body);
    res.originalJson(body);
  };
  next();
};