/**
 * Resource Ownership Authorization Middleware
 * Verifies that the authenticated user owns the resource or is an ADMIN
 * 
 * @param {Function} resourceFetcher - Async function (req) => Promise<resource>
 * @param {string} ownerField - Property name on resource holding owner ID (default: 'user' or 'customer' or 'seller')
 */
export const requireOwnership = (resourceFetcher, ownerField = 'user') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // ADMIN has global bypass authority
      if (req.user.role === 'ADMIN') {
        return next();
      }

      const resource = await resourceFetcher(req);
      if (!resource) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      const ownerId = resource[ownerField]?._id || resource[ownerField];
      if (!ownerId) {
        return res.status(500).json({ message: 'Resource ownership field invalid' });
      }

      if (ownerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Access denied: You do not own this resource',
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default requireOwnership;
