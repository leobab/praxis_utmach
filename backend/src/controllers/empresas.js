const client = require("../connection");
const pool = require("../connection");
const path = require("path");
const fs = require('fs-extra');

const empctrl = {};

var datetime = new Date();
var descripcion = "";

//método listar empresas
empctrl.listar_empresas = async (req, res) => {

    try{
        pool.query('select u.usu_codigo, u.usu_nombre, u.usu_correo, u.usu_direccion, u.usu_telefono, e.emp_descripcion, e.emp_categoria, e.emp_fecha_creacion, e.emp_convenio, e.emp_estado from usuarios as u inner join empresa as e on u.usu_codigo=e.emp_codigo;', (err, rows,fields) => {
            if (!err) {
                var json= JSON.parse(JSON.stringify(rows));
                console.log(rows);
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(200).json({ mensaje: false});
            }
        });
    }catch(e){
        res.status(500).json({ mensaje: e });
    }
    pool.end;
}

//listar una empresa en específico
empctrl.listar_empresa = async (req, res) => {
    try {
        const { usu_codigo } = req.body;
        await pool.query("SELECT * FROM empresa WHERE emp_codigo=?;", [usu_codigo], (err, rows, fields) => {
            if (!err) {
                var json = JSON.parse(JSON.stringify(rows));
                res.status(200).json({ mensaje: true, datos: json[0] });
                console.log(json);
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
}

//método validar empresa
empctrl.validar_empresa = async (req, res) => {

    try {

        const { emp_codigo } = req.body;
        descripcion = "Se valido la empresa con el código: " + emp_codigo;
        await pool.query("UPDATE empresa set emp_estado='VALIDADO' WHERE emp_codigo=?;", [emp_codigo], async (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ mensaje: true });
                await pool.query("insert into logs (log_descripcion, log_fecha) values (?,?);", [descripcion, datetime.toISOString().slice(0, 10)]);
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
}


//método eliminar empresa
empctrl.eliminar_empresa = async (req, res) => {

    try {
        const { emp_codigo } = req.body;
        descripcion = "Se eliminó la empresa con el código: " + emp_codigo;
        await pool.query("DELETE FROM empresa WHERE emp_codigo=?;", [emp_codigo], async (err,rows, fields)=>{
            await pool.query("DELETE FROM empleos WHERE emp_codigo=?;", [emp_codigo],async (err,rows, fields)=>{
                await pool.query("DELETE FROM empleo_alumno WHERE emp_codigo=?;", [emp_codigo],async (err,rows, fields)=>{
                    await pool.query("DELETE FROM usuarios WHERE usu_codigo=?;", [emp_codigo],async (err,rows, fields)=>{
                        if(!err){
                            console.log('Se elminio la empresa');
                            await pool.query("insert into logs (log_descripcion, log_fecha) values (?,?);", [descripcion, datetime.toISOString().slice(0, 10)]);
                            res.status(200).json({ mensaje: true });
                        }else{
                            res.status(200).json({ mensaje: false });
                        }
                    });
                });
            });
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
}



module.exports = empctrl;