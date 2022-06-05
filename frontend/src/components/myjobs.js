import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery';
import Modaljobedit from './modaljobedit';
import config from '../metodos/config_session';
import { If, Then, Else } from 'react-if';
import Swal from 'sweetalert2'

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

        $('#example').dataTable({
            "bDestroy": true,
            "language": {
                "lengthMenu": "Mostrar _MENU_ registros",
                "zeroRecords": "No se encontraron resultados",
                "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
                "infoFiltered": "(filtrado de un total de _MAX_ registros)",
                "sSearch": "Buscar:",
                "oPaginate": {
                    "sFirst": "Primero",
                    "sLast": "Último",
                    "sNext": "Siguiente",
                    "sPrevious": "Anterior"
                },
                "sProcessing": "Procesando...",
            }
        }
        );


    }

    async eliminar(job_codigo_enviado) {

        Swal.fire({
            title: 'Está seguro?',
            text: "Se eliminará el empleo y todas sus postulaciones",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, borrar!'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://localhost:5000/empleo/eliminar_empleo', {
                    job_codigo: job_codigo_enviado
                }, config).then(
                    function(rs){
                        if(rs.data.mensaje){
                            Swal.fire(
                                'Eliminado!',
                                'Empleo eliminado con éxito',
                                'success'
                              );
                
                                setTimeout(function(){
                                    window.location.reload();
                                }, 2000);
                        }else{
                            Swal.fire(
                                'Error!',
                                'Error eliminar empleo',
                                'error'
                              );
                
                               
                        }
                    }
                ).catch(
                    function(err){
                        Swal.fire(
                            'Error!',
                            'Error eliminar empleo',
                            'error'
                          );
                    }
                );

            }});

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

            <div class="container mt-3 p-5" style={{ height: '100%' }}>
                <div className='container mt-5' style={{ height: '500px' }}>
                    <div id="mensajeconfirmacion" class="mt-3"></div>
                    <h6 style={{ textAlign: 'center' }}>Mis empleos</h6>
                    <hr></hr>
                    <div id="mensajeconfirmacion" class="mt-3"></div>
                    
                    <table id="example" class="display">
                        <thead>
                            <tr>
                                <th style={{ width: '400px' }}>Puesto o cargo</th>
                                
                                <th style={{ width: '200px', textAlign:'center' }}>Área</th>
                                <th style={{ width: '200px' , textAlign:'center'}}>Ubicación</th>
                                <th style={{ width: '200px', textAlign:'center' }}>Estado</th>
                                <th className='text-center' style={{ width: '100px' }}>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.empleos.map(empleos => (
                                    <tr>
                                        <td>{empleos.job_titulo}</td>
                                       
                                        <td style={{ textAlign:'center'}}>{empleos.job_area}</td>
                                        <td className='text-center'>{empleos.job_ubicacion}</td>
                                        <If condition={empleos.job_etd == 'NO VALIDADO'}>
                                            <Then>
                                                <td className='text-center' title="Su empleo está pendiente de validación por un administrador.">{empleos.job_etd}</td>
                                            </Then>
                                            <Else>
                                            <td className='text-center' title="Su empleo está validado por un administrador.">{empleos.job_etd}</td>
                                            </Else>
                                            
                                        </If>
                                        
                                        <If condition={empleos.job_estado==="NO DISPONIBLE"}>
                                            <Then>
                                                <td className='text-center'><a href={"/postulantes/"+empleos.job_codigo } ><button type="button" class="btn btn-primary btn-sm mr-1" title='Ver postulaciones'><i class="fa fa-eye" aria-hidden="true"></i></button></a>
                                                </td> 
                                            </Then>
                                            <Else>
                                                <td className='text-center'>
                                                <button type="button" title='Editar empleo' class="btn btn-warning btn-sm mr-1" data-toggle="modal" data-target="#modaljobedit" id="submit" onClick={()=> this.openmodal(empleos.job_codigo, empleos.job_titulo, empleos.job_descripcion, empleos.job_area, empleos.job_ubicacion, empleos.job_disponibilidad)}><i class="fa fa-pencil" aria-hidden="true"></i></button>
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
               

                
            </div>





        )
    }

}
