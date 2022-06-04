const pool = require("../connection");
const fs = require('fs-extra');
const { json } = require("body-parser");
const alumctrl = {};


var datetime = new Date();
var descripcion = "";

//método completar registro de un alumno
alumctrl.completar_registro = async (req, res) => {
    try {
        if (req.session.usu_codigo != null) {
            const alum_codigo = req.session.usu_codigo;
            const alum_cv = (req.file.filename);
            const { alum_descripcion, alum_d_pasantia, alum_sem, alum_paral, alum_disponibilidad, fecha_practica } = req.body;

            console.log("DESCRIPCION DEL ALUMNO: "+alum_disponibilidad);
            
            descripcion = "Se completó el registro del alumno/a: " + alum_codigo;
            await pool.query("UPDATE alumnos SET alum_descripcion=?, alum_d_pasantia=?, alum_cv=?, alum_sem=?, alum_paral=?, alum_disponibilidad=?, fecha_practica=? WHERE alum_codigo=?;", [alum_descripcion, alum_d_pasantia, alum_cv, alum_sem, alum_paral, alum_disponibilidad, fecha_practica, alum_codigo], async (err, rows) => {
                
                if(!err){
                    await fs.rename(req.file.path, ('public/usuarios/' + alum_codigo + '/cv/' + alum_cv));
                    await pool.query(`insert into logs (log_descripcion, log_fecha) values (?, ?);`, [descripcion, datetime.toISOString().slice(0, 10)]);
                    res.status(200).json({ mensaje: true });
                }else{

                    console.log(err);
                    res.status(500).json({ mensaje: false, error: err });
                }
                
            });
            
        } else {
            res.status(500).json({ mensaje: false, error: "Usuario no logueado" });
        }
    } catch (e) {
        await fs.unlink(req.file.path);
        res.status(500).json({ mensaje: false, error: e });
    }
}

//método listar alumnos
alumctrl.listar_alumnos = async (req, res) => {
    await pool.query('select u.usu_codigo, u.usu_nombre, u.usu_correo, u.usu_direccion, u.usu_telefono, al.alum_fecha_nac, u.usu_foto, al.alum_descripcion, al.fecha_practica  from usuarios as u inner join alumnos as al on u.usu_codigo=al.alum_codigo;', (err, result) => {
        const resultados = Object.values(JSON.parse(JSON.stringify(result)));
        //resultados.forEach((v) => console.log(v));
        if (!err) {
            res.status(200).json({ mensaje: true, datos: resultados });
        } else {
            res.status(500).json({ mensaje: err });
        }
    });
    pool.end;



}

//método listar alumnos disponibles
alumctrl.listar_alumnos_disponibles = async (req, res) => {
    await pool.query('select u.usu_codigo, u.usu_nombre, u.usu_correo, u.usu_direccion, u.usu_telefono, al.alum_fecha_nac, u.usu_foto, al.alum_descripcion, al.alum_d_pasantia, al.alum_cv, al.fecha_practica  from usuarios as u inner join alumnos as al on u.usu_codigo=al.alum_codigo and al.alum_estado=1;', (err, result) => {
        if (!err) {
            res.status(200).json({ mensaje: true, datos: result.rows });
        } else {
            res.status(500).json({ mensaje: err });
        }
    });
    pool.end;
}


