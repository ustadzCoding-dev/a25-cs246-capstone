import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import Counter from '../models/Counter.js';
import { uploadProfilePicture, deleteProfilePicture } from '../services/CloudinaryService.js';

// Helper function to get next sequence number
async function getNextSequence(counterName) {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

export const getAllUsers = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    // Ambil query parameter
    const { role, learningPath, search, page = 1, limit = 10 } = req.query;

    // Membangun filter berdasarkan query parameter
    const filter = {};
    if (role) {
      filter.role = role;
    }
    if (learningPath) {
      filter.learningPath = learningPath;
    }

    // Add search filter (search by name, email, or dicodingId)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { dicodingId: { $regex: search, $options: 'i' } }
      ];
    }

    // Hitung total user yang sesuai filter
    const totalUsers = await User.countDocuments(filter);

    // Ambil data user dengan pagination
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password'); // sembunyikan password

    console.log('[getAllUsers] Users returned:', users.length, 'Total:', totalUsers, 'Page:', page, 'Limit:', limit, 'First user:', users[0] ? { _id: users[0]._id, name: users[0].name, email: users[0].email } : null);

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalItems: totalUsers,
          limit: parseInt(limit),
          totalPages: Math.ceil(totalUsers / parseInt(limit))
        }
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    // req.user sudah diisi oleh middleware protect
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log('Error in getUserProfile', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    // req.user sudah diisi oleh middleware protect
    const user = req.user;

    // Mengambil data dari request
    const { name, email, password, university, learningPath, learningPathId } = req.body;

    // Memperbarui data user
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (university) {
      user.university = university;
    }

    // Jika client mengirimkan learning path sebagai nama/string, simpan ke learningPathName
    if (learningPath) {
      user.learningPathName = learningPath;
    }

    // Jika client mengirimkan learningPathId (ObjectId), simpan referensi juga
    if (learningPathId) {
      user.learningPathId = learningPathId;
    }
    if (password) {
      const salt = await bcrypt.genSalt(15);
      user.password = await bcrypt.hash(password, salt);
    }

    // Simpan perubahan ke database
    const updateUser = await user.save();

    // Mengirimkan response
    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: updateUser
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log('Error in updateUserProfile', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { currentPassword, newPassword } = req.body;

    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Fetch user dengan password field included
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Jika user login via OAuth (Google), mereka tidak punya password
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change password for OAuth users. Please use your OAuth provider.'
      });
    }

    // Cek apakah password lama cocok
    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Validasi password baru minimal 6 karakter
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters'
      });
    }

    // Cek jangan sampai password baru sama dengan password lama
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from current password'
      });
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(15);
    user.password = await bcrypt.hash(newPassword, salt);

    // Simpan perubahan
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log('Error in changePassword:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const uploadProfilePictureController = async (req, res) => {
  try {
    // req.user sudah diisi oleh middleware protect
    const userId = req.user.id || req.user._id;

    // Cek apakah file ada
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file provided'
      });
    }

    // Upload file ke Cloudinary
    const profilePictureUrl = await uploadProfilePicture(
      req.file.buffer,
      req.file.originalname,
      userId
    );

    // Update user dengan URL profile picture
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: profilePictureUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: profilePictureUrl,
        user
      }
    });
  } catch (error) {
    console.error('Error in uploadProfilePictureController:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};

export const changeUserRole = async (req, res) => {
  try {
    // Check: hanya admin yang bisa ubah role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Admins only'
      });
    }

    const { id } = req.params;
    const { role } = req.body;

    // Validate ID
    if (!id || id === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Validate role
    if (!['student', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "student" or "admin"'
      });
    }

    // Get user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldRole = user.role;

    // Update role
    user.role = role;

    // CLEAR/SET fields based on new role
    if (role === 'admin') {
      // CLEAR student-specific fields
      user.memberStatus = null;
      user.capstoneGroupId = null;
      user.learningPathId = null;
      user.learningPathName = null;
      user.university = null;

      // Generate new dicodingId with ADMIN format (if changing from student to admin)
      if (oldRole === 'student') {
        try {
          const newSeqNumber = await getNextSequence('dicodingId');
          user.dicodingId = `ADMIN-${newSeqNumber.toString().padStart(3, '0')}`;
          console.log(`[CHANGE_ROLE] Generated new dicodingId for admin: ${user.dicodingId}`);
        } catch (err) {
          console.warn(`[CHANGE_ROLE] Could not generate new dicodingId: ${err.message}`);
          // Keep existing dicodingId if sequence generation fails
        }
      }
      console.log(`[CHANGE_ROLE] User ${id} changed from ${oldRole} to admin. Fields cleared.`);
    } else if (role === 'student') {
      // SET student-specific fields
      user.memberStatus = 'active';
      user.learningPathId = null;
      user.learningPathName = null;
      user.university = null;

      // Generate new dicodingId with student format (if changing from admin to student)
      if (oldRole === 'admin') {
        try {
          const newSeqNumber = await getNextSequence('dicodingId');
          user.dicodingId = `FEBE${newSeqNumber.toString().padStart(6, '0')}AI`;
          console.log(`[CHANGE_ROLE] Generated new dicodingId for student: ${user.dicodingId}`);
        } catch (err) {
          console.warn(`[CHANGE_ROLE] Could not generate new dicodingId: ${err.message}`);
          // Keep existing dicodingId if sequence generation fails
        }
      }
      console.log(`[CHANGE_ROLE] User ${id} changed from ${oldRole} to student. Fields set.`);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Role berhasil diubah dari ${oldRole} ke ${role}`,
      data: user
    });
  } catch (error) {
    console.error('Error changing user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change role'
    });
  }
};

export const deleteProfilePictureController = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Hapus foto dari Cloudinary
    await deleteProfilePicture(userId);

    // Update user, set profilePicture ke null
    const user = await User.findByIdAndUpdate(userId, { profilePicture: null }, { new: true });

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully',
      data: user
    });
  } catch (error) {
    console.error('Error in deleteProfilePictureController:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
  }
};
