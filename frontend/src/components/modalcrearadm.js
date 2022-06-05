import React, { Component } from 'react'
import $ from 'jquery';

import axios from 'axios'

import config from '../metodos/config_session';

export default class Modalcreateadm extends Component {
    state = {
        usu_cedula_ruc: "",
        usu_nombre: "",
        usu_telefono: "",
        usu_correo: "",
        usu_contrasena: "",
    }

    async componentDidMount() {

        const responseC = await axios.get('http://localhost:5000/usuario/ver_sesion', config);
        if (responseC.data.mensaje) {
            const data = responseC.data.datos;
            this.setState({ usu_codigo: data.usu_codigo });

        }
    }

    howItWorks = async (e) => {
        e.preventDefault();

        const response = await axios.post('http://localhost:5000/usuario/crear_admin', {
            usu_cedula_ruc: this.state.usu_cedula_ruc,
            usu_nombre: this.state.usu_nombre,
            usu_telefono: this.state.usu_telefono,
            usu_correo: this.state.usu_correo,
            usu_contrasena: this.state.usu_contrasena,
        }, config);


        //limpia el modal
        $(".modalskills").on("hidden.bs.modal", function () {
            $(".modal-body input").val("");
        });

        //cierra el modal
        $('#modalskills').modal('hide')
    }

    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })

    }



    render() {
        return (
            <div class="modal fade" id="modalcrearadm" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <b><label for="recipient-name" class="col-form-label">Nombre de administrador:</label></b>
                                    <input type="text" class="form-control" id="usu_nombre" name="usu_nombre" value={this.state.usu_nombre} onChange={this.onInputChange} />
                                </div>
                                <div class="form-group">
                                    <b><label for="recipient-name" class="col-form-label">Cedula de administrador:</label></b>
                                    <input type="text" class="form-control" id="usu_cedula_ruc" name="usu_cedula_ruc" value={this.state.usu_cedula_ruc} onChange={this.onInputChange} />
                                </div>
                                <div class="form-group">
                                    <b><label for="recipient-name" class="col-form-label">Teléfono: </label></b>
                                    <input type="text" class="form-control" id="usu_telefono" name="usu_telefono" value={this.state.usu_telefono} onChange={this.onInputChange} />
                                </div>
                                <div class="form-group">
                                    <b><label for="recipient-name" class="col-form-label">Correo: </label></b>
                                    <input type="text" class="form-control" id="usu_correo" name="usu_correo" value={this.state.usu_correo} onChange={this.onInputChange} />
                                </div>
                                <div class="form-group">
                                    <b><label for="recipient-name" class="col-form-label">Contraseña: </label></b>
                                    <input type="text" class="form-control" id="usu_contrasena" name="usu_contrasena" value={this.state.usu_contrasena} onChange={this.onInputChange} />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button id="saveIdiom" type="button" class="btn btn-primary" onClick={this.howItWorks} >Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}