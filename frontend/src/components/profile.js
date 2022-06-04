import React, { Component } from 'react'
import axios from 'axios'
import { If } from 'react-if'
import config from '../metodos/config_session';
import Modalchoosejob from './modalchoosejob';
import $ from 'jquery';
import Profilealum from './profilealum';
import ProfileEmp from './perfilempresa';



export default class perfil extends Component {

    state = {
        usu_codigo: '',
        id_usuario: '',
        usu_tipo: ''
    }

    async componentDidMount() {

        const responseSe = await axios.get('LOCAL_SERVER_APP/usuario/ver_sesion', config);


        if (responseSe.data.mensaje) {

            const dataSe = responseSe.data.datos;

            this.setState({ usu_codigo: dataSe.usu_codigo });

        }

        const usuario = window.location.pathname.split("/")[2];

        const response = await axios.post('LOCAL_SERVER_APP/usuario/ver_usuario', {
            usu_codigo: usuario,

        }, config);


        if (response.data.mensaje) {

            const data = response.data.datos;

            console.log("tipo de usuario del perfil: " + JSON.stringify(data));

            this.setState({
                id_usuario: usuario, usu_tipo: data['usu_tipo']
            });

            // if (data['usu_tipo'] == "empresa") {

            //     const responseEmp = await axios.get('LOCAL_SERVER_APP/req/ver_datos_empresa/' + usuario, config);

            //     if (responseEmp.data.mensaje) {
            //         const data = responseEmp.data.datos;

                   

            //     }

            // } else if (data['usu_tipo']  == "alumno") {
            //     const responseAlum = await axios.get('LOCAL_SERVER_APP/req/ver_datos_alumno/' + usuario, config);

            //     if (responseAlum.data.mensaje) {

            //         const data = responseAlum.data.datos;

            //         this.setState({
            //             id_usuario: usuario, usu_tipo: data.usu_tipo
            //         });

            //     }
            // }

        }


    }


    render() {

        return (
            <div className="container mt-3 p-5">

                <If condition={this.state.usu_tipo === "empresa" && this.state.id_usuario == this.state.usu_codigo}>
                    <ProfileEmp />
                </If>
                <If condition={this.state.usu_tipo === "empresa" && this.state.id_usuario != this.state.usu_codigo}>
                    <h1 className='mt-5'>ees mi perfil de empresa </h1>
                </If>
                <If condition={this.state.usu_tipo === "alumno" && this.state.id_usuario == this.state.usu_codigo}>

                    <Profilealum />
                </If>
                <If condition={this.state.usu_tipo === "alumno" && this.state.id_usuario != this.state.usu_codigo}>

                    <Profilealum />
                </If>

            </div>
        )
    }
}