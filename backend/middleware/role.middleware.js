/**
 * Role-Based Access Control (RBAC) Authorization Middleware
 * @param {...string} allowedRoles - List of authorized roles (e.g. 'ADMIN', 'SELLER', 'CUSTOMER')
 */
export const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Role '${req.user.role}' is not authorized to access this resource. Required role(s): [${allowedRoles.join(', ')}]`,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
      });
    }

    next();
  };
};

export default requireRole;
