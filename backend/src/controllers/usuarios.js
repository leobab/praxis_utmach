const pool = require("../connection");
const shortuuid = require("short-uuid");
const path = require("path");
const fs = require('fs-extra');
const mail = require("../libs/mail");
const e = require("express");
const { Console } = require("console");

const usuarioctrl = {};

var datetime = new Date();
var descripcion = "";

//método registrar usuario tipo alumno o empresa
usuarioctrl.registrarse = async (req, res) => {

    const usu_codigo = "usu-" + shortuuid().generate();
    const usu_foto = (req.file.filename);
    const { usu_cedula_ruc, usu_nombre, usu_direccion, usu_telefono, usu_tipo, usu_correo, usu_contrasena, alum_fecha_nac, alum_genero, emp_descripcion, emp_categoria, emp_fecha_creacion, emp_convenio } = req.body
    try {
        await pool.query(`insert into usuarios (usu_codigo, usu_cedula_ruc, usu_nombre, usu_direccion, usu_telefono, usu_foto, usu_tipo, usu_correo, usu_contrasena) values (?,?,?,?,?,?,?,?,?)`, [usu_codigo, usu_cedula_ruc, usu_nombre, usu_direccion, usu_telefono, usu_foto, usu_tipo, usu_correo, usu_contrasena], async (err, rows, fields) => {
            if (!err) {
                const directorio = path.resolve('public/usuarios/' + usu_codigo);
                const foto = path.resolve('public/usuarios/' + usu_codigo + '/foto');
                const cv = path.resolve('public/usuarios/' + usu_codigo + '/cv');
                if (!fs.existsSync(directorio)) {
                    await fs.mkdir(directorio);
                    await fs.mkdir(foto);
                    await fs.mkdir(cv);
                }
                await fs.rename(req.file.path, ('public/usuarios/' + usu_codigo + '/foto/' + usu_foto));

                if (usu_tipo == "alumno") {
                    var descripcion = "Se registró exitosamente el alumno/a: " + usu_nombre;
                    await pool.query(`insert into alumnos (alum_codigo, alum_fecha_nac, alum_genero, alum_estado) values (?,?,?,?)`, [usu_codigo, alum_fecha_nac, alum_genero, 1]);
                    await pool.query(`insert into logs (log_descripcion, log_fecha) values(?,?)`, [descripcion, datetime.toISOString().slice(0, 10)]);

                } else if (usu_tipo == "empresa") {
                    var descripcion = "Se registró exitosamente la empresa: " + usu_nombre;
                    await pool.query(`insert into empresa (emp_codigo, emp_descripcion, emp_categoria, emp_fecha_creacion, emp_convenio, emp_estado) values (?,?,?,?,?,?)`, [usu_codigo, emp_descripcion, emp_categoria, emp_fecha_creacion, emp_convenio, 'NO VALIDADO']);
                    await pool.query(`insert into logs (log_descripcion, log_fecha) values(?,?)`, [descripcion, datetime.toISOString().slice(0, 10)]);
                }
                req.session.usu_codigo = usu_codigo;
                console.log(req.session.usu_codigo);
                res.status(200).json({ mensaje: true });
            } else {
                res.status(200).json({ mensaje: false });
            }
        })

    } catch (e) {
        console.log(e);
        res.status(500).json({ mensaje: err.message });
    }


}
/* 

    
    try {
        const { usu_cedula_ruc, usu_nombre, usu_direccion, usu_telefono, usu_tipo, usu_correo, usu_contrasena, alum_fecha_nac, alum_genero, emp_descripcion, emp_categoria, emp_fecha_creacion, emp_convenio } = req.body
        pool.query(`insert into usuarios (usu_codigo, usu_cedula_ruc, usu_nombre, usu_direccion, usu_telefono, usu_foto, usu_tipo, usu_correo, usu_contrasena) values (?,?,?,?,?,?,?,?,?)`, [usu_codigo, usu_cedula_ruc, usu_nombre, usu_direccion, usu_telefono, usu_foto, usu_tipo, usu_correo, usu_contrasena], (err, rows, fields) => {
            if (!err) {
                const directorio = path.resolve('src/public/usuarios/' + usu_codigo);
                const foto = path.resolve('src/public/usuarios/' + usu_codigo + '/foto');
                const cv = path.resolve('src/public/usuarios/' + usu_codigo + '/cv');
                if (!fs.existsSync(directorio)) {
                    fs.mkdir(directorio);
                    fs.mkdir(foto);
                    fs.mkdir(cv);
                }

                console.log(`ESTE ES EL CODIGO `+usu_codigo);
                fs.rename(req.file.path, ('src/public/usuarios/' + usu_codigo + '/foto/' + usu_foto));

                if (usu_tipo == "alumno") {
                    var descripcion = "Se registró exitosamente el alumno/a: " + usu_nombre;
                    await pool.query(`insert into alumnos (alum_codigo, alum_fecha_nac, alum_genero, alum_estado) values (?,?,?,?)`,[usu_codigo,alum_fecha_nac, alum_genero,1]);
                    await pool.query(`insert into logs (log_descripcion, log_fecha) values(?,?)`,[descripcion,datetime.toISOString().slice(0, 10)]);
    
                } else if (usu_tipo == "empresa") {
                    var descripcion = "Se registró exitosamente la empresa: " + usu_nombre;
                    await pool.query(`insert into empresa (emp_codigo, emp_descripcion, emp_categoria, emp_fecha_creacion, emp_convenio, emp_estado) values (?,?,?,?,?,?)`,[usu_codig,emp_descripcion,emp_categoria,emp_fecha_creacion,emp_convenio,'NO VALIDADO']);
                    await pool.query(`insert into logs (log_descripcion, log_fecha) values(?,?)`,[descripcion,datetime.toISOString().slice(0, 10)]);
                }
                res.status(200).json({ mensaje: true });
            } else {
                res.status(200).json({ mensaje: false });
            }
        })
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
    req.session.usu_codigo = usu_codigo;
} */

