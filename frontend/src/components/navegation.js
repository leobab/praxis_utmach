import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import axios from 'axios'

import config from '../metodos/config_session';

import { If, Then, Else } from 'react-if';

export default class navegation extends Component {

    state = {

        conectado: false,
        tipo_usuario: '',
        usu_codigo: '',
        usu_nombre: '',
        usu_foto: '',
        usu_tipo: '',
        ruta_server_alumnos: 'LOCAL_SERVER_APP/public/usuarios/',
        usu_correo: '',
        usu_contrasena: '',
        notis: []
        // contenido_notif: '',
        // fecha_hora_notif: '',
        // imagen_usuario_noti: '',
        // usuario_envia_noti: ''

    }


    async componentDidMount() {

        const response = await axios.get('LOCAL_SERVER_APP/usuario/ver_sesion', config);


        if (response.data.mensaje) {

            const data = response.data.datos;

            this.setState({ conectado: true, usu_codigo: data.usu_codigo, usu_nombre: data.usu_nombre, usu_foto: data.usu_foto, usu_tipo: data.usu_tipo });

        } else {

            this.setState({ conectado: false });

        }

        this.consultar_noti();


    }

    ver_perfil = (e) => {

        window.location.href = "/profile/" + this.state.usu_codigo;

    }

    ver_opciones = (e) => {

        window.location.href = "/principal";

    }



    ingresar = async (e) => {

        e.preventDefault();

        const response = await axios.post('LOCAL_SERVER_APP/usuario/ingresar', {

            usu_correo: this.state.usu_correo,
            usu_contrasena: this.state.usu_contrasena

        }, config);

        if (response.data.mensaje) {

            window.location.href = "/principal";

        } else {
            var container = document.getElementById("containerErrores");
            var el = document.createElement("div");
            el.className = "alert alert-danger alert-dismissible fade show";
            el.role = "alert";
            el.innerHTML = "Correo o contraseña incorrectos. <button type='button' class='close' data-dismiss='alert' aria-label='Close'> <span aria-hidden='true'>&times;</span></button>";
            container.append(el);
        }

    }

    salir = async () => {

        const resp = await axios.get('LOCAL_SERVER_APP/usuario/salir', config);

        if (resp.data.mensaje) {

            window.location.href = "/";

        }

    }

    onInputChange = (e) => {

        this.setState({

            [e.target.name]: e.target.value

        })

    }

    consultar_noti = async () => {
        const resp = await axios.post('LOCAL_SERVER_APP/alum/consultar_noti_alumno', {
            noti_para: this.state.usu_codigo
        }, config);

        if (resp.data.mensaje) {

            this.setState({ notis: this.state.notis.concat(resp.data.datos) });
        }
        console.log("notis: "+this.state.notis);
    }

