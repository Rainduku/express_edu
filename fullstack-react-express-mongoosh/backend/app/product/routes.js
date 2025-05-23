const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
// const fs = require('fs');
// const path = require('path');
const connection = require('../../config/mysql');
const productController = require('./controller');

router.get('/product', productController.index);
router.get('/product/:id', productController.view);
router.post('/product', upload.single('image'), productController.store);
router.put('/product/:id', upload.single('image'), productController.update);
router.delete('/product/:id', productController.destroy);

  router.get('/:category/:tag', (req, res) => {
    const {category, tag} = req.params;
    res.json({category, tag});
  });


  module.exports = router;