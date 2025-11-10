
import express from "express";
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
} from "../controllers/documentController.js";
import {
  getAllTimelines,
  getUpcomingTimeline,
  getOverdueTimeline,
  addTimeline,
  updateTimeline,
  deleteTimeline,
 } from "../controllers/timelineController.js";

const router = express.Router();

// Health check for API
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// Auth
router.post("/auth/login", loginUser);
router.post("/auth/register", registerUser);

// Users
router.get("/users", protect, getAllUsers);
router.get("/user/profile", protect, getUserById);
router.put("/user/profile/update", protect, updateUserProfile);

// Capstone Groups
router.post("/capstone-group/add", protect, registerTeam);
router.get("/capstone-groups", protect, getAllCapstoneGroups);
router.get("/capstone-group/:id", protect, getCapstoneGroupById);
router.put("/capstone-group/update/:id", protect, updateCapstoneGroup);
router.put("/capstone-group/:id/approve", protect, approveCapstoneGroup);
router.put("/capstone-group/:id/reject", protect, rejectCapstoneGroup);
router.delete("/capstone-group/:id/delete", protect, deleteCapstoneGroup);

// Usecases
router.get("/usecases", protect, getAllUseCases);
router.get("/usecase/:id", protect, getUseCaseById);
router.post("/usecase/add", protect, addUseCase);

// Documents
router.get("/documents", protect, getAllDocuments);
router.get("/document/:id", protect, getDocumentById);
router.post("/document/add", protect, addDocument);
router.delete("/document/:id/delete", protect, deleteDocument);

// Timelines
router.get("/timelines", protect, getAllTimelines);
router.get("/timelines/upcoming", protect, getUpcomingTimeline);
router.get("/timelines/overdue", protect, getOverdueTimeline);
router.post("/timeline/add", protect, addTimeline);
router.put("/timeline/update/:id", protect, updateTimeline);
router.delete("/timeline/:id/delete", protect, deleteTimeline);

export default router;