//método ver datos del usuario mediante su sesión
usuarioctrl.ver_sesion = async (req, res) => {
    try {

        console.log("CODIGO LLEGA AL VER SESION: " + req.session.usu_codigo);

        if (req.session.usu_codigo != null) {
            const usu_codigo = req.session.usu_codigo;
            await pool.query(`SELECT usu_codigo, usu_cedula_ruc, usu_nombre, usu_correo, usu_direccion, usu_telefono, usu_foto, usu_tipo FROM usuarios WHERE usu_codigo = ? `, [usu_codigo], (err, rows, fields) => {
                if (!err) {
                    var json = JSON.parse(JSON.stringify(rows));
                    res.status(200).json({ mensaje: true, datos: json[0] });
                } else {
                    res.status(200).json({ mensaje: false });
                }
            });
        } else {
            res.status(200).json({ mensaje: false, error: "Usuario no logueado" });
        }
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }

}

//método generar código de verificación
function codigo_verificacion() {

    const codigo = Math.abs(Math.round(Math.random() * (1000 - 9999) + 1000));

    if (codigo.toString().length < 4) {

        return codigo_verificacion();
    }

    return codigo;

}


//método enviar código de verificación al correo del usuario
usuarioctrl.enviar_codverificacion = async (req, res) => {

    try {
        if (req.session.usu_codigo != null) {
            const codigo = codigo_verificacion();
            console.log("este es el codv: " + codigo);
            const usu_codigo = req.session.usu_codigo;
            const { usu_correo } = req.body;
            const contentHTML = `<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <meta name="x-apple-disable-message-reformatting">
      <title></title>
      <!--[if mso]>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
      <![endif]-->
      <style>
        table, td, div, h1, p {font-family: Arial, sans-serif;}
      </style>
    </head>
    <body style="margin:0;padding:0;">
      <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
        <tr>
          <td align="center" style="padding:0;">
            <table role="presentation" style="width:602px;border-collapse:collapse;border:1px solid #2d7dd8;border-spacing:0;text-align:left;">
              <tr>
                <td align="center" style="padding:40px 0 30px 0;background:#ffffff;">
                  <img src="https://i.ibb.co/94qPVN2/mailutmach.png" alt="" width="500" style="height:auto;display:block;" />
                </td>
              </tr>
              <tr>
                <td style="padding:36px 30px 42px 30px;">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                    <tr>
                      <td style="padding:0 0 36px 0;color:#153643;">
                        <h1 align="center" style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">ESTE ES TU CODIGO DE VERIFICACIÓN</h1>
                        <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">Este es tu codigo de verificación para tu cuenta en la bolsa de prácticas para la carrera de Mercadotecnia de la Universidad Técnica de Machala, copialo y pegalo en la pagina de verificación</p>
                        <h1 align="center" style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;"> `+codigo+`  </h1>  
                        <p style="margin:0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;"><a href="https://bolsapracticasmercadotecnia.com/validateaccount" style="color:#ee4c50;text-decoration:underline;">Ir a la web</a></p>
    
                    </td>
                    </tr>
              <tr>
                <td style="padding:30px;background:#ee4c50;">
                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                    <tr>
                      <td style="padding:0;width:50%;" align="left">
                        <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#ffffff;">
                          &reg; BOLSA DE PRÁCTICAS MERCADOTECNIA, UTMACH 2022<br/><a href="https://bolsapracticasmercadotecnia.com" style="color:#ffffff;text-decoration:underline;">BOLSA DE PRÁCTICAS</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>`;
            await mail.sendMail({
                from: 'administracion@bolsapracticasmercadotecnia.com',
                to: usu_correo,
                subject: 'Validación de cuenta en Bolsa de Empleo UTMACH',
                html: contentHTML
                //text: 'Este es tu código de verificación: ' + codigo,
            }, async (err, info) => {
                if (err) {
                    res.status(500).json({ mensaje: false, error: err });
                } else {
                    await pool.query("UPDATE usuarios SET codigo_verificacion = ? WHERE usu_codigo = ?", [codigo, usu_codigo]);
                    res.status(200).json({ mensaje: true, datos: info.messageId });
                }
            });
        } else {
            res.status(200).json({ mensaje: false, error: "Usuario no logueado" });
        }
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }
}

