// const { Member, User } = require('../models');
// const multer = require('multer');
// const path = require('path');

// // File upload configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'public/images/member-images/');
//     },
//     filename: (req, file, cb) => {
//       // Use member ID and original file extension
//       const ext = path.extname(file.originalname);
//       cb(null, `member-${Date.now()}${ext}`);
//     }
// });

// const upload = multer({
//     storage: storage,
//     limits: {
//       fileSize: 5 * 1024 * 1024 // 5MB limit
//     },
//     fileFilter: (req, file, cb) => {
//       if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//       } else {
//         cb(new Error('Not an image! Please upload an image.'), false);
//       }
//     }
// });

// // Get all members
// const getMembers = async (req, res) => {
//     try {
//         const members = await Member.findAll({
//             include: [{
//                 model: User,
//                 as: 'verifier',
//                 attributes: ['username'],
//             }],
//         });

//         return res.json({ data: members });
//     } catch (error) {
//         console.error('Error in getMembers', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // Create a new member
// const createMember = async (req, res) => {
//     try {
//       const memberData = req.body;
//       if (req.file) {
//         memberData.profile_image = req.file.filename;
//       }
//       const member = await Member.create(memberData);
//       res.json({ success: true, data: member });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
// };
  
// // Update a member
// const updateMember = async (req, res) => {
//     try {
//       const memberData = req.body;
//       if (req.file) {
//         memberData.profile_image = req.file.filename;
//       }
//       const member = await Member.findByPk(req.params.id);
      
//       if (!member) {
//         return res.status(404).json({ success: false, message: 'Member not found' });
//       }
      
//       await member.update(memberData);
//       res.json({ success: true, data: member });
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
// };

// // Update member verification status
// const updateMemberVerification = async (req, res) => {
//     try {
//         const { memberId } = req.params;
//         const userId = req.user.id;

//         const user = await User.findByPk(userId);
//         if (!user || user.role !== 'admin') {
//             return res.status(403).json({ message: 'Unauthorized' });
//         }

//         const member = await Member.findByPk(memberId);
//         if (!member) {
//             return res.status(404).json({ message: 'Member not found' });
//         }

//         await member.update({
//             is_verified: true,
//             verified_by: userId,
//             verified_at: new Date()
//         });

//         return res.json({
//             message: 'Member verified successfully',
//             member: {
//                 ...member.toJSON(),
//                 verifier: {
//                     username: user.username
//                 }
//             }
//         });
//     } catch (error) {
//         console.error('Error in updateMemberVerification:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };

// module.exports = {
//     getMembers,
//     createMember,
//     updateMember,
//     updateMemberVerification,
//     upload
// };