alumctrl.guardar_experiencia = async (req, res) => {

    try {
        const { alum_codigo, exp_cargo, exp_empresa_nombre, exp_actividades, exp_fecha_ini, exp_fecha_fin } = req.body

        await pool.query(`insert into alum_experiencia (alum_codigo, exp_cargo, exp_empresa_nombre, exp_actividades, exp_fecha_ini, exp_fecha_fin) values (?,?,?,?,?,?);`, [alum_codigo, exp_cargo, exp_empresa_nombre, exp_actividades, exp_fecha_ini, exp_fecha_fin], async () => {
            await pool.query(`SELECT exp_codigo FROM alum_experiencia WHERE exp_cargo= ? AND exp_empresa_nombre= ? AND exp_actividades= ?;`, [exp_cargo, exp_empresa_nombre, exp_actividades], async (err, rows) => {
                if (!err) {
                    var json = JSON.parse(JSON.stringify(rows));
                    res.status(200).json({ mensaje: true, datos: json });

                } else {
                    res.status(500).json({ mensaje: err.message });
                }
            });
        });
    } catch (e) {
        console.log(e);
    }
}
alumctrl.eliminar_experiencia = async (req, res) => {

    const { exp_codigo } = req.body
    try {
        await pool.query(`DELETE FROM alum_experiencia WHERE exp_codigo= ?`, [exp_codigo], async (err) => {
            if (!err) {
                res.status(200).json({ mensaje: true });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: err.message });
    }

}

alumctrl.guardar_estudios = async (req, res) => {
    try {
        const { alum_codigo, est_centro_edu, est_nivel, est_fecha_ini, est_fecha_fin, est_titulo } = req.body

        await pool.query(`insert into alum_estudios (alum_codigo, est_centro_edu, est_nivel, est_fecha_ini, est_fecha_fin, est_titulo ) values (?,?,?,?,?,?);`, [alum_codigo, est_centro_edu, est_nivel, est_fecha_ini, est_fecha_fin, est_titulo], async () => {
            await pool.query(`SELECT est_codigo FROM alum_estudios WHERE est_centro_edu=? AND est_titulo=? AND est_fecha_ini=? AND est_fecha_fin=?`, [est_centro_edu, est_titulo, est_fecha_ini, est_fecha_fin], async (err, rows) => {
                if (!err) {
                    var json = JSON.parse(JSON.stringify(rows));
                    res.status(200).json({ mensaje: true, datos: json });
                } else {
                    res.status(500).json({ mensaje: err.message });
                }
            });
        });
    } catch (e) {
        res.status(500).json({ mensaje: err.message });
        console.log(e);
    }
}

alumctrl.eliminar_estudios = async (req, res) => {

    const { est_codigo } = req.body
    try {
        await pool.query(`DELETE FROM alum_estudios WHERE est_codigo= ?`, [est_codigo], async (err) => {
            if (!err) {
                res.status(200).json({ mensaje: true });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: err });
    }
}

alumctrl.guardar_idiomas = async (req, res) => {
    try {
        const { alum_codigo, idio_nombre, idio_nivel } = req.body

        console.log(alum_codigo, idio_nivel, idio_nombre);
        await pool.query(`insert into alum_idiomas (alum_codigo, idio_nombre, idio_nivel ) values (?,?,?);`, [alum_codigo, idio_nombre, idio_nivel], async (err) => {
            await pool.query(`select idio_codigo from alum_idiomas where alum_codigo= ? AND idio_nombre= ? AND idio_nivel = ? ;`, [alum_codigo, idio_nombre, idio_nivel], async (err, rows) => {
                if (!err) {
                    var json = JSON.parse(JSON.stringify(rows[0]));
                    res.status(200).json({ mensaje: true, datos: json });
                } else {
                    res.status(500).json({ mensaje: err.message });
                }
            });
        });
    } catch (e) {
        res.status(500).json({ mensaje: err.message });
        console.log(e);
    }
}


alumctrl.eliminar_idiomas = async (req, res) => {
    const { idio_codigo } = req.body
    try {
        await pool.query(`DELETE FROM alum_idiomas WHERE idio_codigo= ?`, [idio_codigo], async (err) => {
            if (!err) {
                res.status(200).json({ mensaje: true });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: err });
    }
}


alumctrl.guardar_skills = async (req, res) => {

    try {
        const { alum_codigo, ski_nombre, ski_nivel } = req.body

        await pool.query(`insert into alum_skills (alum_codigo, ski_nombre, ski_nivel ) values (?,?,?);`, [alum_codigo, ski_nombre, ski_nivel], async () => {
            await pool.query(`SELECT ski_codigo FROM alum_skills WHERE alum_codigo= ? AND ski_nombre= ? AND ski_nivel= ?;`, [alum_codigo, ski_nombre, ski_nivel], async (err, rows) => {
                if (!err) {
                    
                    var json = JSON.parse(JSON.stringify(rows));
                    console.clear();
                    console.log(json);
                    res.status(200).json({ mensaje: true, datos: json });
                } else {
                    res.status(500).json({ mensaje: err.message });
                }
            });
        });
    } catch (e) {
        res.status(500).json({ mensaje: err.message });
        console.log(e);
    }
}


alumctrl.eliminar_skills = async (req, res) => {


    const { ski_codigo } = req.body
    try {
        await pool.query(`DELETE FROM alum_skills WHERE ski_codigo= ?`, [ski_codigo], async (err) => {
            if (!err) {
                res.status(200).json({ mensaje: true });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: err });
    }
}


alumctrl.profile = async (req, res) => {
    const { alum_codigo } = req.body
    try {
        await pool.query(`SELECT * FROM alumnos WHERE alum_codigo= ?`, [alum_codigo], async (err, rows) => {
            if (!err) {
                var json = JSON.parse(JSON.stringify(rows));
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: err });
    }
}

alumctrl.experiencia = async (req, res) => {
    const { alum_codigo } = req.body
    try {
        await pool.query(`SELECT * FROM alum_experiencia WHERE alum_codigo= ?`, [alum_codigo], async (err, rows) => {
            if (!err) {
                var json = JSON.parse(JSON.stringify(rows));
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: err });
    }
}


alumctrl.estudios = async (req, res) => {
    const { alum_codigo } = req.body
    try {
        await pool.query(`SELECT * FROM alum_estudios WHERE alum_codigo= ?`, [alum_codigo], async (err, rows) => {
            if (!err) {
                var json = JSON.parse(JSON.stringify(rows));
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: err });
    }
}

alumctrl.skills = async (req, res) => {
    const { alum_codigo } = req.body
    try {
        await pool.query(`SELECT s.ski_nombre, n.niv_nombre FROM skills as s, niveles as n, alum_skills as a 
        WHERE alum_codigo= ? AND a.ski_nombre=s.ski_codigo AND a.ski_nivel=n.niv_codigo`, [alum_codigo], async (err, rows) => {
            if (!err) {
                var json = JSON.parse(JSON.stringify(rows));
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: err });
    }
}

alumctrl.idiomas = async (req, res) => {
    const { alum_codigo } = req.body

    try {
        await pool.query(`SELECT i.idi_nombre, n.niv_nombre FROM idiomas as i, niveles as n, alum_idiomas as a 
        WHERE alum_codigo= ? AND a.idio_nombre=i.idi_codigo AND a.idio_nivel=n.niv_codigo`, [alum_codigo], async (err, rows) => {
            if (!err) {
                var json = JSON.parse(JSON.stringify(rows));
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: err });
    }
}


//método eliminar alumno
alumctrl.eliminar_alumno = async (req, res) => {

    try {

        const { alum_codigo } = req.body;
        descripcion = "Se eliminó al alumno/a: " + alum_codigo + " del sistema";
        await pool.query("DELETE FROM alumnos WHERE alum_codigo=?;", [alum_codigo], async (err, rows, fields) => {
            await pool.query("DELETE FROM alum_estudios WHERE alum_codigo=?;", [alum_codigo], async (err, rows, fields) => {
                await pool.query("DELETE FROM alum_experiencia WHERE alum_codigo=?;", [alum_codigo], async (err, rows, fields) => {
                    await pool.query("DELETE FROM alum_idiomas WHERE alum_codigo=?;", [alum_codigo], async (err, rows, fields) => {
                        await pool.query("DELETE FROM alum_skills WHERE alum_codigo=?;", [alum_codigo], async (err, rows, fields) => {
                            await pool.query("DELETE FROM empleo_alumno WHERE alum_codigo=?;", [alum_codigo], async (err, rows, fields) => {
                                await pool.query("DELETE FROM usuarios WHERE usu_codigo=?;", [alum_codigo], async (err, rows, fields) => {
                                    if (!err) {
                                        await pool.query("insert into logs (log_descripcion, log_fecha) values (?, ?);", [descripcion, datetime.toISOString().slice(0, 10)]);
                                        res.status(200).json({ mensaje: true });
                                    } else {
                                        res.status(200).json({ mensaje: false });
                                    }
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
}

/* alumctrl.consultar_noti_alumno=async(req, res)=>{
    try {

        const { noti_para} = req.body;

        console.log("ID PARA NOTI: "+noti_para);

        const noti = await pool.query("select * from notificaciones where noti_para=$1", [noti_para]);

        if (noti.rowCount > 0 ) {

            res.status(200).json({ mensaje: true, datos: noti.rows });


        } else {

            res.status(200).json({ mensaje: false });

        }

    } catch (e) {

        res.status(500).json({ mensaje: false, error: e });

    }
} */

module.exports = alumctrl;