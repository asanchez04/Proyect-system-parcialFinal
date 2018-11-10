const express = require('express');
const router = express.Router();

const mysqlConnection = require('../database');

//Listar todos los drivers
router.get('/api/drivers', (req, res) => {

    mysqlConnection.query('SELECT * FROM proyecto.drivers', (err, rows, fields) => {
        if(!err) {
            res.json(rows);
        } else {
            console.log(err);
        }
    });
});

//Buscar user por id
router.get('/api/drivers/:iddrivers', (req, res) => {
    const { iddrivers } = req.params;
    mysqlConnection.query('SELECT * FROM proyecto.drivers WHERE iddrivers = ?', [iddrivers], (err, rows, fields) => {
        if(!err) {
            res.json(rows[0]);
        } else {
            console.log(err);
        }
    });
});

//Registrar nuevo driver
router.post('/api/drivers', (req, res) => {
    const { iddrivers, Nombre, identificacion, email, celular, placa, foto, fotoVehiculo, users_idusers} = req.body;
    const query = `
        CALL driverAddOrEdit (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    mysqlConnection.query(query, [iddrivers, Nombre, identificacion, email, celular, placa, foto, fotoVehiculo, users_idusers], (err, rows, fields) => {
        if (!err) {
            res.json({Status: 'Driver Saved '});
        } else {
            console.log(err);
        }
    });
});

//Elimiar user
router.delete('/api/drivers/:iddrivers', (req, res) => {
    const { iddrivers } = req.params;
    mysqlConnection.query('DELETE FROM proyecto.drivers WHERE iddrivers = ?', [iddrivers], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Driver Deleted'});
        } else {
           console.log(err);
        }
    });
});






module.exports = router;