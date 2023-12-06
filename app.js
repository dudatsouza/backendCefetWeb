const express = require('express')
const app = express()
const moment = require('moment');
const port = 3010
const bodyParser = require('body-parser');
const formData = require('express-form-data');
const cors = require("cors");
const fs = require('fs');

app.use(formData.parse());
app.use(bodyParser.urlencoded({extended: true}));

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.static('uploads'))

require("./rotas/clientes")(app)
require("./rotas/fornecedores")(app)

app.get('/', (req, res) => {
  res.send("Backend Maria Eduarda Teixeira Souza Rodando...");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})