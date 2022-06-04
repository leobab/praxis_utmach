const client = require("../connection");
const pool = require("../connection");
const path = require("path");
const fs = require('fs-extra');
const { json } = require("body-parser");
const e = require("express");

const reqctrl = {};

reqctrl.listar_niveles_estudios = async (req, res) => {
    try {
        await pool.query(`SELECT niv_codigo, niv_nombre FROM niveles WHERE niv_tabla LIKE '%EST%' ORDER BY niv_codigo ASC;`, (err, rows, fields) => {
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

reqctrl.listar_niveles_idiomas = async (req, res) => {
    try {
        await pool.query(`SELECT niv_codigo, niv_nombre FROM niveles WHERE niv_tabla LIKE '%IDI%' ORDER BY niv_codigo ASC;`, (err, rows, fields) => {
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



reqctrl.listar_idiomas = async (req, res) => {

    try {
        await pool.query('SELECT idi_codigo, idi_nombre FROM idiomas ORDER BY idi_codigo ASC;', (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ mensaje: true, datos: JSON.parse(JSON.stringify(rows)) });
            } else {
                res.status(200).json({ mensaje: false, err: err});
            }
        })
    } catch (e) {
        console.log(e);
        res.status(500).json({ mensaje: false, error: e });
    }
    pool.end;
}

reqctrl.listar_fecha_practica = async (req, res) => {
    try {
        await pool.query(`SELECT * FROM proyecto_tesis.fecha_practica ORDER BY cod_fecha_practica;`, (err, rows, fields) => {
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

reqctrl.visualizar_idioma = async (req, res) => {

    try {
        const { idi_codigo, niv_codigo } = req.body;

        console.log('CODIGO IDIOMA'+idi_codigo);
        console.log('CODIGO Nivel'+niv_codigo);
        await pool.query("SELECT idi_nombre, niv_nombre FROM idiomas, niveles WHERE idi_codigo=? AND niv_codigo=?;", [idi_codigo, niv_codigo], (err, rows)=>{
            if(!err){
                var json = JSON.parse(JSON.stringify(rows[0]));
                console.log('--------------------------------');
                res.status(200).json({ mensaje: true, datos: json });
            }else{
                res.status(200).json({ mensaje: false });
            }
        });

    } catch (e) {
        res.status(500).json({ mensaje: e });
    }

}

reqctrl.listar_niveles_skills = async (req, res) => {

    try {
        await pool.query(`SELECT niv_codigo, niv_nombre FROM niveles WHERE niv_tabla LIKE '%SKILL%' ORDER BY niv_codigo ASC;`, (err, rows, fields) => {
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

reqctrl.listar_skills = async (req, res) => { //FUNCIONA
    try {
        await pool.query(`SELECT ski_codigo, ski_nombre FROM skills;`, (err, rows, fields) => {
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


reqctrl.visualizar_skill = async (req, res) => { //PROBAR
    try {
        const { ski_codigo, niv_codigo } = req.body;
        await pool.query(`SELECT ski_nombre, niv_nombre FROM skills, niveles WHERE ski_codigo=? AND niv_codigo=?;`, [ski_codigo, niv_codigo], (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ mensaje: true, datos: JSON.parse(JSON.stringify(rows[0])) });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {

        res.status(500).json({ mensaje: false, error: e });

    }
}

reqctrl.listar_genero = async (req, res) => { //FUNCIONA
    try {
        await pool.query("SELECT * FROM genero;", (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ mensaje: true, datos: JSON.parse(JSON.stringify(rows)) });
            } else {
                res.status(500).json({ mensaje: err });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
    pool.end;
}


reqctrl.ver_datos_alumno = async (req, res) => { //HAY QUE PROBAR CON DATOS

    try {
        const alum_codigo = req.params["id"];
        await pool.query(`SELECT 
        u.*, 
        a.*, 
        (SELECT p.paral_nombre FROM paralelos p 
            WHERE a.alum_paral=p.paral_codigo) as paralelo,  
        (SELECT s.sem_nombre as semestre FROM semestres s
            WHERE a.alum_sem=s.sem_codigo) as semestre
    FROM usuarios as u, alumnos as a WHERE u.usu_codigo=a.alum_codigo AND a.alum_codigo=?`, [alum_codigo], (err, rows, fields) => {
            if (!err) {

                var json = JSON.parse(JSON.stringify(rows[0]));
                console.log(json);
                res.status(200).json({ mensaje: true, datos: json, id_sesion: req.session.usu_codigo });
            } else {
                res.status(500).json({ mensaje: false });
            }
            
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
}


reqctrl.ver_datos_empresa = async (req, res) => { //HAY QUE PROBAR CON DATOS
    try {
        const user_id = req.params["id"];
        await pool.query(`select u.*, e.* from usuarios as u, empresa as e where u.usu_codigo=e.emp_codigo and e.emp_codigo=?`, [user_id], (err, rows, fields) => {
            if (!err) {

                var json = JSON.parse(JSON.stringify(rows[0]));
                console.log(json);
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(500).json({ mensaje: false });
            }
            
        });
        
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });

    }
}


reqctrl.listar_semestres = async (req, res) => { //FUNCIONA
    try {
        await pool.query(`select * from semestres ORDER BY sem_codigo ASC;`, (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ mensaje: true, datos: JSON.parse(JSON.stringify(rows)) });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch {
        res.status(500).json({ mensaje: false, error: e });

    }
    pool.end;
}

reqctrl.listar_paralelos = async (req, res) => { //FUNCIONA
    try {
        await pool.query(`SELECT * FROM paralelos ORDER BY paral_codigo ASC;`, (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ mensaje: true, datos: JSON.parse(JSON.stringify(rows)) });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch {
        res.status(500).json({ mensaje: false, error: e });

    }
    pool.end;
}


reqctrl.listar_horarios = async (req, res) => { //FUNCIONA
   
    try {
        await pool.query(`SELECT niv_codigo, niv_nombre FROM niveles WHERE niv_tabla LIKE '%JOB%' ORDER BY niv_codigo ASC;`, (err, rows, fields) => {
            if (!err) {
                res.status(200).json({ mensaje: true, datos: JSON.parse(JSON.stringify(rows)) });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch {
        res.status(500).json({ mensaje: false, error: e });
    }
    pool.end;

}


module.exports = reqctrl;