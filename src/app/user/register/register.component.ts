import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent {

  constructor(private auth: AngularFireAuth){}

  inSubmition = false;

  registerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),

      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),

      age: new FormControl('', [
        Validators.required,
        Validators.min(18),
        Validators.max(100)
      ]),

      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
      ]),

      confirm_password: new FormControl('', [
        Validators.required
      ]),

      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(14)
      ])
  })

  showAlert = false
  alertMsg = ''
  alertColor = 'blue'

  async register(){
    this.showAlert = true
    this.alertMsg = 'Please wait! Your account is being created.'
    this.alertColor = 'blue'

    // Disabilita il form mentre si sta inviando la richiesta
    this.inSubmition = true;

    const {email, password} = this.registerForm.value

    try {
      const userCred = await this.auth.createUserWithEmailAndPassword(
        email as string, password as string
      )

      console.log(userCred);
    } catch (e) {
      this.alertMsg = `Failed with error code: ${e}`
      this.alertColor = 'red'

      this.inSubmition = false

      // Evitare che se c'è qualcosa dopo il try catch venga eseguita
      return
    }

    this.alertMsg = 'Success! Your account as been created.'
    this.alertColor = 'green'
  }


}
