const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

//Listar todos los users
router.get('/api/users', (req, res) => {

    mysqlConnection.query('SELECT * FROM proyecto.users', (err, rows, fields) => {
        if(!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

//Buscar user por id
router.get('/api/users/:idusers', (req, res) => {
    const { idusers } = req.params;
    mysqlConnection.query('SELECT * FROM proyecto.users WHERE idusers = ?', [idusers], (err, rows, fields) => {
        if(!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Registrar nuevo user
router.post('/api/users', (req, res) => {
    const { idusers, nombre, email, celular, foto} = req.body;
    const query = `
        CALL userAddOrEdit (?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(query, [idusers, nombre, email, celular, foto], (err, rows, fields) => {
        if (!err) {
            res.json({Status: 'User Saved '});
        } else {
            console.log(err);
        }
    });
});

//Actualizar user
router.put('/api/users/:idusers', (req, res) => {
    const {nombre, email, celular, foto} = req.body
    const {idusers} = req.params;
    const query = `
        CALL userAddOrEdit (?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(query, [idusers, nombre, email, celular, foto], (err, rows, fields) => {
        if(!err) {
            res.json({Status: 'User Update'});
        } else {
            console.log(err);
        }
    });
});

//Elimiar user
router.delete('/api/users/:idusers', (req, res) => {
    const { idusers } = req.params;
    mysqlConnection.query('DELETE FROM proyecto.users WHERE idusers = ?', [idusers], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'User Deleted'});
        } else {
           console.log(err);
        }
    });
});



module.exports = router;