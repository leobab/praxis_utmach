import React, { Component } from 'react'
import { If } from 'react-if';
import axios from 'axios'
import { Link } from 'react-router-dom'
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import config from '../metodos/config_session';

import DataTable from 'react-data-table-component';

export default class Forgetpassword extends Component {

    state = {

        usu_correo: '',

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

        const response = await axios.post('http://localhost:5000/usuario/enviar_password_temp', {
            usu_correo: this.state.usu_correo,

        }, config);


        if (response.data.mensaje) {

            toast.success('Contraseña temporal enviada!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            

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

    render() {

        return (
            <div class="container mt-3 p-5" style={{ height: '100%' }}>
                <div className="card-body">
                    <h5 className="card-title">Olvidaste tu contraseña :(</h5>
                    <p className="card-text">Proporcionanos el correo electrónico de tu cuenta.</p>
                    <form onSubmit={this.onSubmit}>
                        
                        <input type="text" class="form-control" id="usu_correo" name="usu_correo" onChange={this.onInputChange} ></input>
                        
                        <div className='form-group mt-3 mb-5'>
                            <button className="btn btn-primary" style={{ float: "right" }} type="submit">Enviar</button>
                            
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