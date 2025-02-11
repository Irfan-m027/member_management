const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { Admin } = require('../models');

const generateToken = (id) => {
    return jwt.sign({ id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide username and password'
            });
        }

        const admin = await Admin.findOne({ where: { username }});

        if(!admin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Credentials'
            });
        }

        const isMatch = await bcryptjs.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Credentials'
            });
        }
        console.log("JWT_SECRET:", process.env.JWT_SECRET);
        const token = generateToken(admin.id)

        res.status(200).json({
            success: true,
            token
        });

    } catch (error) {
        console.error(error);
        
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

const getAdmin = async (req, res) => {
    try {
        const admin = await Admin.findByPk(req.admin.id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Deep Error'
        });
    }
};

module.exports = { loginAdmin, getAdmin };