const express = require('express');
const { Member, sequelize, ParentId, Marriage } = require('../models');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { Op, where } = require('sequelize');
const { v4: uuidv4 } = require('uuid'); 
const memberController = require('../controllers/authController');

const router = express.Router();

router.use(protect);
router.use(adminOnly);

//Get all members 
router.get('/', async (req, res) => {
    try {
        const members = await Member.findAll({
            include: [
                {
                model: ParentId,
                as: 'parentId',
                attributes: ['parent_id']
            }]
        });
        res.status(200).json({
            success: true,
            data: members
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
});

//Get single member
router.get('/:id', async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.id, {
            include: [{
                model: ParentId,
                as: 'parentId',
                attributes: ['parent_id']
            }]
        });

        if (!member) {
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        res.status(200).json({
            success: true,
            data: member
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.member
        });
    }
});

//Create new member
router.post('/', async (req, res) => {
    const t = await sequelize.transaction();

    try {
        console.log("Request Body:", req.body);
      const member = await Member.create(req.body, { transaction: t });

      //If married create parent id
      if (member.marital_status === 'married') {
        const parentId = await ParentId.create({
            member_id: member.id,
            parent_id: `${member.gender.toUpperCase()}_${uuidv4()}`,
            gender: member.gender
        }, { transaction: t });
      }

      await t.commit();

       // Fetch the complete member data with associations
       const completeMember = await Member.findByPk(member.id, {
        include: [{
            model: ParentId,
            as: 'parentId',
            attributes: ['parent_id']
        }]
    });

      res.status(201).json({
        success: true,
        data: completeMember
      });
    } catch (error) {
        await t.rollback();
        console.error("Database Error:", error); 
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  });

//Update the member
router.put('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        //Find member with Parent ID
        const member = await Member.findByPk(id, {
            include: [{
                model: ParentId,
                as: 'parentId',
                attributes: ['parent_id']
            }]
        });

        if (!member) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        //Update member
        await member.update(req.body,{ transaction: t });

        //Handle Parent ID changes based on marital status
        if (req.body.marital_status === 'married' && !member.ParentId) {
            //Create new Parent ID if member gets married
            await ParentId.create({
                member_id: member.id,
                parent_id: `${member.gender.toUpperCase()}_${uuidv4}`,
                gender: member.gender
            }, { transaction: t});
        }
        else if (req.body.marital_status === 'single' && member.ParentId) {
            //Remove Parent ID if member becomes single
            await ParentId.destroy({
                where: { member_id: member.id },
                transaction: t
            });
        }

        await t.commit();

        //Fetch updated member with association
        const updatedMember = await Member.findByPk(id, {
            include: [{
                model: ParentId,
                as: 'parentId',
                attributes: ['parent_id']
            }]
        });

        res.status(200).json({
            success: true,
            data: updatedMember
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

//Delete member
router.delete('/:id', async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id } = req.params;

        const member = await Member.findByPk(id);

        if (!member) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Member not found'
            });
        }

        //Delete associated Parent ID
        await ParentId.destroy({
            where: { member_id: id },
            transaction: t
        });

        //Delete member
        await member.destroy({ transaction: t});

        await t.commit();

        res.status(200).json({
            success: true,
            message: 'Member and associated records deleted successfully'
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// Get potential spouses for a member
router.get('/potential-spouses/:memberId', async (req, res) => {
    try {
        const member = await Member.findByPk(req.params.memberId);
        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

// Find potential spouses of opposite gender who are marked as married
// but not yet linked to anyone
        const potentialSpouses = await Member.findAll({
            where: {
                gender: member.gender === 'male' ? 'female' : 'male',
                marital_status: 'married',
                deceased: false,
                id: {
                    [Op.notIn]: sequelize.literal(`
                        (SELECT husband_id FROM marriages WHERE status = 'confirmed'
                        UNION 
                        SELECT wife_id FROM marriages WHERE status = 'confirmed')
                        `)
                }
            },
            attributes: ['id', 'first_name', 'last_name', 'gender'],
            include: [{
                model: ParentId,
                as: 'parentId',
                attributes: ['parent_id']
            }]
        });

        res.status(200).json({ success: true, data: potentialSpouses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });        
    }
});

//Create marriage proposal
router.post('/marriage', async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { husband_id, wife_id, marriage_date } = req.body;

        //verfiy both members exist and are eligible
        const [ husband, wife] = await Promise.all([
            Member.findByPk(husband_id, { include: ['parentId'] }),
            Member.findByPk(wife_id, { include: ['parentId'] })
        ]);

        if (!husband || !wife) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'One or both members not found'
            });
        }

         // Check if both members have parent IDs
         if (!husband.parentId || !wife.parentId) {
            await t.rollback();
            return res.status(400).json({
            success: false,
            message: 'One or both members do not have parent IDs. Ensure both members are marked as married.'
        });
      }

        //verify gender
        if (husband.gender !== 'male' || wife.gender !== 'female') {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Invalid gender combination'
            });
        }

         // Check if either person is already in a confirmed marriage
    // const existingMarriage = await Marriage.findOne({
    //     where: {
    //       status: 'confirmed',
    //       [Op.or]: [
    //         { husband_id },
    //         { wife_id }
    //       ]
    //     }
    //   });
  
    //   if (existingMarriage) {
    //     await t.rollback();
    //     return res.status(400).json({ 
    //       success: false, 
    //       message: 'One or both members are already married' 
    //     });
    //   }

    //create marriage record
    const coupleId = `${husband.parentId.parent_id}_${wife.parentId.parent_id}`;
    const marriage = await Marriage.create({
        couple_id: coupleId,
        husband_id,
        wife_id,
        marriage_date,
        status: 'pending'
    }, { transaction: t });

    await t.commit();
    res.status(201).json({
        success: true,
        data: marriage
    });
    } catch (error) {
       await t.rollback();
       console.error(error);
       res.status(500).json({
        success: false,
        message: error.message
       });
    }
});

//Confirm marriage
router.put('/marriage/:id/confirm', async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const marriage = await Marriage.findByPk(req.params.id);
        if (!marriage) {
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: 'Marriage record not found'
            });
        }

        if (marriage.status === 'confirmed') {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Marriage is already confirmed'
            });
        }

        //Update marriage status
        await marriage.update({
            status: 'confirmed'
        }, { transaction: t });

        //Update both members' marital status
        await Member.update(
            { marital_status: 'married' },
            {
                where: {
                    id: { [Op.in]: [marriage.husband_id, marriage.wife_id] }
                },
                transaction: t
            }
        );

        await t.commit();
        res.status(200).json({
            success: true,
            message: 'Marriage confirmed successfully'
        });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.patch('/members/:memberId/verify', protect, memberController.updateMemberVerification);
router.get('/members', protect, memberController.getMembers);

module.exports = router;