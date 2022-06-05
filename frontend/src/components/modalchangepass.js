import React, { Component } from 'react'
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios'

import config from '../metodos/config_session';

export default class Modalchangepass extends Component {
    
    state = {

        antigua_pass:'',
        nueva_pass:''
    }

    howItWorks = async (e) => {
        e.preventDefault();

        
    }

    onInputChange = (e) => {

        this.setState({

            [e.target.name]: e.target.value

        })

    }

    render() {

        return (
            // <div class="modal fade" id="modalchangepass" >
            //      <div class="modal-dialog" >
            //         <div class="modal-content">
            //             <div class="modal-header">
            //                 <h5 class="modal-title" id="exampleModalLabel">Cambiar contraseña</h5>
            //             </div>
            //             <div class="modal-body">
                           
            //                 <form>
            //                     <h6 class="mt-2 mb-3 text-left">Antigua contraseña</h6>
            //                     <input  type="password" class="form-control"  id="antigua_pass" name="antigua_pass" onChange={this.onInputChange} ></input>
            //                     <h6 class="mt-3 mb-3 text-left">Nueva contraseña</h6>
            //                     <input type="password" class="form-control" id="nueva_pass" name="nueva_pass" onChange={this.onInputChange} ></input>
                                

            //                 </form>
            //             </div>
            //             <div class="modal-footer">
            //                 <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            //                 <button id="saveIdiom" type="button" class="btn btn-primary" onClick={this.howItWorks} >Actualizar</button>
                            
            //             </div>
            //         </div>
                    
            //     </div>
            //     <ToastContainer position="top-right"
            //                 autoClose={1000}
            //                 hideProgressBar
            //                 newestOnTop={false}
            //                 closeOnClick={false}
            //                 rtl={false}
            //                 pauseOnFocusLoss={false}
            //                 draggable={false}
            //                 pauseOnHover={false}
            //                 />
            // </div>
            <div class="modal fade" id="myModal">
            <div class="modal-dialog">
              <div class="modal-content">
      
                
                <div class="modal-header">
                  <h4 class="modal-title">Modal Heading</h4>
                  <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>
      
               
                <div class="modal-body">
                  Modal body..
                </div>
      
            
                <div class="modal-footer">
                  <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                </div>
      
              </div>
            </div>
          </div>
        )
    }
}