import React, { Component } from 'react'
import { If, Else, Then} from 'react-if';
import axios from 'axios'
import Conectadofalse from './conectadofalse';
import Modaljobedit from './modaljobedit';
import $ from 'jquery';
import Swal from 'sweetalert2'
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

        Swal.fire({
            title: 'Está seguro?',
            text: "El emplo será validado y disponible para que los alumnos se postulen",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, validar!'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://localhost:5000/empleo/validar_empleo', {
                    job_codigo : job_codigo,
                    emp_codigo : emp_codigo
                }, config).then(
                    function(rs){
                        if(rs.data.mensaje){
                            Swal.fire(
                                'Validado!',
                                'Empleo validado con éxito',
                                'success'
                              );
                
                                setTimeout(function(){
                                    window.location.reload();
                                }, 2000);
                        }else{
                            Swal.fire(
                                'Error!',
                                'Error validar empleo',
                                'error'
                              );
                
                               
                        }
                    }
                ).catch(
                    function(err){
                        Swal.fire(
                            'Error!',
                            'Error validar empleo',
                            'error'
                          );
                    }
                );

            }});
        
    }
    

    async eliminar(job_codigo_enviado) {

        Swal.fire({
            title: 'Está seguro?',
            text: "El empleo será eliminado y todas sus postulaciones",
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
                                'Eliminada!',
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
            <If condition={this.state.conectado}>
                <Then>
                    <div class="container mt-3 p-5" style={{ height: '100%' }}>
                        <div className='container mt-5'>
                            <h6 style={{ textAlign: 'center' }}>Empleos por validar</h6>
                            <hr></hr>
                            <div id="containerErrores" class="mt-3"></div>
                            <table id="example" class="display"  style={{width:'100%'}}>
                                <thead>
                                    <tr>
                                        <th >Empleo</th>
                                        <th >Empresa</th>
                                        <th>Área</th>
                                        <th>Ubicación</th>
                                        <th>Estado</th>
                                        <th className='text-center' >Opciones</th>
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
                            
                        </div>
                    </div>
                </Then>
                <Else>
                    
                </Else>
                
            </If>
            
        )
    }

}
