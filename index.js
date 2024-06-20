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
    console.log("req",req);
    console.log("req.body",req.body);
    const {FirstName, LastName, MobileNo, Age, Latitude, Longitude, City, Address, SubLocality} = req.body;
    console.log("req.body");
    try{
    db.query('CALL InsertEmployee(?)', [JSON.stringify(req.body)], (err, results) => {
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
    const {employee_id} = req.body;
    try{
    db.query('CALL GetEmployeeByID(?)',[JSON.stringify(req.body)], (err, results) => {
        if (err) {
            console.log(err);
        }
        console.log(results[0][0].addresses)
        res.send(results[0]);
    });
    }catch(err){
        res.send(400).send({success:false,error:err});
    }
});

// Update user
app.put('/users', (req, res) => {
    const { name, email } = req.body;
    console.log(req.body);
    db.query('CALL UpdateEmployee(?)', JSON.stringify(req.body), (err, results) => {
        if (err) {
            throw err;
        }
        res.send('User updated');
    });
});

// Delete user
app.delete('/users', (req, res) => {

    const employeeId = req.body;

    if (!employeeId) {
        return res.status(400).send('Employee ID is required');
    }

    db.query('CALL DeleteEmployee(?)', [JSON.stringify(req.body)], (err, results) => {
        if (err) {
            console.error('Error executing stored procedure:', err);
            return res.status(500).send('Error deleting user');
        }
        res.send('User deleted');
    });
});




// Start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
