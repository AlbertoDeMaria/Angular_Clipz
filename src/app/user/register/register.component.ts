import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private auth: AuthService, private emailTaken: EmailTaken){}

  inSubmition = false;

  registerForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),

      email: new FormControl('', [
        Validators.required,
        Validators.email
      ], [this.emailTaken.validate]),

      age: new FormControl<number | null>(null, [
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
        Validators.minLength(14),
        Validators.maxLength(14)
      ])

      // Factory design applicabile a diversi campi
  }, [RegisterValidators.match('password', 'confirm_password')])

  showAlert = false
  alertMsg = ''
  alertColor = 'blue'

  async register(){
    this.showAlert = true
    this.alertMsg = 'Please wait! Your account is being created.'
    this.alertColor = 'blue'

    // Disabilita il form mentre si sta inviando la richiesta
    this.inSubmition = true;

    try {
      await this.auth.createUser(this.registerForm.value as IUser)
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
