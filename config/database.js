const mysql = require('mysql2');
const connection = mysql.createConnection({
    host : 'aulascefet.c8tuthxylqic.sa-east-1.rds.amazonaws.com',
    user : 'aluno',
    password : 'alunoc3f3t',
    database : 'aulas_web'
  });


module.exports = connection