const mongoose = require('mongoose');

const url = 'mongodb://eduwork:asdasdasd@localhost:27017/eduwork-mongoose?authSource=db';

// Connect ke MongoDB
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Ambil koneksi default
const db = mongoose.connection;

// Event handler
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Server database terhubung');
});
