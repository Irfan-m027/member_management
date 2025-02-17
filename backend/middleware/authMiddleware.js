const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
    try {
        let token;

        //check if token exist in headers
        if (req.headers.authorization && 
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //Get admin from token
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized to access this route'
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

const adminOnly = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin only route.'
        });
    }
};

module.exports = { protect, adminOnly };