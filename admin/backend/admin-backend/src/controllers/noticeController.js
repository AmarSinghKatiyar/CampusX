import Notice from '../models/Notice.js';
import Activity from '../models/Activity.js';

// GET /api/notices
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/notices
export const createNotice = async (req, res) => {
  try {
    const notice = await Notice.create(req.body);
    await Activity.create({
      type: 'drive',
      text: `Notice posted: ${notice.title}`,
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/notices/:id
export const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
