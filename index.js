const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: 'Umesh@706', // Replace with your MySQL password
    database: 'mydb'
});

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL connected...');
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
// Insert user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    try{
    db.query('CALL insert_user(?, ?)', [name, email], (err, results) => {
        if (err) {
            throw err;
        }
        res.status(200).send({msg:'User added'});
    });
}catch(err){
    res.status(300).send({err:err});
}
});

// Get all users
app.get('/users', (req, res) => {
    try{
    db.query('CALL get_users()', (err, results) => {
        if (err) {
            throw err;
        }
        res.send(results[0]);
    });
    }catch(err){
        res.send(400).send({success:false,error:err});
    }
});

// Update user
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    db.query('CALL update_user(?, ?, ?)', [id, name, email], (err, results) => {
        if (err) {
            throw err;
        }
        res.send('User updated');
    });
});

// Delete user
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('CALL delete_user(?)', [id], (err, results) => {
        if (err) {
            throw err;
        }
        res.send('User deleted');
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});