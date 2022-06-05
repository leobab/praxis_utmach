import React, { Component } from 'react'
import { If } from 'react-if';
import axios from 'axios'
import { Link } from 'react-router-dom'
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import config from '../metodos/config_session';

import DataTable from 'react-data-table-component';

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
            nueva_pass:this.state.nueva_pass,
        }, config);


        if (response.data.mensaje) {

            toast.success('Contraseña actualizada con éxito!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });

            
                this.salir();
            
            

        }else{
            toast.error(response.data.datos, {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
        }


    }

    salir = async () => {

        const resp = await axios.get('http://localhost:5000/usuario/salir', config);

        if (resp.data.mensaje) {

            window.location.href = "/";

        }

    }

    render() {

        return (
            <div class="container mt-3 p-5" style={{ height: '100%' }}>
                <div className="card-body">
                    <h5 className="card-title text-center">Actualizar contraseña</h5>
                    <form onSubmit={this.onSubmit}>
                        <h6 class="mt-2 mb-3 text-left">Antigua contraseña</h6>
                        <input type="password" class="form-control" id="antigua_pass" name="antigua_pass" onChange={this.onInputChange} ></input>
                        <h6 class="mt-3 mb-3 text-left">Nueva contraseña</h6>
                        <input type="password" class="form-control" id="nueva_pass" name="nueva_pass" onChange={this.onInputChange} ></input>
                        <div className='form-group mt-3 mb-5'>
                            <button className="btn btn-success" style={{ float: "right" }} type="submit">Actualizar</button>
                            <a href="/principal"><button type="button" class="btn btn-danger mr-3" style={{ float: 'right' }}>Cancelar</button></a>
                        </div>

                    </form>
                </div>
                <ToastContainer position="top-right"
                            autoClose={1000}
                            hideProgressBar
                            newestOnTop={false}
                            closeOnClick={false}
                            rtl={false}
                            pauseOnFocusLoss={false}
                            draggable={false}
                            pauseOnHover={false}
                            />

            </div>
        )
    }
}