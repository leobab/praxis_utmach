import React, { Component } from 'react'
import { If, Else, Then} from 'react-if';
import axios from 'axios'
import Conectadofalse from './conectadofalse';
import Modaljobedit from './modaljobedit';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import config from '../metodos/config_session';

export default class Validateempleos extends Component {

    state = {
        empleos_validar: [],
        conectado: false
    }



    async componentDidMount() {

        const responseSesion = await axios.get('http://localhost:5000/usuario/ver_sesion', config);

        if (responseSesion.data.mensaje) {

            this.setState({ conectado: true });

        } else {

            this.setState({ conectado: false });

        }

        const response = await axios.get('http://localhost:5000/empleo/listar_todos_empleos', config);

        if (response.data.mensaje) {

            this.setState({ conectado: true, empleos_validar: this.state.empleos_validar.concat(response.data.datos) });

        } else {

            this.setState({ conectado: false });

        }

        
            $('#example').DataTable({
                "bDestroy": "true",
                "language": {
                    "decimal": ",",
                    "thousands": ".",
                    "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                    "infoPostFix": "",
                    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                    "loadingRecords": "Cargando...",
                    "lengthMenu": "Mostrar _MENU_ registros",
                    "paginate": {
                        "first": "Primero",
                        "last": "Último",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    },
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "searchPlaceholder": "Término de búsqueda",
                    "zeroRecords": "No se encontraron resultados",
                    "emptyTable": "Ningún dato disponible en esta tabla",
                    "aria": {
                        "sortAscending":  ": Activar para ordenar la columna de manera ascendente",
                        "sortDescending": ": Activar para ordenar la columna de manera descendente"
                    },
            }});
        
    }

    async validar(job_codigo, emp_codigo) {
        const response = await axios.post('http://localhost:5000/empleo/validar_empleo', {
            job_codigo : job_codigo,
            emp_codigo : emp_codigo
        }, config);

        if (response.data.mensaje) {

            toast.success('Empleo validado!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                });


            
            setTimeout(function(){
                window.location.reload();
            }, 2000);

        }else{
            var container = document.getElementById("containerErrores");
            var el = document.createElement("div");
            el.className = "alert alert-danger alert-dismissible fade show";
            el.role = "alert";
            el.innerHTML = "Error al validar empleo. <button type='button' class='close' data-dismiss='alert' aria-label='Close'> <span aria-hidden='true'>&times;</span></button>";
            container.append(el);
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
                    window.location.reload();
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
        
        $("#job_disponibilidad").val(job_disponibilidad);
        $("#job_codigo").val(job_codigo);
        $("#job_titulo").val(job_titulo);
        $("#job_descripcion").val(job_descripcion);
        $("#job_area").val(job_area);
        $("#job_ubicacion").val(job_ubicacion);
        $('#modaljobedit').modal('show');
        
    }

    render() {

       
        return (
            <If condition={this.state.conectado}>
                <Then>
                    <div class="container mt-3 p-5" style={{ height: '100%' }}>
                        <div className='container mt-5' style={{ height: '500px' }}>
                            <h6 style={{ textAlign: 'center' }}>Empleos por validar</h6>
                            <hr></hr>
                            <div id="containerErrores" class="mt-3"></div>
                            <table id="example" class="display">
                                <thead>
                                    <tr>
                                        <th style={{ width: '200px' }}>Empleo</th>
                                        <th style={{ width: '200px' }}>Empresa</th>
                                        <th style={{ width: '100px', textAlign:'center' }}>Área</th>
                                        <th style={{ width: '100px', textAlign:'center' }}>Ubicación</th>
                                        <th style={{ width: '100px', textAlign:'center' }}>Estado</th>
                                        <th className='text-center' style={{ width: '200px' }}>Opciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.empleos_validar.map(empleos_validar => (
                                            <tr>
                                                <td>{empleos_validar.job_titulo}</td>
                                                <td>{empleos_validar.nombre_empresa}</td>
                                                <td className='text-center'>{empleos_validar.job_area}</td>
                                                <td className='text-center'>{empleos_validar.job_ubicacion}</td>
                                                <td className='text-center'>{empleos_validar.job_etd}</td>
                                                <td className='text-center'>
                                                <If condition={empleos_validar.job_etd== 'NO VALIDADO'}>
                                                    <button type="button" onClick={() => this.validar(empleos_validar.job_codigo, empleos_validar.emp_codigo)} title='Validar empleo' class="btn btn-success btn-sm"><i class="fa fa-check" aria-hidden="true"></i></button>    

                                                </If>
                                                <button type="button" title='Editar empleo' class="btn btn-warning btn-sm" data-toggle="modal" data-target="#modaljobedit" id="submit" onClick={()=> this.openmodal(empleos_validar.job_codigo, empleos_validar.job_titulo, empleos_validar.job_descripcion, empleos_validar.job_area, empleos_validar.job_ubicacion, empleos_validar.job_disponibilidad)}><i class="fa fa-pencil" aria-hidden="true"></i></button>
                                                <button type="button" onClick={() => this.eliminar(empleos_validar.job_codigo)} title='Eliminar empleo' class="btn btn-danger btn-sm"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
                                                <Modaljobedit job_codigo={empleos_validar.job_codigo} job_titulo={empleos_validar.job_titulo} job_descripcion={empleos_validar.job_descripcion} job_area={empleos_validar.job_area} job_ubicacion={empleos_validar.job_ubicacion} job_disponibilidad={empleos_validar.job_disponibilidad}/>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
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
                    </div>
                </Then>
                <Else>
                    
                </Else>
                
            </If>
            
        )
    }

}
