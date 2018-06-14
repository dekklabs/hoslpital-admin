import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';
import { element } from 'protractor';

declare function init_plugin();
declare const gapi : any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  recuerdame = false;
  email:string;
  auth2:any;

  constructor( public router : Router,
               public _us:UsuarioService ) { }

  ngOnInit() {
    init_plugin();
    this.googleInit();
    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', ()=>{
      this.auth2 = gapi.auth2.init({
        client_id : '783899450461-ovqmtce8aiq5uh4d4cujnjq5of6v9194.apps.googleusercontent.com',
        cookiepolicy : 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  attachSignin(element){
    this.auth2.attachClickHandler(element, {}, (googleUser) =>{
      let profile = googleUser.getBasicProfile();
      let token = googleUser.getAuthResponse().id_token;
      this._us.loginGoogle(token)
          .subscribe(resp =>{
            window.location.href = '#/dashboard';
          });
    });
  }

  ingresar(forma: NgForm) {
    if (forma.invalid) {
      return;
    }

    let usuario = new Usuario(null, forma.value.email, forma.value.password);
    this._us.login(usuario, forma.value.recuerdame)
      .subscribe(correcto => this.router.navigate(['/dashboard']));
  }

}
