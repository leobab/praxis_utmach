import React, { Component } from 'react'
import axios from 'axios'
import $ from 'jquery';
import Swal from 'sweetalert2'
import config from '../metodos/config_session';

export default class Validatestudent extends Component {

    state = {
        estudiantes_validar: [],
        conectado: false
    }



    async componentDidMount() {

        const response = await axios.get('http://localhost:5000/alum/listar_alumnos', config);

        if (response.data.mensaje) {

            this.setState({ conectado: true, estudiantes_validar: this.state.estudiantes_validar.concat(response.data.datos) });

        } else {

            this.setState({ conectado: false });

        }
        $(document).ready(function () {
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
        }, 100);


    }

    async eliminar(alum_codigo_enviado) {

        Swal.fire({
            title: 'Está seguro?',
            text: "Se eliminará el alumno y todas sus postulaciones",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, borrar!'
          }).then((result) => {
            if (result.isConfirmed) {
                axios.post('http://localhost:5000/alum/eliminar_alumno', {
                    alum_codigo: alum_codigo_enviado
                }, config).then(
                    function(rs){
                        if(rs.data.mensaje){
                            Swal.fire(
                                'Eliminado!',
                                'Alumno eliminado con éxito',
                                'success'
                              );
                
                                setTimeout(function(){
                                    window.location.reload();
                                }, 2000);
                        }else{
                            Swal.fire(
                                'Error!',
                                'Error eliminar alumno',
                                'error'
                              );
                
                               
                        }
                    }
                ).catch(
                    function(err){
                        Swal.fire(
                            'Error!',
                            'Error eliminar alumno',
                            'error'
                          );
                    }
                );

            }});
    }

    render() {

        return (

            <div class="container mt-3 p-5" style={{ height: '100%' }}>
                <div className='container mt-5' >
                    <h6 style={{ textAlign: 'center' }}>Alumnos por validar</h6>
                    <hr></hr>
                    <table id="example" class="display">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Correo</th>
                                <th className='text-center'>Dirección</th>
                                <th className='text-center'>Teléfono</th>
                                <th className='text-center' style={{ width: '100px' }}>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.estudiantes_validar.map(estudiantes_validar => (
                                    <tr>
                                        <td>{estudiantes_validar.usu_nombre}</td>
                                        <td>{estudiantes_validar.usu_correo}</td>
                                        <td className='text-center'>{estudiantes_validar.usu_direccion}</td>
                                        <td className='text-center'>{estudiantes_validar.usu_telefono}</td>
                                        <td className='text-center'><button type="button" onClick={() => this.eliminar(estudiantes_validar.usu_codigo)} title='Eliminar estudiante' class="btn btn-danger btn-sm"><i class="fa fa-trash" aria-hidden="true"></i></button></td>
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
