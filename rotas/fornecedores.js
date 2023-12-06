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
app.use(bodyParser.urlencoded({extended: true}));

module.exports = (app) => {
    const rotas = express.Router() 

    rotas.get("/novarota", (req, res) => {
      res.send("Nova rota para fornecedores")
    })

    rotas.get('/fornecedor', (req, res) => {
        connection.query(
          'select * from fornecedor',
          (err, results, fields) => {
            if(err) console.log(err)
            res.send(results)
          }
        );
    });

    rotas.get('/fornecedor/:id_fornecedor?', (req, res) => {
      var id_fornecedor = req.params.id_fornecedor
      var resultado = {} // definir a variável resultado
    
      connection.query(
        `select * from fornecedor where id_fornecedor = ${id_fornecedor}`,
        (erro, results) => {
          if (erro) {
            res.send(erro);
          } else if (results && results.length > 0) {
            resultado.razao = results[0].razao;
            resultado.cpf_cnpj = results[0].cpf_cnpj;
            resultado.contato = results[0].contato;
            resultado.logradouro = results[0].logradouro;
            resultado.cidade = results[0].cidade;
            resultado.uf = results[0].uf;
            res.send(resultado);
          } else {
            res.send("Nenhum resultado encontrado.");
          }
        })
    });

      rotas.post('/fornecedor', (req, res) => {
        var razao =  req.body.razao
        var cpf_cnpj =  req.body.cpf_cnpj
        var contato =  req.body.contato
        var logradouro =  req.body.logradouro
        var cidade =  req.body.cidade
        var uf =  req.body.uf
        console.log(req.files)

        var sql = `insert into fornecedor(razao, cpf_cnpj, contato, logradouro, cidade, uf)` +
                  `values("${razao}", "${cpf_cnpj}", "${contato}", "${logradouro}", "${cidade}", "${uf}")`

        connection.query(sql, (erro, resultado, fields) => {
          if (erro)
              res.send(erro)

          var path = './uploads/fornecedores';

          if(Object.keys(req.files).length > 0){
              mkdirp(path).then(made => {
                  var caminhoTemp = req.files.logomarca.path;
                  var type = req.files.logomarca.type.split('/');
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
      });

      rotas.post('/fornecedor_del/:id_fornecedor?', (req, res) => {
        var id_fornecedor = req.params.id_fornecedor

        connection.query(
          `delete from fornecedor where id_fornecedor = ${id_fornecedor}`,
          (err, results, fields) => {
            if(err) console.log(err)
            res.send(results)
          }
        );
      });

      rotas.post('/fornecedor_up/:id_fornecedor?', (req, res) => {
        var id_fornecedor = req.params.id_fornecedor
        var razao =  req.body.razao
        var cpf_cnpj =  req.body.cpf_cnpj
        var contato =  req.body.contato
        var logradouro =  req.body.logradouro
        var cidade =  req.body.cidade
        var uf =  req.body.uf

        var sql = `update fornecedor set razao = "${razao}", cpf_cnpj = "${cpf_cnpj}", contato = "${contato}", logradouro = "${logradouro}", cidade = "${cidade}", uf = "${uf}"`
                  + `where id_fornecedor = "${id_fornecedor}"`

        connection.query(sql, (erro, resultado, fields) => {
          if (erro)
              res.send(erro)

          var path = './uploads/fornecedores';

          if(Object.keys(req.files).length > 0){
              mkdirp(path).then(made => {
                  var caminhoTemp = req.files.logomarca.path;
                  var type = req.files.logomarca.type.split('/');
                  var caminhoNovo = `${path}/${id_fornecedor}.${type[type.length - 1]}`;
  
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

      app.use ("/", rotas)
}