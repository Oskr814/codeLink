import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-registro',
    templateUrl: './registro.component.html',
    styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
    form: FormGroup;

    user: UserModel;

    preRegistro: Boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private httpClient: HttpClient,
        private _authService: AuthService
    ) {
        this.initForm();
    }

    ngOnInit(): void {}

    initForm() {
        this.form = this.formBuilder.group(
            {
                name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['', [Validators.required, Validators.minLength(8)]],
                repassword: ['', [Validators.required]]
            },
            {
                validators: this.passwordMatch()
            }
        );
    }

    isInvalid(campo) {
        return this.form.get(campo).invalid && this.form.get(campo).touched;
    }

    isValid(campo) {
        return this.form.get(campo).valid;
    }

    passwordMatch() {
        return (formGroup: FormGroup) => {
            const password = formGroup.controls['password'];
            const repassword = formGroup.controls['repassword'];
            if (password.value !== '' && password.value == repassword.value) {
                repassword.setErrors(null);
            } else {
                repassword.setErrors({ passMatch: false });
            }
        };
    }

    validForm() {
        Object.values(this.form.controls).forEach((control) => {
            control.markAsTouched();
        });
        return this.form.valid;
    }

    preRegistroUser() {
        if (this.validForm()) {
            const email = this.form.get('email').value;
            const password = this.form.get('password').value;
            this.httpClient
                .post('http://localhost:3000/user ', {
                    name: this.form.get('name').value,
                    email,
                    password
                })
                .subscribe((res: any) => {
                    if (res.ok) {
                        this._authService.login(email, password);
                    }
                });

            //this.router.navigate(['/plans']);
        }
    }
}
