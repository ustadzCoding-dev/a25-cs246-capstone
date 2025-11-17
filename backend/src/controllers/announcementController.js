import Announcement from '../models/Announcement.js'

// GET /api/announcements
export const getAnnouncements = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { priority, search, page = 1, limit = 10 } = req.query

    const filter = {}
    if (priority) {
      filter.priority = priority
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    const totalAnnouncements = await Announcement.countDocuments(filter)

    const announcements = await Announcement.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    res.status(200).json({
      success: true,
      data: announcements,
      pagination: {
        currentPage: parseInt(page),
        totalItems: totalAnnouncements,
        limit: parseInt(limit)
      }
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message })
    }
    console.log('Error in getAnnouncements', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

// GET /api/announcements/:id
export const getAnnouncementById = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.params
    const announcement = await Announcement.findById(id)

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    res.status(200).json({
      success: true,
      data: announcement
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message })
    }
    console.log('Error in getAnnouncementById', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

// POST /api/announcements
export const createAnnouncement = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const { title, content, priority } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' })
    }

    const announcement = new Announcement({
      title: title.trim(),
      content,
      priority: priority || 'normal',
      createdBy: req.user._id
    })

    const savedAnnouncement = await announcement.save()

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: savedAnnouncement
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message })
    }
    console.log('Error in createAnnouncement', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

// PUT /api/announcements/:id
export const updateAnnouncement = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const { id } = req.params
    const { title, content, priority } = req.body

    const announcement = await Announcement.findById(id)
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    if (title) announcement.title = title.trim()
    if (content) announcement.content = content
    if (priority) announcement.priority = priority

    const updatedAnnouncement = await announcement.save()

    res.status(200).json({
      success: true,
      message: 'Announcement updated successfully',
      data: updatedAnnouncement
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message })
    }
    console.log('Error in updateAnnouncement', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

// DELETE /api/announcements/:id
export const deleteAnnouncement = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' })
    }

    const { id } = req.params

    const announcement = await Announcement.findByIdAndDelete(id)
    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message })
    }
    console.log('Error in deleteAnnouncement', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}

// POST /api/announcements/:id/read
export const markAnnouncementAsRead = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.params
    const announcement = await Announcement.findById(id)

    if (!announcement) {
      return res.status(404).json({ message: 'Announcement not found' })
    }

    // For now we just return the announcement.
    // Frontend will manage `isRead` state client-side.
    res.status(200).json({
      success: true,
      data: announcement
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message })
    }
    console.log('Error in markAnnouncementAsRead', error)
    res.status(500).json({ success: false, message: 'Internal Server Error' })
  }
}
