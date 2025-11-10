import LearningGroup from "../models/LearningGroup.js";
import Counter from "../models/Counter.js";

async function getNextSequence(counterName) {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

// GET menampilkan semua learning groups
export const getAllLearningGroups = async (req, res) => {
  try {
    // User harus login
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Menmbangun filder berdasarkan query parameters
    const { page = 1, limit = 10 } = req.query;

    // Membangun filter
    const filter = {};

    // Menghitung total learning group
    const totalLearningGroups = await LearningGroup.countDocuments(filter);

    // Ambil data learning group
    const learningGroups = await LearningGroup.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

      // Mengirimkan response
      res.status(200).json({
        success: true,
        data: {
          learningGroups,
          pagination: {
            currentPage: parseInt(page),
            totalItems: totalLearningGroups,
            limit: parseInt(limit),
          },
        },
      });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({success: false, message: error.message });
    }
    console.log("Error in getAllLearningGroups", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// GET learning grup berdasarkan ID
export const getLearningGroupById = async (req, res) => {
  try {
    // User harus login
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Mengambil ID learning group
    const { id } = req.params;

    // Mencari learning group berdasarkan ID
    const learningGroup = await LearningGroup.findById(id);
    if (!learningGroup) {
      return res.status(404).json({ message: "Learning group not found" });
    }

    // Mengirimkan response
    res.status(200).json({
      success: true,
      data: learningGroup,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log("Error in getLearningGroupById", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// CREATE learning group baru
export const addLearningGroup = async (req, res) => {
  try {
    // Hanya admin yang boleh membuat learning group
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Mengambil data dari body request
    const { cohort, mentorName, maxMembers } = req.body;

    // Pengecekan tiap req body
    if (!cohort || !mentorName || !maxMembers) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate learningGroupId berdasarkan cohort
    const newSeqNumber = await getNextSequence("learningGroupId")
    let generateLearningGroupId;
    switch (cohort) {
      case "Front-End Web & Back-End with AI":
        generateLearningGroupId = `FB-${newSeqNumber.toString().padStart(2, '0')}`;
        break;
      case "React & Back-End with AI":
        generateLearningGroupId = `RB-${newSeqNumber.toString().padStart(2, '0')}`;
        break;
      case "Machine Learning":
        generateLearningGroupId = `ML-${newSeqNumber.toString().padStart(2, '0')}`;
        break;
      default:
        return res.status(400).json({
          message: "Cohort tidak valid.",
        });
    }

    // Membuat learning group baru
    const newLearningGroup = new LearningGroup({
      learningGroupId: generateLearningGroupId,
      cohort,
      mentorName,
      maxMembers
    });

    // Menyimpan learning group baru ke database
    await newLearningGroup.save();

    // Mengirimkan response
    res.status(201).json({
      success: true,
      message: "Learning group created successfully",
      data: newLearningGroup,
    });

    // Membuat ID
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log("Error in createLearningGroup", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// UPDATE learning group berdasarkan id
export const updateLearningGroup = async (req, res) => {
  try {
    // Hanya admin yang bisa mengupdate learning group
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Mengambil ID learning group dari parameter
    const { id } = req.params;

    // Mengambil data dari body request
    const { mentorName, maxMembers, isActive } = req.body;

    // Mencari learning group berdasarkan ID
    const learningGroup = await LearningGroup.findById(id);
    if (!learningGroup) {
      return res.status(404).json({ message: "Learning group not found" });
    }

    // Memperbarui data learning group
    if (mentorName) learningGroup.mentorName = mentorName;
    if (maxMembers) learningGroup.maxMembers = maxMembers;
    if (isActive !== undefined) learningGroup.isActive = isActive;

    // Menyimpan perubahan
    await learningGroup.save();

    // Mengirimkan response
    res.status(200).json({
      success: true,
      message: "Learning group updated successfully",
      data: learningGroup
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log("Error in updateLearningGroup", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// DELETE learning group berdasarkan id
export const deleteLearningGroup = async (req, res) => {
  try {
    // Hanya admin yang bisa menghapus learning group
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Mengambil ID learning group dari parameter
    const { id } = req.params;

    // Mencari learning group berdasarkan ID
    const learningGroup = await LearningGroup.findById(id);
    if (!learningGroup) {
      return res.status(404).json({ message: "Learning group not found" });
    }

    // Menghapus learning group
    await LearningGroup.findByIdAndDelete(id);

    // Mengirimkan response
    res.status(200).json({
      success: true,
      message: "Learning group deleted successfully"
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log("Error in deleteLearningGroup", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
