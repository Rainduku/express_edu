const router = require('express').Router();
const multer = require('multer');
const upload = multer({dest: 'uploads'});
const productController = require('./model');
const Product = require('./model');
const fs = require('fs');
const path = require('path');


router.post('/product', upload.single('image'), (req, res) => {
    const {name, price, stock, status} = req.body;
        const image = req.file;
            if (image) {
                const target = path.join(__dirname, '../../uploads', image.originalname);
                fs.renameSync(image.path, target);
                Product.create({name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`})
                .then(result => res.send(result))
                .catch(error => res.send(error));
            }
});

router.get('/product', (req, res) => {
    Product.find()
    .then(result => res.send(result))
    .catch(error => res.send(error));
});

router.get('/product/:id', (req, res) => {
    Product.findById(req.params.id)
      .then(result => {
        if (!result) return res.status(404).send({ message: 'Product not found' });
        res.send(result);
      })
      .catch(error => res.status(500).send(error));
  });
  
  //  Update Product by ID
  router.put('/product/:id', upload.single('image'), async (req, res) => {
    try {
      const { name, price, stock, status } = req.body;
      const image = req.file;
  
      const updateData = { name, price, stock, status };
  
      if (image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
        updateData.image_url = `http://localhost:3000/public/${image.originalname}`;
      }
  
      const result = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
  
      if (!result) {
        return res.status(404).send({ message: 'Product not found' });
      }
  
      res.send(result);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });
  
  
  //  Delete Product by ID
  router.delete('/product/:id', (req, res) => {
    Product.findByIdAndDelete(req.params.id)
      .then(result => {
        if (!result) return res.status(404).send({ message: 'Product not found' });
        res.send({ message: 'Product deleted' });
      })
      .catch(error => res.status(500).send(error));
  });

module.exports = router;