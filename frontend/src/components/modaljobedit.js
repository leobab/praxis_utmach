import React, { Component } from 'react'
import $ from 'jquery';
import Swal from 'sweetalert2'
import axios from 'axios'

import config from '../metodos/config_session';

export default class Modaljobedit extends Component {
    state = {

        titulo: '',
        descripcion: '',
        ubicacion: '',
        area:'',
        fecha_ini: '',
        fecha_fin: '',
        hora_entrada: '',
        hora_salida: '',
        horarios:[],
        fecha_practica: [],
    }

    async componentDidMount() {

        const responseFecha = await axios.get('http://localhost:5000/req/fecha_practica', config);
        if (responseFecha.data.mensaje) {
            this.setState({ fecha_practica: this.state.fecha_practica.concat(responseFecha.data.datos) });
        }


    }

    
    onInputChange = (e) => {

        this.setState({

            [e.target.name]: e.target.value

        })

    }


    howItWorks = async () => {
        
        try{
            const response = await axios.post('http://localhost:5000/empleo/update_job', {
            job_titulo: document.getElementById('job_titulo').value,
            job_descripcion:document.getElementById('job_descripcion').value, 
            job_area:document.getElementById('job_area').value, 
            job_ubicacion:document.getElementById('job_ubicacion').value, 
            job_codigo: document.getElementById('job_codigo').value,
            job_disponibilidad: document.getElementById('job_disponibilidad').value,
            }, config);

            Swal.fire(
                'Actualizado!',
                'Empleo actualizado con éxito',
                'success'
              );
            //limpia el modal
            document.getElementById('job_codigo').innerText = '';
        
            //cierra el modal
            //$('#modaljobedit').modal('hide')
            setTimeout(function(){
                $('#modaljobedit').modal('hide')
                window.location.reload();
            }, 2000);

            


        }catch (error) {
            Swal.fire(
                'Error!',
                'Rellene todos los campos',
                'error'
              );  
        }
    

    }

    render() {

        return (
            <div class="modal fade" id="modaljobedit" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Editar Empleo</h5>
                            <h6 id="job_codigo" hidden></h6>
                        </div>
                        <div class="modal-body">
                            <h6 id="modal_body"></h6>
                            <form>
                                <h6 class="mt-2 mb-3 text-left">Puesto o cargo</h6>
                                <textarea class="form-control"  id="job_titulo" name="titulo" onChange={this.onInputChange}  rows="1"></textarea>
                                <h6 class="mt-3 mb-3 text-left">Descripción del empleo</h6>
                                <textarea class="form-control" id="job_descripcion" name="descripcion" onChange={this.onInputChange}  rows="6"></textarea>
                                <div className='row'>
                                    <div className='col-4'>
                                        <h6 class="mt-3 mb-3 text-left">Área</h6>
                                        <textarea class="form-control" id="job_area" name="area" onChange={this.onInputChange} rows="1"></textarea>
                                    </div>
                                    <div className='col-4'>
                                        <h6 class="mt-3 mb-3 text-left">Ubicación</h6>
                                        <textarea class="form-control" id="job_ubicacion" name="ubicacion" onChange={this.onInputChange} rows="1"></textarea>
                                    </div>
                                    <div className='col-4'>
                                        <h6 class="mt-3 mb-3 text-left">Fecha de prácticas</h6>
                                        <select className="form-control" onChange={this.onInputChange} id="job_disponibilidad" name="job_disponibilidad" >
                                                {
                                                    this.state.fecha_practica.map(fecha_practica => (
                                                        <option key={fecha_practica.cod_fecha_practica} value={fecha_practica.cod_fecha_practica}>
                                                            {fecha_practica.fecha}
                                                        </option>
                                                    ))
                                                }
                                        </select>
                                    </div>
                                </div>


                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button id="saveIdiom" type="button" class="btn btn-primary" onClick={this.howItWorks} >Actualizar</button>
                            
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}