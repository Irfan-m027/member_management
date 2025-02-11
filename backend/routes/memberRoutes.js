const express = require('express');
const { Member } = require('../models');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
    try {
        const members = await Member.findAll();
        res.status(200).json({
            success: true,
            data: members
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        console.log("Request Body:", req.body);
      const member = await Member.create(req.body);
      res.status(201).json({
        success: true,
        data: member
      });
    } catch (error) {
        console.error("Database Error:", error); 
      res.status(500).json({
        success: false,
        message: 'Server Error'
      });
    }
  });

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const member = await Member.findByPk(id);
        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        await member.update(req.body);

        res.status(200).json({
            success: true,
            data: member
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const member = await Member.findByPk(id);

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        await member.destroy();

        res.status(200).json({
            success: true,
            message: 'Member deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;