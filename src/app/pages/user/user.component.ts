import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['Oscar Blandon', Validators.required]
    });
  }

  ngOnInit(): void {}

  isInvalid(campo) {
    return this.form.get(campo).invalid && this.form.get(campo).touched;
  }

  isValid(campo) {
    return this.form.get(campo).valid;
  }
}
