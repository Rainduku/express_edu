const Product = require('./model');
const fs = require('fs');
const path = require('path');

const createProduct = (req, res) => {
  const { name, price, stock, status } = req.body;
  const image = req.file;

  if (image) {
    const target = path.join(__dirname, '../uploads', image.originalname);
    fs.renameSync(image.path, target);

    Product.create({
      name,
      price,
      stock,
      status,
      image_url: `http://localhost:3000/public/${image.originalname}`
    })
    .then(result => res.send(result))
    .catch(error => res.status(500).send(error));
  } else {
    res.status(400).send({ error: 'Image is required' });
  }
};

const getAllProducts = (req, res) => {
  Product.find()
    .then(result => res.send(result))
    .catch(error => res.status(500).send(error));
};

const getProductById = (req, res) => {
  Product.findById(req.params.id)
    .then(result => {
      if (!result) return res.status(404).send({ message: 'Product not found' });
      res.send(result);
    })
    .catch(error => res.status(500).send(error));
};

const updateProduct = (req, res) => {
  const { name, price, stock, status } = req.body;

  Product.findByIdAndUpdate(
    req.params.id,
    { name, price, stock, status },
    { new: true }
  )
    .then(result => {
      if (!result) return res.status(404).send({ message: 'Product not found' });
      res.send(result);
    })
    .catch(error => res.status(500).send(error));
};

const deleteProduct = (req, res) => {
  Product.findByIdAndDelete(req.params.id)
    .then(result => {
      if (!result) return res.status(404).send({ message: 'Product not found' });
      res.send({ message: 'Product deleted' });
    })
    .catch(error => res.status(500).send(error));
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
