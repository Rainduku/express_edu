require('./config/mongoose');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');//untuk menangani file static
const port = 3000;
// const productrouter =require('./app/product/routes');
// const productrouterV2 =require('./app/product_v2/routes');//untuk api mysql
const productRouterV3 = require('./app/product_v3/routes');
const productRouterV4 = require('./app/product_v4/routes');
const logger = require('morgan');

app.use(cors());
app.use(logger('dev'));
app.use(express.urlencoded({extended: true}));//untuk api insomnia
app.use(express.json());//menambahkan middleware dalam insomnia
app.use('/public', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/v1', productrouter);
// app.use('/api/v2', productrouterV2);//untuk api mysql
app.use('/api/v3', productRouterV3);
app.use('/api/v4', productRouterV4);
app.use((req, res, next) => {
    res.status(404);
    res.send({
        status: 'failed',
        message: 'resource ' + req.originalUrl + ' Not Found'
    })
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
