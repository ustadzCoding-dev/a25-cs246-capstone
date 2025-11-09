import UseCase from "../models/UseCase.js";
import Counter from "../models/Counter.js";

async function getNextSequence(counterName) {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

export const addUseCase = async (req, res) => {
    try {
      // Hanya admin yang bisa menambahkan usecase
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
      }
        // Mengambil data dari request
        const {title, description, partner, totalSlots, difficulty} = req.body;

        // Validase input
        if (!title || !description || !partner || !totalSlots || !difficulty) {
            return res.status(400).json({message: "All fields are required"});
        }

        // Cek apakah usecase dengan judul yang sama sudah ada
        const existingUsecase = await UseCase.findOne({title});
        if(existingUsecase){
            return res.status(400).json({message: "Usecase already registered"});
        }

        if (totalSlots <= 0) {
            return res.status(400).json({message: "Total slots must be greater than zero"});
        }

        // Generate usecaseID
        const newSeqNumber = await getNextSequence("usecaseId");
        const generateUsecaseId = `UC-${newSeqNumber.toString().padStart(3, "0")}`;

        // Menyimpan data ke database
        const newUsecase = new UseCase({
            usecaseId: generateUsecaseId,
            title,
            description,
            partner,
            totalSlots,
            capstoneGroup: [],
            availableSlots: totalSlots,
            difficulty,
            status: "open"
        });
        await newUsecase.save();

        // Mengirimkan response
        res.status(201).json({success: true, message: "Usecase added successfully", data: newUsecase});
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ success: false, message: error.message });
        }
        console.log('Error in addUsecase', error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const getAllUseCases = async (req, res) => {
    try {
      // Pastikan user sudah login
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Mengambil data dari parameter query jika ada
      const {isActive, partner, page = 1, limit = 10} = req.query;

      // Membangun filter berdasarkan parameter query
      const filter = {};
      if (isActive !== undefined) {
        filter.availableSlots = isActive === "true" ? { $gt: 0 } : 0;
      }
      if (partner) {
        filter.partner = partner;
      }

      // Mengambil data usecase dari database dengan filter
      const useCases = await UseCase.find(filter);

      // Menghitung total usecase untuk pagination
      const totalUseCases = useCases.length;

      // Mengirimkan response
      res.status(200).json({
        success: true,
        data: {
          useCases,
          pagination: {
            currentPage: parseInt(page),
            totalItems: totalUseCases,
            limit: parseInt(limit),
          }
        }
      });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        console.log('Error in getAllUseCase', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getUseCaseById = async (req, res) => {
  try {
    // Pastikan user sudah login
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Mengambil usecaseId dari parameter URL
    const { id } = req.params;

    // Mencari usecase berdasarkan id
    const useCase = await UseCase.findById(id);
    console.log(useCase);
    if (!useCase) {
      return res.status(404).json({ message: "Usecase not found" });
    }

    // Mengirimkan response
    res.status(200).json({ success: true, data: useCase });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log('Error in getUseCaseById', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
