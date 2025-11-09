import Document from '../models/Document.js'

export const getAllDocuments = async (req, res) => {
    try {
      // Pastikan user sudah login
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Mengambil data dari parameter query
      const { category, visibility, page = 1, limit = 10 } = req.query;

      // Membangun filter berdasarkan query
      const filter = {};
      if (category) {
        filter.category = category;
      }
      if (visibility) {
        filter.visibility = visibility;
      }

      // Menghitung total dokumen yang sesuai
      const totalDocuments = await Document.countDocuments(filter);

      // Ambil dokumen dengan pagination
      const documents = await Document.find(filter)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      // Mengirimkan data dokumen beserta info pagination
      res.status(200).json({
        success: true,
        data: {
          documents,
          pagination: {
            currentPage: parseInt(page),
            totalItems: totalDocuments,
            limit: parseInt(limit),
          }
        }
      });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({message: error.message});
        }
        console.log('Error in getAllDocuments', error);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const getDocumentById = async (req, res) => {
  try {
    // Pastikan user sudah login
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Mengambil ID dokumen dari parameter URL
    const { id } = req.params;

    // Mencari dokumen berdasarkan ID
    const document = await Document.findById(id);

    // Jika dokumen tidak ditemukan
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Mengirimkan data dokumen
    res.status(200).json({
      success: true,
      data: document
    });
  } catch (error) {
      if (error.name === "ValidationError") {
          return res.status(400).json({message: error.message});
      }
      console.log('Error in getDocumentById', error);
      res.status(500).json({message: "Internal Server Error"});
  }
}

export const addDocument = async (req, res) => {
  try {
    // Hanya admin yang bisa menambahkan dokumen
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Ambil data dari body req
    const { title, description, fileName, fileUrl, category, visibility } = req.body;

    // Validasi data yang diterima
    if (!title || !description || !fileName || !fileUrl || !category || !visibility) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Pengecekan apakah dokumen dengan title yang sama sudah ada
    const existingDocument = await Document.findOne({ title });
    if (existingDocument) {
      return res.status(400).json({ message: "Document with the same title already exists" });
    }

    // Pengecekan apakah dokumen dengan nama file yang sama sudah ada
    const existingFile = await Document.findOne({ fileName });
    if (existingFile) {
      return res.status(400).json({ message: "Document with the same file name already exists" });
    }

    // Membuat dokumen baru
    const newDocument = new Document({
      title,
      description,
      fileName,
      fileUrl,
      category,
      visibility,
      uploadedBy: req.user._id,
      isActive: true
    });

    // Menyimpan dokumen ke database
    await newDocument.save();

    res.status(201).json({
      success: true,
      message: "Document added successfully",
      data: newDocument
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log('Error in addDocument', error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
