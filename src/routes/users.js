const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

//Listar todos los users
router.get('/users', (req, res) => {

    mysqlConnection.query('SELECT * FROM proyecto.user', (err, rows, fields) => {
        if(!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

//Buscar user por id
router.get('/users/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM proyecto.user WHERE id = ?', [id], (err, rows, fields) => {
        if(!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Registrar nuevo user
router.post('/users', (req, res) => {
    const { id, nombre, email, clave, celular, foto} = req.body;
    const query = `
        CALL userAddOrEdit (?, ?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(query, [id, nombre, email, clave, celular, foto], (err, rows, fields) => {
        if (!err) {
            res.json({Status: 'User Saved '});
        } else {
            console.log(err);
        }
    });
});

//Actualizar user
router.put('/users/:id', (req, res) => {
    const {nombre, email, clave, celular, foto} = req.body
    const {id} = req.params;
    const query = 'CALL userAddOrEdit (?, ?, ?, ?, ?, ?)';
    mysqlConnection.query(query, [id, nombre, email, clave, celular, foto], (err, rows, fields) => {
        if(!err) {
            res.json({Status: 'User Update'});
        } else {
            console.log(err);
        }
    });
});

//Elimiar user
router.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM proyecto.user WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'User Deleted'});
        } else {
           console.log(err);
        }
    });
});



module.exports = router;