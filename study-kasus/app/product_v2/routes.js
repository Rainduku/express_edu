const router = require('express').Router();
const Product = require('./model');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({dest: 'uploads'});

router.post('/product', upload.single('image'),async (req, res) => {
    const {users_id, name, price, stock, status} = req.body;
    const image = req.file;
    if(image) {
        const target = path.join(__dirname, '../../uploads', image.originalname);
        fs.renameSync(image.path, target);
    }
    try {
        await Product.sync();
        const result = await Product.create({users_id, name, price, stock, status, image_url: `http://localhost:3000/public/${image.originalname}`});
        res.send(result);
    }catch(e) {
        res.send(e);
    }
});

// GET all products
router.get('/product', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (e) {
        res.status(500).send(e);
    }
});

// GET product by ID
router.get('/product/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.put('/product/:id', upload.single('image'), async (req, res) => {//untuk put
    const { id } = req.params;
    const { users_id, name, price, stock, status } = req.body;
    const image = req.file;
    let imageUrl;

    try {
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (image) {
            const target = path.join(__dirname, '../../uploads', image.originalname);
            fs.renameSync(image.path, target);
            imageUrl = `http://localhost:3000/public/${image.originalname}`;
        }

        await product.update({
            users_id: users_id || product.users_id,
            name: name || product.name,
            price: price || product.price,
            stock: stock || product.stock,
            status: status || product.status,
            image_url: imageUrl || product.image_url
        });

        res.json(product);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.delete('/product/:id', async (req, res) => {//untuk delete
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.destroy();
        res.json({ message: 'Product deleted successfully' });
    } catch (e) {
        res.status(500).send(e);
    }
});


module.exports = router;