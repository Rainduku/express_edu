const {MongoClient} = require('mongodb');

const url = 'mongodb://eduwork:asdasdasd@localhost:27017?authSource=db';
const client = new MongoClient(url);

(async () => {
    try {
        await client.connect();
        console.log('koneksi ke mongodb berhasil');
    } catch (e) {
        console.log(e)
    }
})();

const db = client.db('db');

module.exports = db;