import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.iniForm();
  }

  ngOnInit(): void {}

  iniForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  isInvalid(campo) {
    return this.form.get(campo).invalid && this.form.get(campo).touched
  }

  isValid(campo) {
    return this.form.get(campo).valid;
  }

  validForm() {
    
      Object.values(this.form.controls).forEach( control => {
        control.markAsTouched();
      });
    return this.form.valid;
  }

  login() {
    if(this.validForm()) {
      console.log('login');
    }
  }
}
