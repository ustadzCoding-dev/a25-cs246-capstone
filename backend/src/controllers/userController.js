import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req, res) => {
  try {
    // Admin only
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    // Ambil query parameter
    const { role, learningPath, page = 1, limit = 10 } = req.query;

    // Membangun filter berdasarkan query parameter
    const filter = {};
    if (role) {
      filter.role = role;
    }
    if (learningPath) {
      filter.learningPath = learningPath;
    }

    // Hitung total user yang sesuai filter
    const totalUsers = await User.countDocuments(filter);

    // Ambil data user dengan pagination
    const users = await User.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select('-password'); // sembunyikan password

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalItems: totalUsers,
          limit: parseInt(limit)
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
