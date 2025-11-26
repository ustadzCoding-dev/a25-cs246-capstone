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
