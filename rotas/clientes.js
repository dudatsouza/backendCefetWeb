const express = require('express')
const app = express()
const moment = require('moment');
const port = 3010
const bodyParser = require('body-parser');
const formData = require('express-form-data');
const cors = require("cors");
const connection = require("../config/database")
const fs = require('fs');
const { mkdirp } = require('mkdirp');

app.use(formData.parse());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = (app) => {
  const rotas = express.Router()

  rotas.get("/novarota", (req, res) => {
    res.send("Nova rota para clientes")
  })

  rotas.get('/cliente', (req, res) => {
    connection.query(
      'select * from cliente',
      (err, results, fields) => {
        if (err) console.log(err)
        res.send(results)
      }
    );
  })

  rotas.get('/cliente/:id_cliente', (req, res) => {
    var id_cliente = req.params.id_cliente
    connection.query(
      `select * from cliente where id_cliente = ${id_cliente}`,
      (err, results, fields) => {
        if (err) console.log(err)
        var resultado = {}
        resultado.id_cliente = results[0].id_cliente;
        resultado.nome = results[0].nome;
        resultado.sobrenome = results[0].sobrenome;
        resultado.email = results[0].email;
        resultado.data_cadastro = moment(results[0].data_cadastro).format("DD/MM/YYYY");
        resultado.salario = results[0].salario;

        res.send(resultado)
      }
    );
  })

  rotas.get('/cliente_email/:email', (req, res) => {
    var email = req.params.email
    var sql = `select * from cliente where email = "${email}"`
    connection.query(
      sql,
      (err, results, fields) => {
        if (err) console.log(err)
        console.log(results)
        if (results.length > 0) res.send({ existe: true })
        else res.send({ existe: false })
      }
    );
  })

  rotas.post('/cliente_del/:id_cliente', (req, res) => {
    var id_cliente = req.params.id_cliente
    connection.query(
      `delete from cliente where id_cliente = ${id_cliente}`,
      (err, results, fields) => {
        if (err) console.log(err)
        res.send(results)
      }
    );
  })

  rotas.post('/cliente', (req, res) => {
    var nome = req.body.nome
    var sobrenome = req.body.sobrenome
    var email = req.body.email
    var data_cadastro = moment().format("YYYY-MM-DD")
    var salario = req.body.salario
    console.log(req.files)
    var sql = `insert into cliente (nome, sobrenome, email, data_cadastro, salario)`
      + `values("${nome}", "${sobrenome}", "${email}", "${data_cadastro}", "${salario}")`

    connection.query(sql, (erro, resultado, fields) => {
      if (erro)
        res.send(erro)

      var path = './uploads/clientes';

      if (Object.keys(req.files).length > 0) {
        mkdirp(path).then(made => {
          var caminhoTemp = req.files.avatar.path;
          var type = req.files.avatar.type.split('/');
          var caminhoNovo = `${path}/${resultado.insertId}.${type[type.length - 1]}`;

          fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
            res.send(resultado)
          });
        }).catch(err => {
          console.log(err)
        });
      } else {
        res.send(resultado)
      }
    })

  })

  rotas.post('/cliente_up/:id_cliente', (req, res) => {
    var nome = req.body.nome;
    var sobrenome = req.body.sobrenome;
    var email = req.body.email;
    var salario = req.body.salario;
    var id_Cliente = req.params.id_cliente;
    var sql = `update cliente set nome = "${nome}", sobrenome = "${sobrenome}", email = "${email}", salario = ${salario} `
      + `where id_cliente = ${id_Cliente}`

    connection.query(sql, (erro, resultado, fields) => {
      if (erro)
        res.send(erro)

      var path = './uploads/clientes';

      if (Object.keys(req.files).length > 0) {
        mkdirp(path).then(made => {
          var caminhoTemp = req.files.avatar.path;
          var type = req.files.avatar.type.split('/');
          var caminhoNovo = `${path}/${id_Cliente}.${type[type.length - 1]}`;

          fs.copyFile(caminhoTemp, caminhoNovo, (err) => {
            res.send(resultado)
          });
        }).catch(err => {
          console.log(err)
        });
      } else {
        res.send(resultado)
      }
    })
  });

  rotas.post('/login', (req, res) => {
    var nome = req.body.nome;
    var email = req.body.email;

    var sql = `SELECT * FROM cliente WHERE nome = '${nome}' AND email = '${email}'`;
    
    connection.query(sql, (erro, results, fields) => {
      if (erro) {
        res.send(erro);
        return;
      }
    
      if (results.length === 0) {
        res.status(401).json({ message: 'Cliente não encontrado' });
      } else {
        var resultado = {}
        resultado.id_cliente = results[0].id_cliente;
        resultado.nome = results[0].nome;
        resultado.sobrenome = results[0].sobrenome;
        resultado.email = results[0].email;
        resultado.data_cadastro = moment(results[0].data_cadastro).format("DD/MM/YYYY");
        resultado.salario = results[0].salario;
        

        res.send(resultado)
      }
    })
  });

  app.use("/", rotas)
}