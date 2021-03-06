import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from '../../services/toastr.service';
import { environment } from 'src/environments/environment';

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
        private httpClient: HttpClient,
        private _authService: AuthService,
        private _toastrService: ToastrService
    ) {
        this.initForm();
    }

    ngOnInit(): void {}

    initForm() {
        this.form = this.formBuilder.group(
            {
                name: [
                    '',
                    [Validators.required, Validators.pattern('[a-zA-Z ]*')]
                ],
                email: [
                    '',
                    [
                        Validators.required,
                        Validators.pattern(
                            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                        )
                    ]
                ],
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
                .post(`${environment.baseUrl}/user`, {
                    name: this.form.get('name').value,
                    email,
                    password
                })
                .toPromise()
                .then((res: any) => {
                    if (res.ok) {
                        this._authService.login(email, password);
                    }
                })
                .catch((err) =>
                    this._toastrService.show({
                        message: err.error.message,
                        type: 'error'
                    })
                );
        }
    }
}
