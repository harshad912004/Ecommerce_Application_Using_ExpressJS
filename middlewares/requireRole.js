exports.requireRole = (...allowedRoles) => {
     return (req, res, next) => {
          if (!req.user) {
               return res.status(401).render('error', {
                    message: 'Unauthorized. Please login first.'
               });
          }

          const userRole = (req.user.role || '').toLowerCase();
          const allowed = allowedRoles.map((role) => role.toLowerCase());

          if (!allowed.includes(userRole)) {
               return res.status(403).render('error', {
                    message: 'Access Denied. You do not have permission to access this resource.'
               });
          }

          next();
     };
};