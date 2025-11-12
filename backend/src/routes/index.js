import express from "express";
import authRoutes from "./auth.js"; // ⭐ TAMBAHKAN INI
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import {
  getAllCapstoneGroups,
  registerTeam,
  updateCapstoneGroup,
  approveCapstoneGroup,
  rejectCapstoneGroup,
  deleteCapstoneGroup,
  getCapstoneGroupById,
} from "../controllers/capstoneGroupController.js";
import {
  getAllUseCases,
  addUseCase,
  getUseCaseById,
} from "../controllers/usecaseController.js";
import { loginUser, registerUser } from "../controllers/authController.js";
import {
  getAllDocuments,
  getDocumentById,
  addDocument,
  deleteDocument,
  downloadDocument,
} from "../controllers/documentController.js";
import {
  getAllTimelines,
  getUpcomingTimeline,
  getOverdueTimeline,
  addTimeline,
  updateTimeline,
  deleteTimeline,
} from "../controllers/timelineController.js";
import {
  getAllLearningGroups,
  getLearningGroupById,
  addLearningGroup,
  updateLearningGroup,
  deleteLearningGroup,
} from "../controllers/learningGroupController.js";

const router = express.Router();

// ========== API INFO ==========
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Dicoding Capstone API",
    version: "2.0.0",
    endpoints: {
      health: "/api/health",
      docs: "/api-docs",
      auth: {
        local: "/api/auth/login (OLD), /api/auth/register (OLD)",
        google: "/api/auth/google (NEW)",
        refresh: "/api/auth/refresh (NEW)",
        me: "/api/auth/me (NEW)",
      },
    },
  });
});

// ========== HEALTH CHECK ==========
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
    googleOAuth: process.env.GOOGLE_CLIENT_ID ? "configured" : "not configured",
  });
});

// ========== AUTH ROUTES ==========
// ⭐ REGISTER AUTH ROUTES (Google OAuth + New Local Auth)
router.use("/auth", authRoutes);

// ⭐ OLD AUTH ROUTES (Backward Compatibility)
// Keep these for existing clients, but recommend migrating to /api/auth/*
// router.post("/auth/login", loginUser); // OLD: Keep for compatibility
// router.post("/auth/register", registerUser); // OLD: Keep for compatibility

// ========== USERS ==========
router.get("/users", protect, getAllUsers);
router.get("/user/profile", protect, getUserById);
router.put("/user/profile/update", protect, updateUserProfile);

// ========== CAPSTONE GROUPS ==========
router.post("/capstone-group/add", protect, registerTeam);
router.get("/capstone-groups", protect, getAllCapstoneGroups);
router.get("/capstone-group/:id", protect, getCapstoneGroupById);
router.put("/capstone-group/update/:id", protect, updateCapstoneGroup);
router.put("/capstone-group/:id/approve", protect, approveCapstoneGroup);
router.put("/capstone-group/:id/reject", protect, rejectCapstoneGroup);
router.delete("/capstone-group/:id/delete", protect, deleteCapstoneGroup);

// ========== USECASES ==========
router.get("/usecases", protect, getAllUseCases);
router.get("/usecase/:id", protect, getUseCaseById);
router.post("/usecase/add", protect, addUseCase);

// ========== DOCUMENTS ==========
router.get("/documents", protect, getAllDocuments);
router.get("/document/:id", protect, getDocumentById);
router.post("/document/add", protect, addDocument);
router.delete("/document/:id/delete", protect, deleteDocument);
router.get("/document/:id/download", protect, downloadDocument);

// ========== TIMELINES ==========
router.get("/timelines", protect, getAllTimelines);
router.get("/timelines/upcoming", protect, getUpcomingTimeline);
router.get("/timelines/overdue", protect, getOverdueTimeline);
router.post("/timeline/add", protect, addTimeline);
router.put("/timeline/update/:id", protect, updateTimeline);
router.delete("/timeline/:id/delete", protect, deleteTimeline);

// ========== LEARNING GROUPS ==========
router.get("/learning-groups", protect, getAllLearningGroups);
router.get("/learning-group/:id", protect, getLearningGroupById);
router.post("/learning-group/add", protect, addLearningGroup);
router.put("/learning-group/update/:id", protect, updateLearningGroup);
router.delete("/learning-group/:id/delete", protect, deleteLearningGroup);

export default router;
