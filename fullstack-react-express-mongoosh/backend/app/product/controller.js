const connection = require('../../config/mysql');
const path = require('path');
const fs = require('fs');

const index = (req, res) => {
  const {search} = req.query;
  let exec = {};
  if(search) {
    exec = {
      sql: 'SELECT * FROM products WHERE name LIKE ?',
      values: [`%${search}%`]
    }
  }else {
    exec = {
      sql: 'SELECT * FROM products'
    } 
  }
        connection.query(
        exec, _response(res));//untuk pemanggilannya dan parameternya berupa res
      }

const view = (req, res) => {
        connection.query({
          sql: 'SELECT * FROM products WHERE id = ?',
          values: [req.params.id]
        }, _response(res));//untuk pemanggilannya dan parameternya berupa res
      }

const destroy = (req, res) => {
        connection.query({
          sql: 'DELETE FROM products WHERE id = ?',
          values: [req.params.id]
        }, _response(res));//untuk pemanggilannya dan parameternya berupa res
      }

      
const store = (req, res) => {
        const {users_id, name, price, stock, status} = req.body;
        const image = req.file;
            if (image) {
                const target = path.join(__dirname, '../../uploads', image.originalname);
                fs.renameSync(image.path, target);
                // res.sendFile(target);//untuk langsung menampilkan foto yang diupload di insomnia
            
        connection.query({
          sql: 'INSERT INTO products (users_id, name, price, stock, status, image_url) VALUES (?, ?, ?, ?, ?, ?)',
          values: [parseInt(users_id), name, price, stock, status, `http://localhost:3000/public/${image.originalname}`]
        }, _response(res));//untuk pemanggilannya dan parameternya berupa res
      }
    }

const update = (req, res) => {
        const {users_id, name, price, stock, status} = req.body;
        const image = req.file;
        let sql = '';
        let values = [];
            if (image) {
                const target = path.join(__dirname, '../../uploads', image.originalname);
                fs.renameSync(image.path, target);
                sql = 'UPDATE products SET users_id = ?, name = ?, price = ?, stock = ?, status = ?, image_url = ? WHERE id = ?';
                values = [parseInt(users_id), name, price, stock, status, `http://localhost:3000/public/${image.originalname}`, req.params.id]
            }else{
              sql = 'UPDATE products SET users_id = ?, name = ?, price = ?, stock = ?, status = ? WHERE id = ?';
              values = [parseInt(users_id), name, price, stock, status, req.params.id]
            }

        connection.query({sql, values}, _response(res));//untuk pemanggilannya dan parameternya berupa res
      }

      const _response = (res) => {//method private
        return (error, result) => {
            if(error) {
              res.send({
                status: 'failed',
                response: 'error'
              });
            }else {
              res.send({
                status: 'succes',
                response: result
              });
            }
          }
      }

      module.exports = {
        index,
        view,
        store,
        update,
        destroy
      }