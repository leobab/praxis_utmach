import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery';
import Modaljobedit from './modaljobedit';
import config from '../metodos/config_session';
import { If, Then, Else } from 'react-if';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class myjobs extends Component {

    state = {
        empleos: [],
        emp_codigo:''
    }


    async componentDidMount() {

        const response = await axios.get('http://localhost:5000/usuario/ver_sesion', config);

        if (response.data.mensaje) {

            const data = response.data.datos;

            this.setState({ emp_codigo: data.usu_codigo });

        } 

        const responseEmpleo = await axios.post('http://localhost:5000/empleo/listar_empleos_empresa',{
            emp_codigo:this.state.emp_codigo,
        }, config);

        if (responseEmpleo.data.mensaje) {


            this.setState({ empleos: this.state.empleos.concat(responseEmpleo.data.datos) });

        }


    }

    async eliminar(job_codigo_enviado) {
        const response = await axios.post('http://localhost:5000/empleo/eliminar_empleo', {
            job_codigo: job_codigo_enviado
        }, config);

        if (response.data.mensaje) {

            toast.success('Empleo eliminado con éxito!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });

            setTimeout(function(){
                window.location.href = "/myjobs";
            }, 2000);


        }else{
            var container = document.getElementById("containerErrores");
            var el = document.createElement("div");
            el.className = "alert alert-danger alert-dismissible fade show";
            el.role = "alert";
            el.innerHTML = "Error al borrar empleo. <button type='button' class='close' data-dismiss='alert' aria-label='Close'> <span aria-hidden='true'>&times;</span></button>";
            container.append(el);
        }
    }

    openmodal(job_codigo, job_titulo, job_descripcion, job_area, job_ubicacion, job_disponibilidad){
        $('#modaljobedit').modal('show');
        $("#job_codigo").val(job_codigo);
        $("#job_titulo").val(job_titulo);
        $("#job_descripcion").val(job_descripcion);
        $("#job_area").val(job_area);
        $("#job_ubicacion").val(job_ubicacion);
        $("#job_disponibilidad").val(job_disponibilidad);
    }


    render() {

        $(document).ready(function () {
            setTimeout(function () {
                $('#example').DataTable();
            }, 100);
        });



        return (

            <div class="container mt-3 p-5" style={{ height: '100%' }}>
                <div className='container mt-5' style={{ height: '500px' }}>
                    <div id="mensajeconfirmacion" class="mt-3"></div>
                    <h6 style={{ textAlign: 'center' }}>Mis empleos</h6>
                    <hr></hr>
                    <div id="mensajeconfirmacion" class="mt-3"></div>
                    
                    <table id="example" class="display">
                        <thead>
                            <tr>
                                <th>Puesto o cargo</th>
                                
                                <th>Área</th>
                                <th className='text-center'>Ubicación</th>
                                <th className='text-center' style={{ width: '100px' }}>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.empleos.map(empleos => (
                                    <tr>
                                        <td>{empleos.job_titulo}</td>
                                       
                                        <td>{empleos.job_area}</td>
                                        <td className='text-center'>{empleos.job_ubicacion}</td>
                                        <If condition={empleos.job_estado==="NO DISPONIBLE"}>
                                            <Then>
                                                <td className='text-center'><a href={"/postulantes/"+empleos.job_codigo } ><button type="button" class="btn btn-primary btn-sm mr-1" title='Ver postulaciones'><i class="fa fa-eye" aria-hidden="true"></i></button></a>
                                                </td> 
                                            </Then>
                                            <Else>
                                                <td className='text-center'><a href={"/postulantes/"+empleos.job_codigo } ><button type="button" class="btn btn-primary btn-sm mr-1" title='Ver postulaciones'><i class="fa fa-eye" aria-hidden="true"></i></button></a>
                                                <button type="button" title='Editar empleo' class="btn btn-warning btn-sm mr-1" data-toggle="modal" data-target="#modaljobedit" id="submit" onClick={()=> this.openmodal(empleos.job_codigo, empleos.job_titulo, empleos.job_descripcion, empleos.job_area, empleos.job_ubicacion, empleos.job_fecha_fin, empleos.job_hora_entrada, empleos.job_hora_salida, empleos.job_disponibilidad)}><i class="fa fa-pencil" aria-hidden="true"></i></button>
                                                <Modaljobedit job_codigo={empleos.job_codigo} job_titulo={empleos.job_titulo} job_descripcion={empleos.job_descripcion} job_area={empleos.job_area} job_ubicacion={empleos.job_ubicacion} job_disponibilidad={empleos.job_disponibilidad}/>
                                                <button type="button" onClick={() => this.eliminar(empleos.job_codigo)} title='Eliminar empleo' class="btn btn-danger btn-sm"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
                                            </Else>
                                             
                                        </If>
                                        
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
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
