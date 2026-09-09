/**
 * Sliding Window Rate Limiter Middleware
 */

const ipStore = new Map();

export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes default
  max = 100, // Max requests per window
  message = 'Too many requests, please try again later.',
} = {}) => {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    if (!ipStore.has(ip)) {
      ipStore.set(ip, []);
    }

    const timestamps = ipStore.get(ip).filter((ts) => now - ts < windowMs);

    if (timestamps.length >= max) {
      const oldest = timestamps[0];
      const resetInSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
      res.setHeader('Retry-After', resetInSeconds);
      return res.status(429).json({
        error: {
          message,
          status: 429,
          retryAfterSeconds: resetInSeconds,
        },
      });
    }

    timestamps.push(now);
    ipStore.set(ip, timestamps);
    next();
  };
};

/**
 * Reset rate limit store (used in test suite)
 */
export const resetRateLimiterStore = () => {
  ipStore.clear();
};
