import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private _authService: AuthService) {
    _authService.user$.subscribe( (user:any) => {
      this.user = user;
      
      this.initForm();
    })
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: [this.user.name, Validators.required]
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
