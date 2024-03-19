const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/', controller.createRecord);
router.get('/:id', controller.getRecord);
router.put('/:id', controller.updateRecord);
router.delete('/:id', controller.deleteRecord);
router.get('/user/:id', controller.getUserRecord);


module.exports = router;
