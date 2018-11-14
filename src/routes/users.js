const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');


const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const mysqlConnection = require('../database');

//Listar todos los users
router.get('/users', (req, res) => {

    mysqlConnection.query(`SELECT * from users INNER JOIN personalinfo 
    ON users.PersonalInfo_id = personalinfo.id`, (err, rows, fields) => {
        if (!err) {
            res.json(rows);
            console.log("Usuarios mostrados");
        } else {
            console.log(err);
        }
    });
});

//Buscar user por id
router.get('/users/:identification', (req, res) => {
    const { identification } = req.params;
    mysqlConnection.query(`SELECT * from users INNER JOIN personalinfo 
    ON users.PersonalInfo_id = personalinfo.id 
    where personalinfo.identification = ?`, [identification], (err, rows, fields) => {
        if (!err) {
            res.json(rows[0]);
            console.log("Usuario encontrado");
        } else {
            console.log(err);
        }
    });
});

//Registrar nuevo user
router.post('/users', (req, res) => {
    let { fullname, identification, email, phone, avatar, username, _password } = req.body;
    var hash = cryptr.encrypt(req.body._password);
    console.log(hash);
    _password = hash;
    const query = `
    CALL sp_add_user (?, ?, ?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(query, [fullname, identification, email, phone, avatar, username, _password], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'User Saved ' });
        } else {
            console.log(err);
        }
    });
});

//Actualizar user
router.put('/users/:id', (req, res) => {
    const { nombre, email, clave, celular, foto } = req.body
    const { id } = req.params;
    const query = 'CALL userAddOrEdit (?, ?, ?, ?, ?, ?)';
    mysqlConnection.query(query, [id, nombre, email, clave, celular, foto], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'User Update' });
        } else {
            console.log(err);
        }
    });
});

//Elimiar user
router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM proyecto.user WHERE id = ?', [id], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'User Deleted' });
            console.log("Usuario borrado");
        } else {
            console.log(err);
        }
    });
});

//login user
router.post('/users/login', (req, res) => {
    const { email, _password } = req.body;
    mysqlConnection.query(`SELECT * from users 
    INNER JOIN personalinfo ON users.PersonalInfo_id = personalinfo.id 
    where personalinfo.email = ?`, [email], (err, rows, fields) => {
            if (err) {
                console.log(err);
            } else {
                if (rows.length > 0) {
                    console.log(rows[0]._password);
                    var hash = cryptr.decrypt(rows[0]._password);
                    console.log(hash);
                    if (_password == hash) {
                        res.json({
                            Status: 'successfully Driver..'
                        });
                    } else {
                        res.json({ Status: false, message: "Email or Password incorrect" });
                    }
                } else {
                    res.json({ Status: false, message: "Email does not exits" });
                    console.log(rows);
                }
            }
        });
});





module.exports = router;