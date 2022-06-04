
const pool = require("../connection");

const empleoalumctrl = {};

var datetime = new Date();
var descripcion = "";

empleoalumctrl.guardar = async (req, res) => {
    try {
        const { emp_codigo, job_codigo, alum_codigo } = req.body;

        console.log("DATOS :"+emp_codigo, job_codigo, alum_codigo);
        descripcion = "El alumno/a: " + alum_codigo + " postuló para el empleo: " + job_codigo;
        await pool.query(`INSERT INTO empleo_alumno (emp_codigo, job_codigo, alum_codigo, estado) VALUES(?, ?, ?, ?)`, [emp_codigo, job_codigo, alum_codigo, 'P'], async (err, rows) => {

            if(!err){
                await pool.query(`insert into logs (log_descripcion, log_fecha) values (?, ?);`, [descripcion, datetime.toISOString().slice(0, 10)], async (err, rows) => {
                    if (!err) {
                        res.status(200).json({ mensaje: true });
                    } else {
                        res.status(200).json({ mensaje: false, err: err  });
                    }
                });
            }else{
                res.status(200).json({ mensaje: false, err: err });
            }
            
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }

}

empleoalumctrl.list_postulantes = async (req, res) => {
    try {

        const job_codigo = req.params["job_codigo"];

        await pool.query(`SELECT al.*, 
                                            u.*, 
                                            empl.estado,
                                            (SELECT p.paral_nombre FROM paralelos p 
                                                WHERE al.alum_paral=p.paral_codigo) as paralelo,  
                                            (SELECT s.sem_nombre as semestre FROM semestres s
                                                WHERE al.alum_sem=s.sem_codigo) as semestre
                                        FROM alumnos al, usuarios u, empleo_alumno empl 
                                        WHERE u.usu_codigo=empl.alum_codigo 
                                        AND empl.job_codigo=?
                                        and al.alum_codigo=u.usu_codigo`, [job_codigo], async (err, rows) => {
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

empleoalumctrl.list_postulantes_ap = async (req, res) => {
    try {

        const job_codigo = req.params["job_codigo"];

        await pool.query(`select 
                                            al.*, 
                                            u.*, 
                                            empl.estado,
                                            (SELECT p.paral_nombre FROM paralelos p 
                                                WHERE al.alum_paral=p.paral_codigo) as paralelo,  
                                            (SELECT s.sem_nombre as semestre FROM semestres s
                                                WHERE al.alum_sem=s.sem_codigo) as semestre
                                        from alumnos al, usuarios u, empleo_alumno empl 
                                        where u.usu_codigo=empl.alum_codigo 
                                        and empl.job_codigo=? 
                                        and empl.estado='AP'
                                        and al.alum_codigo=u.usu_codigo`, [job_codigo], async (err, rows) => {
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


empleoalumctrl.seleccionar_alumno = async (req, res) => {
    try {
        const { job_codigo, alum_codigo } = req.body;
        descripcion = "Se seleccionó al alumno: " + alum_codigo + " para el empleo: " + job_codigo;
        await pool.query("UPDATE empleo_alumno SET estado='AP' WHERE job_codigo=? and alum_codigo=?;", [job_codigo, alum_codigo], async () => {
            await pool.query("UPDATE alumnos SET alum_estado=2 WHERE alum_codigo=?;", [alum_codigo], async () => {
                if (!err) {
                    await pool.query("insert into logs (log_descripcion, log_fecha) values (?,?);", [descripcion, datetime.toISOString().slice(0, 10)])
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

empleoalumctrl.ver_estado_empleo_alumno = async (req, res) => {
    try {
        const { job_codigo, alum_codigo } = req.body;
        console.log('AQUI ENTRA A VER ESTADO EMPLEO '+job_codigo);
        await pool.query('SELECT estado from empleo_alumno where job_codigo= ? AND alum_codigo= ?', [job_codigo, alum_codigo], async (err, rows) => {
            if (!err) {
               
                res.status(200).json({ mensaje: true, datos: rows[0] });
            } else {

                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
    pool.end();
}

empleoalumctrl.listar_empleos_alumno = async (req, res) => {
    try {

        const { alum_codigo } = req.body;

        await pool.query(`SELECT emp.*
                                        FROM alumnos al, empleo_alumno empl, empleos emp
                                        WHERE empl.job_codigo=emp.job_codigo 
                                        AND empl.alum_codigo=?
                                        and al.alum_codigo=empl.alum_codigo
                                        and emp.job_estado='DISPONIBLE'`, [alum_codigo], async (err, rows) => {
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


module.exports = empleoalumctrl;
