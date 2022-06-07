import React, { Component } from 'react'

import axios from 'axios'


import Swal from 'sweetalert2'
import config from '../metodos/config_session';


export default class Changepassword extends Component {
    state = {

        antigua_pass: '',
        nueva_pass: ''
    }

    howItWorks = async (e) => {
        e.preventDefault();


    }

    onInputChange = (e) => {

        this.setState({

            [e.target.name]: e.target.value

        })

    }

    onSubmit = async (e) => {

        e.preventDefault();


        const response = await axios.post('http://localhost:5000/usuario/change_password', {
            antigua_pass: this.state.antigua_pass,
            nueva_pass: this.state.nueva_pass,
        }, config);


        if (response.data.mensaje) {

            Swal.fire(
                'Actualizada!',
                'Contraseña actualizada con éxito',
                'success'
              );

             
                this.salir();
            


        } else {
            Swal.fire(
                'Error!',
                'Error actualizar contraseña',
                'error'
              );
        }


    }

    salir = async () => {

        const resp = await axios.get('http://localhost:5000/usuario/salir', config);

        if (resp.data.mensaje) {

            window.location.href = "/";

        }

    }

    verPass(el) {
        var x = document.getElementById(el);
        if (x.type === "password") {
            x.type = "text";
        } else {
            x.type = "password";
        }
    }

    render() {

        return (
            <div class="container mt-5 p-5" style={{ height: '100%' }}>
                <div className="card-body">
                    <h5 className="card-title text-center">Actualizar contraseña</h5>
                    <form onSubmit={this.onSubmit}>
                        <h6 class="mt-2 mb-3 text-left">Antigua contraseña</h6>

                        <div class="input-group mb-3">
                            <input type="password" class="form-control" id="antigua_pass" name="antigua_pass" onChange={this.onInputChange} ></input>
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button"><i class="fa fa-eye" aria-hidden="true" onClick={() => this.verPass("antigua_pass")}></i></button>
                            </div>

                        </div>
                        <h6 class="mt-3 mb-3 text-left">Nueva contraseña</h6>
                       
                        <div class="input-group mb-3">
                            <input type="password" class="form-control" id="nueva_pass" name="nueva_pass" onChange={this.onInputChange} ></input>
                            <div class="input-group-prepend">
                                <button class="btn btn-outline-secondary" type="button"><i class="fa fa-eye" aria-hidden="true" onClick={() => this.verPass("nueva_pass")}></i></button>
                            </div>

                        </div>
                        <div className='form-group mt-3 mb-5'>
                            <button className="btn btn-success" style={{ float: "right" }} type="submit">Actualizar</button>
                            <a href="/principal"><button type="button" class="btn btn-danger mr-3" style={{ float: 'right' }}>Cancelar</button></a>
                        </div>

                    </form>
                </div>
                

            </div>
        )
    }
}