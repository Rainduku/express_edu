const express = require('express');
const app = express();
const port = 3000;

app.use('/', (req, res) => {
  res.send({
    status: 'succesfully',
    message: 'welcome to express js tutorial'
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
