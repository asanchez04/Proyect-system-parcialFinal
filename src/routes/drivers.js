const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

//Listar todos los drivers
router.get('/drivers', (req, res) => {

    mysqlConnection.query('SELECT * FROM proyecto.driver', (err, rows, fields) => {
        if(!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

//Buscar user por id
router.get('/drivers/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('SELECT * FROM proyecto.driver WHERE id = ?', [id], (err, rows, fields) => {
        if(!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Registrar nuevo driver
router.post('/drivers', (req, res) => {
    const { id, nombre, identificacion, email, clave, celular, placa, foto, fotovehiculo} = req.body;
    const query = `
        CALL driverAddOrEdit (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(query, [id, nombre, identificacion, email, clave, celular, placa, foto, fotovehiculo], (err, rows, fields) => {
        if (!err) {
            res.json({Status: 'Driver Saved '});
        } else {
            console.log(err);
        }
    });
});

//Actualizar driver
router.put('/drivers/:id', (req, res) => {
    const {nombre, identificacion, email, clave, celular, placa, foto, fotovehiculo} = req.body
    const {id} = req.params;
    const query = 'CALL driverAddOrEdit (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    mysqlConnection.query(query, [id, nombre, identificacion, email, clave, celular, placa, foto, fotovehiculo], (err, rows, fields) => {
        if(!err) {
            res.json({Status: 'Driver Update'});
        } else {
            console.log(err);
        }
    });
});

//Elimiar user
router.delete('/drivers/:id', (req, res) => {
    const { id } = req.params;
    mysqlConnection.query('DELETE FROM proyecto.driver WHERE id = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Driver Deleted'});
        } else {
           console.log(err);
        }
    });
});






module.exports = router;