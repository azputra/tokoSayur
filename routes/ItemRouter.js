'use strict';

const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');
const checkAdmin = require('../middlewares/checkAdmin')

router.get('/admin', checkAdmin, ItemController.getItemsAll);
router.get('/add', checkAdmin, ItemController.getItemsAdd);
router.post('/add', checkAdmin, ItemController.postItemsAdd);
router.get('/edit/:id', checkAdmin, ItemController.getItemsEdit);
router.post('/edit/:id', checkAdmin, ItemController.postItemsEdit);
router.get('/delete/:id', checkAdmin, ItemController.getItemsDelete);


module.exports = router;