const mysql = require('mysql');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'WheelsOfFortune'
});

app.get('/users', function (req, res) {
  connection.query('SELECT * FROM `users` WHERE 1', function (err, result) {
    
    if (Object.keys(req.query).length === 0) {
      res.send('отсутствуют параметры запроса users')
    } else {
      
      const sqlReq = `SELECT * FROM users WHERE user_id = ${req.query.userID}`;
      connection.query(sqlReq, function (err, result) {
        if (result.length > 0) {
          
          
          const sqlReq = `UPDATE users SET firstname = '${req.query.firstNAME}', surname = '${req.query.surName}' WHERE users.user_id = ${req.query.userID}`;
          connection.query(sqlReq, function (err, result) {
            
            const sqlReq = `SELECT * FROM users WHERE user_id = ${req.query.userID}`;
            connection.query(sqlReq, function (err, result) {
              res.send(result)
             })
          })
        } else {
          
          const sqlReq = `INSERT INTO users (user_id, ava, firstname, surname, balance) VALUES ('${req.query.userID}', '${req.query.avatar}', '${req.query.firstNAME}', '${req.query.surName}', 0)`;
          connection.query(sqlReq, function (err, result) {
            
            const sqlReq = `SELECT * FROM users WHERE user_id = ${req.query.userID}`;
            connection.query(sqlReq, function (err, result) {
              res.send(result)
            })
          })
        }
      })
    }
    
  })
  
});

app.get('/winners', function (req, res) {
  connection.query('SELECT * FROM `winners` WHERE 1', function (err, result) {
    if (Object.keys(req.query).length === 0) {
      res.send('отсутствуют параметры запроса winners')
    } else {
      
      if (result.length < 4) {
        res.send(result.reverse())
      } else {
        res.send(result.reverse().slice(0,4))
      }

      
    }
    
  })
});

app.put('/users', function (req, res) {
  
  const sqlReq = `UPDATE users SET balance = '${req.query.bal}' WHERE users.user_id = ${req.query.userID}`;
  connection.query(sqlReq, function (err, result) {
    
      const sqlReq = `SELECT * FROM users WHERE user_id = ${req.query.userID}`;
      connection.query(sqlReq, function (err, result) {
        res.send(result)
      })
  })
  
})

app.post('/winners', function (req, res) {
  
  const sqlReq = `INSERT INTO winners (ava, firstname, surname, lastresult) VALUES ('${req.query.ava}', '${req.query.firstname}', '${req.query.surname}', ${req.query.lastres})`;
  connection.query(sqlReq, function (err, result) {
    res.send(result)
    
  })
})


app.listen(PORT, ()=>{console.log('ok')})