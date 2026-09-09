import AuditLog from '../models/auditLog.model.js';

/**
 * Record an append-only audit event in MongoDB
 */
export const recordAuditLog = async ({
  action,
  req,
  user,
  targetResource = {},
  status = 'SUCCESS',
  details = {},
}) => {
  try {
    const actorUser = user || (req && req.user);
    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : '127.0.0.1';
    const userAgent = req ? req.headers['user-agent'] : 'Internal System';

    await AuditLog.create({
      action,
      actor: {
        userId: actorUser ? actorUser._id : null,
        role: actorUser ? actorUser.role : 'GUEST',
        email: actorUser ? actorUser.email : 'anonymous',
      },
      targetResource,
      ipAddress: String(ipAddress),
      userAgent: String(userAgent || ''),
      status,
      details,
    });
  } catch (err) {
    console.error('[Audit Log Error] Failed to write audit event:', err.message);
  }
};

/**
 * Express middleware to automatically log request attempts for critical routes
 */
export const auditMiddleware = (actionName) => {
  return async (req, res, next) => {
    res.on('finish', () => {
      const status = res.statusCode < 400 ? 'SUCCESS' : 'FAILURE';
      recordAuditLog({
        action: actionName,
        req,
        user: req.user,
        status,
        details: { statusCode: res.statusCode, path: req.originalUrl, method: req.method },
      });
    });
    next();
  };
};
