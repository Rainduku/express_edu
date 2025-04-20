const { ObjectId } = require('mongodb');
const db = require('../../config/mongodb');
const fs = require('fs');
const path = require('path');

const index = (req, res) => {
  db.collection('products').find()
    .toArray()
    .then(result => res.send(result))
    .catch(error => res.send(error));
};

const view = (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "ID tidak valid" });
    }
    
    db.collection('products').findOne({ _id: new ObjectId(id) })
      .then(result => {
        if (!result) return res.status(404).send({ message: "Produk tidak ditemukan" });
        res.send(result);
      })
      .catch(error => res.status(500).send({ message: "Gagal ambil detail produk", error }));
    
};

const store = (req, res) => {
  const { name, price, stock, status } = req.body;
  const image = req.file;

  if (image) {
    const target = path.join(__dirname, '../../uploads', image.originalname);
    fs.renameSync(image.path, target);

    db.collection('products').insertOne({
      name,
      price,
      stock,
      status,
      image_url: `http://localhost:3000/public/${image.originalname}`
    })
      .then(result => {
        res.send({ message: "Produk berhasil ditambahkan", result });
      })
      .catch(error => {
        res.status(500).send({ message: "Gagal simpan produk", error });
      });
  } else {
    res.status(400).send({ message: "Gambar wajib diupload" });
  }
};

const update = (req, res) => {
  const { id } = req.params;
  const { name, price, stock, status } = req.body;
  const image = req.file;

  const updateData = { name, price, stock, status };

  if (image) {
    const target = path.join(__dirname, '../../uploads', image.originalname);
    fs.renameSync(image.path, target);
    updateData.image_url = `http://localhost:3000/public/${image.originalname}`;
  }

  db.collection('products').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updateData },
    { returnDocument: 'after' }
  )
    .then(result => {
      if (!result.value) return res.status(404).send({ message: "Produk tidak ditemukan" });
      res.send({ message: "Produk berhasil diupdate", result: result.value });
    })
    .catch(error => res.status(500).send({ message: "Gagal update produk", error }));
};

const destroy = (req, res) => {
  const { id } = req.params;

  db.collection('products').findOneAndDelete({ _id: new ObjectId(id) })
    .then(result => {
      if (!result.value) return res.status(404).send({ message: "Produk tidak ditemukan" });
      res.send({ message: "Produk berhasil dihapus" });
    })
    .catch(error => res.status(500).send({ message: "Gagal hapus produk", error }));
};

module.exports = {
  index,
  view,
  store,
  update,
  destroy
};
