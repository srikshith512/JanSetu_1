const path = require('path');
const Issue = require('../models/Issue');
const { Op, fn, col, literal } = require('sequelize');

function safeParseJSON(value, fieldName) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value === 'object') return value; // already parsed
  try {
    return JSON.parse(value);
  } catch (e) {
    const err = new Error(`Invalid JSON for field '${fieldName}'`);
    err.status = 400;
    throw err;
  }
}

function fileToMeta(file, req) {
  if (!file) return null;
  const urlPath = `/uploads/${file.filename}`;
  return {
    filename: file.filename,
    url: urlPath,
    mimetype: file.mimetype,
    size: file.size,
  };
}

// POST /api/issues
async function createIssue(req, res, next) {
  try {
    const { category, description, priority, location, reportedBy, contactInfo } = req.body;

    // Basic validations
    if (!category || !String(category).trim()) {
      return res.status(400).json({ message: 'category is required' });
    }
    if (!description || !String(description).trim()) {
      return res.status(400).json({ message: 'description is required' });
    }
    if (priority && !['low', 'medium', 'high'].includes(String(priority))) {
      return res.status(400).json({ message: "priority must be one of 'low' | 'medium' | 'high'" });
    }

    const images = (req.files?.images || []).map((f) => fileToMeta(f, req));
    const audioFile = (req.files?.audioNote || [])[0];

    const issue = await Issue.create({
      category: String(category).trim(),
      description: String(description).trim(),
      priority,
      location: safeParseJSON(location, 'location'),
      images,
      audioNote: audioFile ? fileToMeta(audioFile, req).url : null,
      reportedBy,
      contactInfo: safeParseJSON(contactInfo, 'contactInfo'),
    });

    res.status(201).json(issue);
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeDatabaseError') {
      err.status = err.status || 400;
    }
    next(err);
  }
}

// GET /api/issues
async function listIssues(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      q,
      sort = 'createdAt',
      order = 'DESC',
    } = req.query;

    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (q) {
      where[Op.or] = [
        { description: { [Op.iLike]: `%${q}%` } },
        { category: { [Op.iLike]: `%${q}%` } },
        { trackingId: { [Op.iLike]: `%${q}%` } },
      ];
    }

    const options = {
      where,
      offset: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      order: [[sort, order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC']],
    };

    const { rows, count } = await Issue.findAndCountAll(options);

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/issues/:id
async function getIssue(req, res, next) {
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (err) {
    next(err);
  }
}

// PUT /api/issues/:id
async function updateIssue(req, res, next) {
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const { status, priority, assignedTo, category, description, location, contactInfo, reportedBy } = req.body;

    if (typeof status !== 'undefined') issue.status = status;
    if (typeof priority !== 'undefined') {
      if (!['low', 'medium', 'high'].includes(String(priority))) {
        return res.status(400).json({ message: "priority must be one of 'low' | 'medium' | 'high'" });
      }
      issue.priority = priority;
    }
    if (typeof assignedTo !== 'undefined') issue.assignedTo = assignedTo;
    if (typeof category !== 'undefined') issue.category = category;
    if (typeof description !== 'undefined') issue.description = description;
    if (typeof reportedBy !== 'undefined') issue.reportedBy = reportedBy;
    if (typeof location !== 'undefined') issue.location = safeParseJSON(location, 'location');
    if (typeof contactInfo !== 'undefined') issue.contactInfo = safeParseJSON(contactInfo, 'contactInfo');

    // Handle additional uploads on update (append images)
    const newImages = (req.files?.images || []).map((f) => fileToMeta(f, req)).filter(Boolean);
    if (newImages.length) {
      issue.images = [...(issue.images || []), ...newImages];
    }
    const audioFile = (req.files?.audioNote || [])[0];
    if (audioFile) issue.audioNote = fileToMeta(audioFile, req).url;

    await issue.save();
    res.json(issue);
  } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeDatabaseError') {
      err.status = err.status || 400;
    }
    next(err);
  }
}

// DELETE /api/issues/:id
async function deleteIssue(req, res, next) {
  try {
    const issue = await Issue.findByPk(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    await issue.destroy();
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// GET /api/issues/stats
async function getStats(req, res, next) {
  try {
    const rawByStatus = await Issue.findAll({
      attributes: ['status', [fn('COUNT', col('status')), 'count']],
      group: ['status'],
      raw: true,
    });

    const rawByCategory = await Issue.findAll({
      attributes: ['category', [fn('COUNT', col('category')), 'count']],
      group: ['category'],
      raw: true,
    });

    const byStatus = rawByStatus.map((r) => ({ status: r.status, count: Number(r.count) }));
    const byCategory = rawByCategory.map((r) => ({ category: r.category, count: Number(r.count) }));

    res.json({ byStatus, byCategory });
  } catch (err) {
    next(err);
  }
}

module.exports = { createIssue, listIssues, getIssue, updateIssue, deleteIssue, getStats };
