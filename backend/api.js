const express = require('express');
const session = require('express-session');
const path = require('path');
const http = require('http');
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
const io = http.createServer(app);
require("dotenv").config();

io.listen(5000, '0.0.0.0', ()=>{
    console.log("El servidor ahora está escuchando en el puerto 5000");
})

const oneDay = 1000 * 60 * 60 * 24;

app.use(
    session({
      secret: 'thisismysecrctekeyfhrgfgrfrty84fwir767',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: oneDay }
    })
);

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cors({origin:['LOCAL_SERVER_APP','http://localhost:3000'],methods:['GET','POST','PUT','DELETE'],credentials:true}))
app.use('/public',express.static(path.resolve(__dirname,"public")));

require('./src/routes/rutas')(app);



module.exports = app;