//método validar cuenta del usuario
usuarioctrl.validar_cuenta = async (req, res) => {
    try {
        if (req.session.usu_codigo != null) {
            const { codigo_verificacion } = req.body;
            const usu_codigo = req.session.usu_codigo;
            const perfil = await pool.query(`SELECT codigo_verificacion FROM usuarios WHERE usu_codigo = '` + usu_codigo + `';`);
            const json = (JSON.stringify(perfil[0]));
            const dataObj = JSON.parse(json);

            if (dataObj['codigo_verificacion'] == codigo_verificacion) {
                await pool.query("UPDATE usuarios SET codigo_verificacion = ? WHERE usu_codigo = ?", ['', usu_codigo]);
                res.status(200).json({ mensaje: true });
            } else {
                res.status(500).json({ mensaje: false, error: "Código incorrecto" });
            }
        } else {
            res.status(200).json({ mensaje: false, error: "Usuario no logueado" });
        }
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }


}

//método iniciar sesión del usuario
/* usuarioctrl.ingresar = async (req, res) => {

    try {
        const { usu_correo, usu_contrasena } = req.body;
        const usu_codigo = await pool.query(`SELECT usu_codigo FROM usuarios where usu_correo = ? and usu_contrasena = ?`, [usu_correo, usu_contrasena]);
        descripcion="Se inició sesión con el correo: "+usu_correo;
        await pool.query(`insert into logs (log_descripcion, log_fecha) values (?, ?);` , [descripcion, datetime.toISOString().slice(0,10)]);

        const resultados = Object.values(JSON.parse(JSON.stringify(usu_codigo)));
        console.log(resultados.length);

        if (resultados.length > 0) {
            req.session.usu_codigo = ['usu_codigo'];
            res.status(200).json({ mensaje: true });?

        } else {

            res.status(200).json({ mensaje: false });

        }

    } catch (e) {
        console.log(e);
        res.status(500).json({ mensaje: false, error: e });

    } 
    

}*/


