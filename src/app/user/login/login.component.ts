import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private auth: AngularFireAuth){}

  loginForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    }),

    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
  });


  showAlert = false
  alertMsg = 'Please wait! We are logging you in.'
  alertColor = 'blue'
  inSubmission = false

  async login(){
    this.showAlert = true
    this.alertMsg = 'Please wait! Login...'
    this.alertColor = 'blue'
    this.inSubmission = true

    try {
      await this.auth.signInWithEmailAndPassword(
        this.loginForm.controls.email.value, this.loginForm.controls.password.value);
    } catch (e) {
      this.inSubmission = false
      this.alertMsg = 'An unexpected error occured. Please try again later.'
      this.alertColor = 'red'

      //console.log(e);

      return
    }

    this.alertMsg = 'Success! You are now logged in.'
    this.alertColor = 'green'
  }

}
