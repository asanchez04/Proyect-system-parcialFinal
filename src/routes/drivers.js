const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');


const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

const mysqlConnection = require('../database');

//Listar todos los drivers
router.get('/drivers', (req, res) => {
    mysqlConnection.query(`SELECT * from drivers INNER JOIN personalinfo 
    ON drivers.PersonalInfo_id = personalinfo.id`, (err, rows, fields) => {
            if (!err) {
                res.json(rows);
            } else {
                console.log(err);
            }
        });
});

//Buscar driver por identicifacion
router.get('/drivers/:identification', (req, res) => {
    const { identification } = req.params;
    mysqlConnection.query(`SELECT * from drivers INNER JOIN personalinfo 
    ON drivers.PersonalInfo_id = personalinfo.id 
    where personalinfo.identification = ?`, [identification], (err, rows, fields) => {
            if (!err) {
                res.json(rows[0]);
            } else {
                console.log(err);
            }
        });
});

//Registrar nuevo driver
router.post('/drivers', (req, res) => {
    let { fullname, identification, email, phone, avatar, username, _password } = req.body;
    var hash = cryptr.encrypt(req.body._password);
    console.log(hash);
    _password = hash;
    const query = `
         CALL sp_add_driver (?, ?, ?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(query, [fullname, identification, email, phone, avatar, username, _password], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'Driver Saved ' });
        } else {
            console.log(err);
        }
    });
});

//Actualizar driver
router.put('/drivers/:identification', (req, res) => {
    const { fullname, email, phone, avatar, username, _password } = req.body
    const { identification } = req.params;
    var hash = cryptr.encrypt(req.body._password);
    console.log(hash);
    //_password = hash;
    const query = 'CALL sp_update_driver (?, ?, ?, ?, ?, ?, ?)';
    mysqlConnection.query(query, [fullname, identification, email, phone, avatar, username, hash], (err, rows, fields) => {
        if (!err) {
            res.json({ Status: 'Driver Update' });
        } else {
            console.log(err);
        }
    });
});

//Elimiar user
router.delete('/drivers/:identification', (req, res) => {
    const { identification } = req.params;
    mysqlConnection.query(`SELECT * from drivers 
    INNER JOIN personalinfo ON drivers.PersonalInfo_id = personalinfo.id 
    where personalinfo.identification = ?`, [identification], (err, rows, fields) => {
            if (!err) {
                res.json({ Status: 'Driver Deleted' });
            } else {
                console.log(err);
            }
        });
});

//login driver
router.post('/drivers/login', (req, res) => {
    const { email, _password } = req.body;
    mysqlConnection.query(`SELECT * from drivers 
    INNER JOIN personalinfo ON drivers.PersonalInfo_id = personalinfo.id 
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