usuarioctrl.ingresar = async (req, res) => {
    try {
        const { usu_correo, usu_contrasena } = req.body;


        await pool.query('SELECT usu_codigo FROM usuarios WHERE usu_correo = ? and usu_contrasena= ?', [usu_correo, usu_contrasena], async (err, rows, fields) => {
            if (!err) {
                var json = JSON.parse(JSON.stringify(rows));

                console.log(json);
                req.session.usu_codigo = json[0]['usu_codigo'];
                req.session.usu_nombre = json[0]['usu_nombre'];
                console.log("CODIGO SESION: " + req.session.usu_codigo);  //////////////////ESTE ES EL INGRESAR BUENO
                res.status(200).json({ mensaje: true });
            } else {
                res.status(200).json({ mensaje: false });
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({ mensaje: false, error: e });
    }
}

//método cerrar sesión del usuario
usuarioctrl.salir = (req, res) => {
    try {
        if (req.session.usu_codigo != null) {
            req.session.destroy();
            res.status(200).json({ mensaje: true });
        } else {
            res.status(200).json({ mensaje: false, error: "Usuario no logueado" });
        }
    } catch (e) {
        res.status(200).json({ mensaje: false, error: e });
    }
}


usuarioctrl.ver_usuario = async (req, res) => {

    try {
        const { usu_codigo } = req.body;
        await pool.query("SELECT * FROM usuarios WHERE usu_codigo=?;", [usu_codigo], async (err, rows) => {
            if (!err) {
                var json = (JSON.parse(JSON.stringify(rows[0])));
                console.log(json);
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(200).json({ mensaje: false, error: "Usuario no logueado" });
            }
        });
    } catch (e) {
        res.status(500).json({ mensaje: false, error: e });
    }

}

usuarioctrl.listar_admin = async (req, res) => {

    try {
        await pool.query(`select usu_codigo, usu_correo, usu_nombre, usu_cedula_ruc ,usu_telefono from usuarios where usu_tipo= 'admin'`, (err, rows) => {
            if (!err) {
                var json = JSON.parse(JSON.stringify(rows))
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(500).json({ mensaje: err });
            }

            pool.end;
        });
    } catch (e) {
        res.status(500).json({ mensaje: err })
    }

}

usuarioctrl.crear_admin = async (req, res) => {
//usu_codigo_admin
    try {
        const usu_codigo_admin = "adm-"+ shortuuid().generate();
        const { usu_cedula_ruc, usu_nombre, usu_telefono, usu_correo, usu_contrasena } = req.body
        await pool.query(` insert into usuarios (usu_codigo, usu_cedula_ruc, usu_nombre, usu_telefono, usu_foto, usu_tipo, usu_correo, usu_contrasena) values (?,?,?,?,?,?,?,?)  `,[usu_codigo_admin, usu_cedula_ruc, usu_nombre, usu_telefono, 'admin.jpg', 'admin', usu_correo, usu_contrasena], async (err, rows) => {
            if (!err) {
                descripcion = "El administrador: " +req.session.usu_nombre+ " ha creado la cuenta de administrador de "+ usu_nombre;
                await pool.query("insert into logs (log_descripcion, log_fecha) values (?, ?);", [descripcion, datetime.toISOString().slice(0, 10)]);
                var json = JSON.parse(JSON.stringify(rows))
                res.status(200).json({ mensaje: true, datos: json });
            } else {
                res.status(500).json({ mensaje: err });
            }
            pool.end;
        });
    } catch (e) {
        res.status(500).json({ mensaje: err })
    }
}

/* usuarioctrl.cambiarcontrasena = async (req, res) => {
    pool.query(`select usu_codigo, usu_correo, usu_nombre, usu_cedula_ruc ,usu_telefono from usuarios where usu_tipo= 'admin'`, (err, result) => {
        if (!err) {
            res.status(200).json({ mensaje: true, datos: result.rows });
        } else {
            res.status(500).json({ mensaje: err });
        }

        pool.end;
    });
} */

usuarioctrl.eliminar_admin = async (req, res) => {

    try {
        const { usu_codigo } = req.body;
        descripcion = "Se eliminó el administrador: " + usu_nombre;
        await pool.query("insert into logs (log_descripcion, log_fecha) values (?, ?);", [descripcion, datetime.toISOString().slice(0, 10)]);
        const usuarios = await pool.query("DELETE FROM usuarios WHERE usu_codigo=?;", [usu_codigo]);
        if (usuarios.rowCount > 0) {
            res.status(200).json({ mensaje: true });
        } else {
            res.status(200).json({ mensaje: false });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ mensaje: false, error: e });
    }
}



module.exports = usuarioctrl;