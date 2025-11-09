import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Counter from "../models/Counter.js";

async function getNextSequence(counterName) {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

export const registerUser = async (req, res) => {
  try {
    // Mengambil data dari request
    const { name, email, password, learningPath, role, university } = req.body;
    // Pengecekan apakah user sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    // Enkripsi password
    const salt = await bcrypt.genSalt(15);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate ID berdasarkan learningpath
    const newSeqNumber = await getNextSequence("dicodingId");
    let generateDicodingId;
    switch (learningPath) {
      case "Front-End Web & Back-End with AI":
        generateDicodingId = `FEBE${newSeqNumber
          .toString()
          .padStart(5, "0")}AI`;
        break;
      case "React & Back-End with AI":
        generateDicodingId = `REBE${newSeqNumber
          .toString()
          .padStart(5, "0")}AI`;
        break;
      case "Machine Learning":
        generateDicodingId = `ML${newSeqNumber
            .toString()
            .padStart(5, "0")}`;
        break;
      default:
        return res.status(400).json({
          message: "Learning Path tidak valid.",
        });
    }

    // Membuat user baru
    const newUser = new User({
      dicodingId: generateDicodingId,
      name,
      email,
      password: hashedPassword,
      learningPath,
      role,
      university
    });

    // Menyimpan user baru ke database
    await newUser.save();

    // Mengirimkan response
    res
      .status(201)
      .json({success: true, message: "User registered successfully", data: newUser });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log("Error in registerUser", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Mengambil data dari request
    const { email, password } = req.body;

    // Pengecekan user
    const user = await User.findOne({ email }).select("+password");

    // Komparasi password
    if (user && (await bcrypt.compare(password, user.password))) {
      // Membuat token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      // Mengirimkan response
      res.status(200).json({success: true, data: {user, token} });
    } else {
      // Mengirimkan response
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log("Error in loginUser", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
