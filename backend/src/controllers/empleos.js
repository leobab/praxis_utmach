const client = require("../connection");
const pool = require("../connection");
const path = require("path");
const fs = require('fs-extra');

const empleoctrl = {};

//método listar todos los empleos disponibles
empleoctrl.listar_empleos = async (req, res) => {

    try {
        await pool.query(`SELECT * FROM empleos WHERE job_estado='DISPONIBLE';`, (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ mensaje: true, datos: JSON.parse(JSON.stringify(rows)) });
            } else {
                res.status(200).json({ mensaje: false });
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({ mensaje: false, error: e });
    }
    pool.end;
}

//metodo listar todos los empleos
empleoctrl.listar_todos_empleos = async (req, res) => {

    try {
        await pool.query(`SELECT emp.*, u.usu_nombre as nombre_empresa FROM empleos emp, usuarios u WHERE emp.emp_codigo=u.usu_codigo;`, (err, rows) => {
            if (!err) {
                res.status(200).json({ mensaje: true, datos: JSON.parse(JSON.stringify(rows)) });
            } else {
                res.status(200).json({ mensaje: err });
            }
        });
    } catch (err) {
        res.status(500).json({ mensaje: false, error: err });
    }
    pool.end;
}

//método eliminar empleo
empleoctrl.eliminar_empleo = async (req, res) => {

    try {
        const { job_codigo } = req.body;
        await pool.query("DELETE FROM empleos WHERE job_codigo=?;", [job_codigo], async () => {
            await pool.query("DELETE FROM empleo_alumno WHERE job_codigo=?;", [job_codigo], async (err) => {
                if (!err) {
                    res.status(200).json({ mensaje: true });
                } else {
                    res.status(200).json({ mensaje: false });
                }
            });
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
}

//método listar empleos de una empresa
empleoctrl.listar_empleos_empresa = async (req, res) => {
    try {
        const { emp_codigo } = req.body;
        const empleo = await pool.query("select * from empleos where emp_codigo= ?;", [emp_codigo], async (err, rows) => {
            if (!err) {
                var json = JSON.parse(JSON.stringify(rows));
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
}

empleoctrl.create_job = async (req, res) => {
    try {
        var datetime = new Date();
        const { emp_codigo, job_titulo, job_descripcion, job_area, job_ubicacion, job_fecha_ini, job_fecha_fin, job_hora_entrada, job_hora_salida, job_disponibilidad } = req.body;
        var descripcion = "Se creó el empleo: " + job_titulo + " de la empresa: " + emp_codigo;

        await pool.query("INSERT INTO empleos (emp_codigo, job_titulo, job_descripcion, job_area, job_ubicacion, job_fecha_creacion, job_fecha_ini, job_fecha_fin, job_estado, job_hora_entrada, job_hora_salida, job_fecha_actu, job_disponibilidad) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);", [emp_codigo, job_titulo, job_descripcion, job_area, job_ubicacion, datetime.toISOString().slice(0, 10), job_fecha_ini, job_fecha_fin, 'DISPONIBLE', job_hora_entrada, job_hora_salida, null, job_disponibilidad], async (err, rows) => {
            if (!err) {
                await pool.query("insert into logs (log_descripcion, log_fecha) values (?, ?);", [descripcion, datetime.toISOString().slice(0, 10)]);
                var json = JSON.parse(JSON.stringify(rows));
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
}


empleoctrl.update_job = async (req, res) => {
    try {
        var datetime = new Date();
        const { job_titulo, job_descripcion, job_area, job_ubicacion, job_fecha_ini, job_fecha_fin, job_hora_entrada, job_hora_salida, job_codigo, job_disponibilidad } = req.body;
        var descripcion = "Se actualizó el empleo: " + job_titulo + " con código: " + job_codigo;

        await pool.query(`UPDATE empleos SET job_titulo=?, job_descripcion=?, job_area=?, job_ubicacion=?, job_fecha_ini=?, job_fecha_fin=?, job_hora_entrada=?, job_hora_salida=?, job_fecha_actu=?, job_disponibilidad=? WHERE job_codigo=?;`, [job_titulo, job_descripcion, job_area, job_ubicacion, job_fecha_ini, job_fecha_fin, job_hora_entrada, job_hora_salida, datetime.toISOString().slice(0, 10), job_disponibilidad, job_codigo], async (err, rows) => {
            await pool.query(`insert into logs (log_descripcion, log_fecha) values (?, ?);`, [descripcion, datetime.toISOString().slice(0, 10)]);
            if (!err) {
                var json = JSON.parse(JSON.stringify(rows));
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
}

empleoctrl.listar_empleos_xcodigo = async (req, res) => {

    try {
        const { job_codigo } = req.body;
        await pool.query(`select empl.*, (SELECT n.niv_nombre FROM niveles n WHERE n.niv_codigo=empl.job_disponibilidad) as job_disponibilidad, emp.usu_nombre as emp_nombre, emp.usu_codigo as emp_codigo from empleos empl, usuarios emp where job_codigo=? and empl.emp_codigo=emp.usu_codigo;`, [job_codigo], (err, rows) => {
            if (!err) {
                var json = JSON.parse(JSON.stringify(rows[0]));
                console.log(json);
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.statu(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ mensaje: false, error: e });
    }
}


empleoctrl.finalizar_seleccion_alumnos = async (req, res) => {
    try {
        const { job_codigo } = req.body;
        var datetime = new Date();
        var descripcion = "Se terminó la selección de alumnos para el empleo: " + job_codigo;
        const empleo = await pool.query("UPDATE empleos SET job_estado='NO DISPONIBLE' WHERE job_codigo=?;", [job_codigo], async (err, rows)=>{
            if(!err){
                await pool.query("insert into logs (log_descripcion, log_fecha) values (?,?);", [descripcion, datetime.toISOString().slice(0, 10)]);
                var json = JSON.parse(JSON.stringify(rows));
                res.status(200).json({ mensaje: true, datos: json });
            }else{
                res.status(200).json({ mensaje: false });
            }
        });

    } catch (e) {

        res.status(500).json({ mensaje: false, error: e });

    }
}



module.exports = empleoctrl;