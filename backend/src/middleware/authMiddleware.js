const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user && (req.user.role === 'ADMIN' || req.user.isSuperAdmin)) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admin only' });
    }
};

const superAdminMiddleware = (req, res, next) => {
    if (req.user && req.user.isSuperAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Super Admin only' });
    }
};

module.exports = { authMiddleware, adminMiddleware, superAdminMiddleware };
