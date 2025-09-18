const express = require('express');
const { upload } = require('../middleware/upload');
const ctrl = require('../controllers/issueController');

const router = express.Router();

router.get('/stats', ctrl.getStats);
router.get('/', ctrl.listIssues);
router.get('/:id', ctrl.getIssue);

const uploadFields = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'audioNote', maxCount: 1 },
]);

router.post('/', uploadFields, ctrl.createIssue);
router.put('/:id', uploadFields, ctrl.updateIssue);
router.delete('/:id', ctrl.deleteIssue);

module.exports = router;
