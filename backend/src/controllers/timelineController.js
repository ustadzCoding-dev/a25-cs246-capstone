import Timeline from "../models/Timeline.js";
import dayjs from "dayjs";

export const getAllTimelines = async (req, res) => {
  try {
    // Pastikan user sudah login
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Mengambil data dari parameter query
    const { status, type, page = 1, limit = 10 } = req.query;

    // Membangun filter berdasarkan query
    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (type) {
      filter.type = type;
    }

    // Menghitung total timeline yang sesuai
    const totalTimelines = await Timeline.countDocuments(filter);

    // Ambil timeline dengan pagination
    const timelines = await Timeline.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ startDate: 1 });

    // Mengirimkan data timeline beserta info pagination
    res.status(200).json({
      success: true,
      data: {
        timelines,
        pagination: {
          currentPage: parseInt(page),
          totalItems: totalTimelines,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log("Error in getAllTimeline", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// GET timelime upcoming
export const getUpcomingTimeline = async (req, res) => {
  try {
    // Pastikan user sudah login
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Ambil timeline dengan status upcoming
    const timelines = await Timeline.find({ status: 'upcoming' }).sort({ startDate: 1 });

    // Mengirimkan data timeline upcoming
    res.status(200).json({
      success: true,
      data: timelines
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log("Error in getUpcomingTimeline", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const getOverdueTimeline = async (req, res) => {
  try {
    // Pastikan user sudah login
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // Ambil timeline dengan status overdue
    const timelines = await Timeline.find({ isOverdue: true }).sort({ startDate: 1 });

    // Mengirimkan data timeline overdue
    res.status(200).json({
      success: true,
      data: timelines
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log("Error in getOverdueTimeline", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const addTimeline = async (req, res) => {
  try {
    // Hanya admin yang bisa menambah timeline
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    // Mengambil data dari body request
    const { title, description, type, startDate, endDate, priority } = req.body;

    // Pengecekan judul duplikat
    const existingTimeline = await Timeline.findOne({ title: title.trim() });
    if (existingTimeline) {
      return res.status(400).json({ message: "Timeline with this title already exists" });
    }

    // Validasi input
    if (!title || !description || !type || !startDate || !endDate || !priority) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Membuat hari
    const today = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Validasi tanggal
    if (!start.isValid() || !end.isValid()) {
      return res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }

    // Validasi logika tanggal
    if (start.isBefore(start)) {
      return res.status(400).json({ message: "Start date cannot be after end date" });
    }

    // Menbuat daysRemaining dan isOverdue
    const daysRemaining = end.diff(today, 'day');
    const isOverdue = end.isBefore(today, 'day');

    // Menyimpan data ke database
    const newTimeline = new Timeline({
      title,
      description,
      type,
      startDate: start.toDate(),
      endDate: end.toDate(),
      status: isOverdue ? 'overdue' : (start.isAfter(today, 'day') ? 'upcoming' : 'ongoing'),
      priority,
      daysRemaining,
      isOverdue,
      createdBy: req.user._id
    });
    await newTimeline.save();

    // Mengirimkan response
    res.status(201).json({
      success: true,
      message: "Timeline added successfully",
      data: newTimeline
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log("Error in addTimeline", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const updateTimeline = async (req, res) => {
  try {
    // Hanya admin yang bisa mengupdate timeline
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Mengambil ID timeline dari parameter
    const { id } = req.params;

    // Mengambil data dari body request
    const { title, description, type, startDate, endDate, priority, status } = req.body;

    // Mencari timeline berdasarkan ID
    const timeline = await Timeline.findById(id);
    if (!timeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }

    // Memperbarui data timeline
    if (title) timeline.title = title;
    if (description) timeline.description = description;
    if (type) timeline.type = type;
    if (startDate) timeline.startDate = dayjs(startDate).toDate();
    if (endDate) timeline.endDate = dayjs(endDate).toDate();
    if (priority) timeline.priority = priority;
    if (status) timeline.status = status;

    // Menyimpan perubahan
    await timeline.save();

    // Mengirimkan response
    res.status(200).json({
      success: true,
      message: "Timeline updated successfully",
      data: timeline
    });
  } catch (error) {

  }
}

export const deleteTimeline = async (req, res) => {
  try {
    // Hanya admin yang bisa menghapus timeline
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Mengambil ID timeline dari parameter
    const { id } = req.params;

    // Mencari dan menghapus timeline berdasarkan ID
    const timeline = await Timeline.findByIdAndDelete(id);
    if (!timeline) {
      return res.status(404).json({ message: "Timeline not found" });
    }

    // Mengirimkan response
    res.status(200).json({
      success: true,
      message: "Timeline deleted successfully"
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log("Error in deleteTimeline", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
