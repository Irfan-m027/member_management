const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { Member, User } = require('../models'); 

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
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

        // Find admin user
        const user = await User.findOne({ 
            where: { 
                username,
                role: 'admin'
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        await user.update({ lastLogin: new Date() });

        // Generate token
        const token = generateToken(user.id);

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

const getAdminProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

const updateMemberVerification = async (req, res) => {
    try {
        const { memberId } = req.params;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const member = await Member.findByPk(memberId);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        await member.update({
            is_verified: true,
            verified_by: userId,
            verified_at: new Date()
        });

        return res.json({
            message: 'Member verified succesfully',
            member: {
                ...member.toJSON(),
                verifier: {
                    username: user.username
                }
            }
        });
    } catch (error) {
        console.error('Error in updateMemberVerification:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getMembers = async (req, res) => {
    try {
        const members = await Member.findAll({
            include: [{
                model: User,
                as: 'verifier',
                attributes: ['username'],
            }],
        });

        return res.json({ data: members });
    } catch (error) {
        console.error('Error in getMembers', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { loginAdmin, getAdminProfile, updateMemberVerification, getMembers };