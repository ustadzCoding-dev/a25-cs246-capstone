import User from "../models/User.js";
import UseCase from "../models/UseCase.js";
import Counter from "../models/Counter.js";
import CapstoneGroup from "../models/CapstoneGroup.js";

async function getNextSequence(counterName) {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

export const registerTeam = async (req, res) => {
  try {
    // Mengambil data dari request
    const { useCaseId, teamName, membersUserId } = req.body;

    // Validasi nama team
    const existingTeam = await CapstoneGroup.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ message: "Team name already registered" });
    }

    // Validasi data anggota tidak boleh kososng
    if (
      !membersUserId ||
      !Array.isArray(membersUserId) ||
      membersUserId.length === 0
    ) {
      return res.status(400).json({ message: "Members are required" });
    }

    // Validasi data anggota
    const membersFromDB = await User.find({
      dicodingId: { $in: membersUserId },
    });
    if (membersFromDB.length !== membersUserId.length) {
      const foundIds = membersFromDB.map((u) => u.dicodingId);
      const notFound = membersUserId.filter((id) => !foundIds.includes(id));
      return res
        .status(400)
        .json({ message: `Members not found: ${notFound.join(", ")}` });
    }

    // Pengecekan data anggota apakah telah memiliki tim
    const membersWithTeam = membersFromDB.find(
      (member) => member.capstoneGroupId !== null
    );
    if (membersWithTeam) {
      return res
        .status(400)
        .json({
          message: `Members ${membersWithTeam.name} already has a team`,
        });
    }

    // Konversi membersId ke object ID
    const members = membersFromDB.map((member) => member._id);

    // Pengecekan usecase apakah valid
    const usecaseFromDB = await UseCase.find({ usecaseId: { $in: useCaseId } });
    if (!usecaseFromDB || usecaseFromDB.length === 0) {
      return res.status(400).json({ message: "Invalid usecase" });
    }

    // Mengambil ID usecase
    const selectedUsecase = await UseCase.findById(usecaseFromDB[0]._id);

    // Pengecekan usecase apakah telah closed
    if (selectedUsecase.status === "closed") {
      return res.status(400).json({ message: "Usecase is closed" });
    }

    // Generate capstoneGroup
    const newSeqNumber = await getNextSequence("teamSequence");
    const generateCapstoneGroupId = `TI-${newSeqNumber
      .toString()
      .padStart(3, "0")}`;

    // Menyimpan data ke database
    const teamData = new CapstoneGroup({
      capstoneGroupId: generateCapstoneGroupId,
      useCaseId: selectedUsecase,
      teamName,
      membersUserId: members,
    });
    const savedTeam = await teamData.save();

    // Update slot usecase
    selectedUsecase.capstoneGroup.push(savedTeam._id);
    selectedUsecase.availableSlots = selectedUsecase.totalSlots - selectedUsecase.capstoneGroup.length;

    // Pengecekan jika slot penuh, maka update status menjadi closed
    if (selectedUsecase.availableSlots <= 0) {
      selectedUsecase.status = "closed";
    }
    await selectedUsecase.save();

    // Update capstone group pada members
    await User.updateMany(
      { _id: { $in: members } },
      { $set: { capstoneGroupId: savedTeam._id } }
    );

    res.status(201).json({ success: true, data: savedTeam });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log("Error in registerTeam", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllCapstoneGroups = async (req, res) => {
  try {
    // Ambil query pagination
    const { page = 1, limit = 10 } = req.query;

    // Konversi ke integer
    const currentPage = parseInt(page);

    // Hitung total data
    const totalData = await CapstoneGroup.countDocuments();

    // Mengambil data dari database
    const capstoneGroups = await CapstoneGroup.find({})
    .skip((currentPage - 1) * limit)
    .limit(parseInt(limit));

    // Pengecekan apakah capstone group ada
    if (!capstoneGroups || capstoneGroups.length === 0) {
      return res.status(404).json({ message: "No capstone groups found" });
    }

    // Mengirimkan data capstone group
    res.status(200).json({
      success: true,
      data: {
        capstoneGroups,
        pagination: {
          currentPage,
          totalItems: totalData,
          limit: parseInt(limit),
        }
      }
     });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCapstoneGroup = async (req, res) => {
  try {
    // Mengambil id dari parameter
    const { id } = req.params;
    const { teamName, updateUserId } = req.body;

    // Mencari capstone group berdasarkan id
    const capstoneGroup = await CapstoneGroup.findById(id);
    if (!capstoneGroup) {
      return res.status(404).json({ message: "Capstone group not found" });
    }

    // Pengecekan status
    if (capstoneGroup.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Capstone group are accepted, cannot be updated" });
    }

    // Update field
    if (teamName) capstoneGroup.teamName = teamName;
    if (updateUserId) {
      // Kosongkan array membersUserId
      const prevousMembers = capstoneGroup.membersUserId;

      // Update capstone group di user menjadi null
      await User.updateMany(
        { _id: { $in: prevousMembers } },
        { $set: { capstoneGroupId: null } }
      );

      // Update isi membersUserId dengan array baru
      // Validasi anggota
      const newMembersFromDB = await User.find({
        dicodingId: { $in: updateUserId },
      });
      if (newMembersFromDB.length !== updateUserId.length) {
        const foundIds = newMembersFromDB.map((u) => u.dicodingId);
        const notFound = updateUserId.filter((id) => !foundIds.includes(id));
        return res
          .status(400)
          .json({ message: `Members not found: ${notFound.join(", ")}` });
      }

      // Konversi ke object ID
      const newMembers = newMembersFromDB.map((member) => member._id);
      capstoneGroup.membersUserId = newMembers;

      // Simpan perubahan sementara untuk mendapatkan ID capstoneGroup
      await capstoneGroup.save();

      // Update capstone group pada members yang baru
      await User.updateMany(
        { _id: { $in: newMembers } },
        { $set: { capstoneGroupId: capstoneGroup._id } }
      );
    }

    // Simpan perubahan
    const updatedCapstoneGroup = await capstoneGroup.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Capstone group updated successfully",
        data: updatedCapstoneGroup,
      });
  } catch (error) {
    console.log("Error in updateCapstoneGroupStatus", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const approveCapstoneGroup = async (req, res) => {
  try {
    // Hanya admin yang bisa mengapprove
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Mengambil ID dari parameter
    const {id} = req.params;

    // Cari group berdasarkan ID
    const capstoneGroup = await CapstoneGroup.findById(id);
    if (!capstoneGroup) {
      return res.status(404).json({ message: "Capstone group not found" });
    }

    // cek status
    if (capstoneGroup.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Capstone group already processed" });
    }

    // Update status menjadi approved
    capstoneGroup.status = "approved";
    capstoneGroup.validatedBy = req.user._id;
    capstoneGroup.validatedAt = new Date();

    // Simpan perubahan
    await capstoneGroup.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Capstone group approved successfully",
        data: {
          status: capstoneGroup.status,
          validatedBy: capstoneGroup.validatedBy,
          validatedAt: capstoneGroup.validatedAt,
        },
      });
  } catch (error) {
    console.log("Error in approveCapstoneGroup", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const rejectCapstoneGroup = async (req, res) => {
  try {
    // Hanya admin yang bisa menolak
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Mengambil ID dari parameter
    const {id} = req.params;
    const {reason} = req.body;

    // Cari group berdasarkan ID
    const capstoneGroup = await CapstoneGroup.findById(id);
    if (!capstoneGroup) {
      return res.status(404).json({ message: "Capstone group not found" });
    }

    // cek status
    if (capstoneGroup.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Capstone group already processed" });
    }

    // Update status menjadi rejected
    capstoneGroup.status = "rejected";
    capstoneGroup.rejectionReason = reason
    capstoneGroup.validatedBy = req.user._id;
    capstoneGroup.validatedAt = new Date();

    // Simpan perubahan
    await capstoneGroup.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Capstone group rejected successfully",
        data: {
          status: capstoneGroup.status,
          validatedBy: capstoneGroup.validatedBy,
          validatedAt: capstoneGroup.validatedAt,
          rejectionReason: capstoneGroup.rejectionReason,
        },
      });
  } catch (error) {
    console.log("Error in rejectCapstoneGroup", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const deleteCapstoneGroup = async (req, res) => {
  try {
    // Hanya admin yang bisa menghapus
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Mengambil ID dari parameter
    const {id} = req.params;

    // Cari dan hapus capstone group
    const deletedGroup = await CapstoneGroup.findByIdAndDelete(id);
    if (!deletedGroup) {
      return res.status(404).json({ message: "Capstone group not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Capstone group deleted successfully" });
  } catch (error) {
    console.log("Error in deleteCapstoneGroup", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

export const getCapstoneGroupById = async (req, res) => {
  try {
    // Pastikan user login
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Mengambil ID user dari parameter
    const {id} = req.params;

    // Cari capstone group berdasarkan ID user
    const capstoneGroup = await CapstoneGroup.findById(id);
    if (!capstoneGroup) {
      return res.status(404).json({ message: "Capstone group not found for this user" });
    }

    res.status(200).json({ success: true, data: capstoneGroup });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log("Error in getCapstoneGroupsById", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