    render() {


        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary  fixed-top p-1">

                <div className="container">

                    <If condition={this.state.conectado}>
                        <Then>
                            <Link className="navbar-brand" to="/principal">Bolsa de prácticas MERCADOTECNIA</Link>
                        </Then>

                        <Else>
                            <Link className="navbar-brand" to="/">Bolsa de prácticas MERCADOTECNIA</Link>
                        </Else>
                    </If>

                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <If condition={this.state.conectado && this.state.usu_tipo === "alumno" || this.state.usu_tipo === "empresa" || this.state.usu_tipo === 'admin'}>
                        <Then>
                            <div className="collapse navbar-collapse" id="navbarNav">

                                <ul className="navbar-nav ml-auto flex-row flex justify-content-around">

                                    <If condition={this.state.usu_tipo == "alumno"}>


                                        <li className="nav-item dropdown active ">

                                            <Link className="nav-link dropdown-toggle" id="nombre_completo_usuario" to="/" data-toggle="dropdown"><i class="fa fa-bell" aria-hidden="true"></i>
                                            </Link>
                                            <div className="dropdown-menu dropdown-menu-right" style={{ width: '400px' }}>
                                                {
                                                    this.state.notis.map(notis => (
                                                        <Link className="dropdown-item" to={"/"} style={{ width: '400px' }}>
                                                            {notis.noti_descripcion}</Link>


                                                    ))
                                                }
                                            </div>


                                        </li>

                                    </If>

                                    <li className="nav-item dropdown active">
                                        <Link className="nav-link dropdown-toggle" id="nombre_completo_usuario" to="/" data-toggle="dropdown">{this.state.usu_nombre}
                                            <img src={this.state.ruta_server_alumnos + this.state.usu_codigo + "/foto/" + this.state.usu_foto} width="25" height="25" className="rounded-circle ml-2" alt="" />
                                        </Link>


                                        <If condition={this.state.usu_tipo === "alumno"}>
                                            <div className="dropdown-menu" style={{right: "0", left: "auto" }}>
                                                <button className="dropdown-item" onClick={() => this.ver_perfil()} ><i class="fa fa-user" aria-hidden="true"></i> Perfil</button>
                                                <button className="dropdown-item" onClick={() => this.ver_opciones()} ><i class="fa fa-cog" aria-hidden="true"></i> Opciones</button>
                                                <button className="dropdown-item" onClick={() => this.ver_opciones()} ><i class="fa fa-cog" aria-hidden="true"></i> Opciones</button>
                                                <button className="dropdown-item" to="" onClick={() => this.salir()}><i class="fa fa-sign-out" aria-hidden="true"></i> Salir</button>
                                            </div>
                                        </If>
                                        <If condition={this.state.usu_tipo === "empresa"}>
                                            <div className="dropdown-menu" style={{right: "0", left: "auto" }}>
                                                <button className="dropdown-item" onClick={() => this.ver_perfil()} ><i class="fa fa-building" aria-hidden="true"></i> Perfil</button>
                                                <button className="dropdown-item" onClick={() => this.ver_opciones()} ><i class="fa fa-cog" aria-hidden="true"></i> Opciones</button>
                                                <button className="dropdown-item" onClick={() => this.ver_opciones()} ><i class="fa fa-cog" aria-hidden="true"></i> Opciones</button>
                                                <button className="dropdown-item" to="" onClick={() => this.salir()}><i class="fa fa-sign-out" aria-hidden="true"></i> Salir</button>
                                            </div>
                                        </If>
                                        <If condition={this.state.usu_tipo === "admin"}>
                                            <div className="dropdown-menu" style={{right: "0", left: "auto" }}>
                                                <button className="dropdown-item" onClick={() => this.ver_opciones()} ><i class="fa fa-cog" aria-hidden="true"></i> Opciones</button>
                                                <button className="dropdown-item" onClick={() => this.ver_opciones()} ><i class="fa fa-cog" aria-hidden="true"></i> Cambiar contraseña n</button>
                                                <button className="dropdown-item" to="" onClick={() => this.salir()}><i class="fa fa-sign-out" aria-hidden="true"></i> Salir</button>
                                            </div>
                                        </If>

                                    </li>
                                </ul>
                            </div>
                        </Then>
                        <Else>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ml-auto flex-row flex justify-content-around">
                                    <li className="nav-item dropdown active">
                                        <Link class="dropdown-toggle" data-toggle="dropdown" style={{ color: "white" }}><b>Iniciar sesión</b> <span class="caret"></span></Link>
                                        <div class="dropdown-menu" style={{ minWidth: "300px", padding: "14px 14px 0", overflow: "hidden", backgroundColor: "rgba(255,255,255,.8)", right: "0", left: "auto" }}>
                                            <form class="px-4 py-3" method="post" action="login" accept-charset="UTF-8" id="login-nav" onSubmit={this.ingresar}>
                                                <div class="form-group">
                                                    <label for="exampleDropdownFormEmail1">Correo</label>
                                                    <input type="text" class="form-control" onChange={this.onInputChange} value={this.state.usu_correo} name="usu_correo" placeholder="email@example.com" required/>
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleDropdownFormPassword1">Contraseña</label>
                                                    <input type="password" class="form-control" onChange={this.onInputChange} value={this.state.usu_contrasena} name="usu_contrasena" placeholder="Password" required/>
                                                </div>
                                                {/* <div class="form-check">
                                                    <input type="checkbox" class="form-check-input" id="dropdownCheck"/>
                                                        <label class="form-check-label" for="dropdownCheck">
                                                            Recuerdame
                                                        </label>
                                                </div> */}
                                                <button type="submit" class="btn btn-primary">Ingresar</button>
                                            </form>
                                            <div class="dropdown-divider"></div>
                                            <a class="dropdown-item" href="/chooseregister">¿No tienes cuenta? Registrate</a>
                                            <a class="dropdown-item" href="#">¿Olvidaste tu contraseña?</a>
                                        </div>

                                    </li>

                                </ul>



                            </div>

                        </Else>


                    </If>

                </div>

            </nav>
        )
    }
}
