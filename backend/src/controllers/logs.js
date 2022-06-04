const client = require("../connection");
const pool = require("../connection");

const logsctrl = {};

logsctrl.logs = async (req, res) => {

    await pool.query(`SELECT * FROM logs;`, (err, rows) => {
        if (!err) {
            var json = JSON.parse(JSON.stringify(rows));
            res.status(200).json({ mensaje: true, datos: json });
        } else {
            res.status(500).json({ mensaje: err });
        }
    });
    pool.end;
    
}

module.exports = logsctrl;