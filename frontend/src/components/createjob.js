import React, { Component } from 'react'
import axios from 'axios';
import config from '../metodos/config_session';
import { If, Else, Then} from 'react-if';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Conectadofalse from './conectadofalse';
export default class createjob extends Component {

    state = {

        emp_codigo:'',
        titulo: '',
        descripcion: '',
        ubicacion: '',
        fecha_creacion: '',
        fecha_ini: '',
        fecha_fin: '',
        hora_entrada: '',
        hora_salida: '',
        conectado:false,
        horarios:[],
        horario_empleo:'',
        fecha_practica:[]

    }

    async componentDidMount() {

        const response = await axios.get('http://localhost:5000/usuario/ver_sesion', config);
        if (response.data.mensaje) {
            const data = response.data.datos;
            this.setState({ emp_codigo: data.usu_codigo, conectado:true });
        } 

        const responseFecha = await axios.get('http://localhost:5000/req/fecha_practica', config);
        if (responseFecha.data.mensaje) {
            this.setState({ fecha_practica: this.state.fecha_practica.concat(responseFecha.data.datos) });
        }

    }


    onSubmit = async (e) => {

        e.preventDefault();

        const response = await axios.post('http://localhost:5000/empleo/create_job', {
            emp_codigo: this.state.emp_codigo,
            job_titulo:this.state.titulo,
            job_descripcion:this.state.descripcion,
            job_area:this.state.area,
            job_ubicacion:this.state.ubicacion,
            job_disponibilidad: this.state.horario_empleo,
        }, config);


        if (response.data.mensaje) {

            toast.success('Empleo creado con éxito!', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });

            setTimeout(function(){
                window.location.href = "/principal";
            }, 2000);
            

        }

    }


    onInputChange = (e) => {

        this.setState({

            [e.target.name]: e.target.value

        })

    }



    render() {

        return (
            <div class="container ">
                <If condition={this.state.conectado}>
                    <Then>
                        <div class="col-lg-12 p-5 text center  ">
                        <div className="card mt-3">
                            <div className="card-body">
                                <h5 className="card-title text-center">Crear empleo</h5>
                                <form className="mt-4" onSubmit={this.onSubmit}>
                                    <h6 class="mt-3 mb-3">Puesto o cargo</h6>
                                    <textarea class="form-control" name="titulo" onChange={this.onInputChange} value={this.state.titulo} placeholder="Puesto o cargo solicitado" rows="1"></textarea>
                                    <h6 class="mt-3 mb-3">Descripción del empleo</h6>
                                    <textarea class="form-control" name="descripcion" onChange={this.onInputChange} value={this.state.descripcion} placeholder="Una descripción bien detallada de las actividades del empleo a ofertar" rows="6"></textarea>
                                    <div className='row'>
                                        <div className='col-4'>
                                            <h6 class="mt-3 mb-3">Área</h6>
                                            <textarea class="form-control" name="area" onChange={this.onInputChange} value={this.state.area} placeholder="Área del puesto o cargo solicitado" rows="1"></textarea>
                                        </div>
                                        <div className='col-4'>
                                            <h6 class="mt-3 mb-3">Ubicación</h6>
                                            <textarea class="form-control" name="ubicacion" onChange={this.onInputChange} value={this.state.ubicacion} placeholder="Ciudad o país de ubicación" rows="1"></textarea>
                                        </div>
                                        <div className='col-4'>
                                            <h6 class="mt-3 mb-3">Fecha de prácticas</h6>
                                            <select className="form-control" onChange={this.onInputChange} name="horario_empleo" value={this.state.horario_empleo} required>
                                                {
                                                    this.state.fecha_practica.map(fechpractica => (
                                                        <option key={fechpractica.cod_fecha_practica} value={fechpractica.cod_fecha_practica}>
                                                            {fechpractica.fecha}
                                                        </option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div className='form-group mt-3'>
                                        <button className="btn btn-success" style={{ float: "right" }} type="submit">Crear práctica</button>
                                        <a href="/principal"><button type="button" class="btn btn-danger mr-3" style={{ float: 'right' }}>Cancelar</button></a>
                                    </div>
                                </form>
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
                        </div>
                    </Then>
                    <Else>
                        {/* <Conectadofalse /> */}
                    </Else>
                </If>
                
            </div>
        )
    }
}



