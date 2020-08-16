import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from '../../services/toastr.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    user: User;
    form: FormGroup;
    passwordForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private _authService: AuthService,
        private _toastrService: ToastrService,
        private httpCliente: HttpClient,
        private modalService: NgbModal
    ) {
        this._authService.user$.subscribe((user) => {
            this.user = user;

            this.initForm();
        });
    }

    initForm() {
        this.form = this.formBuilder.group({
            name: [this.user.name, Validators.required]
        });

        this.passwordForm = this.formBuilder.group({
            oldPassword: ['', [Validators.required, Validators.minLength(8)]],
            password: ['', [Validators.required, Validators.minLength(8)]]
        });
    }

    open(content) {
        this.modalService.open(content);
    }

    ngOnInit(): void {}

    isInvalid(campo: string, form: FormGroup) {
        return form.get(campo).invalid && form.get(campo).touched;
    }

    isValid(campo: string, form: FormGroup) {
        return form.get(campo).valid;
    }

    validForm(form: FormGroup) {
        Object.values(form.controls).forEach((control) => {
            control.markAsTouched();
        });
        return form.valid;
    }

    actualizarUsuario() {
        if (this.validForm(this.form)) {
            this.httpCliente
                .put(`http://localhost:3000/${this.user._id}`, {
                    name: this.form.get('name').value
                })
                .subscribe(
                    (res: any) => {
                        if (res.ok) {
                            this._authService.setToken(res.token);
                        }
                    },
                    (err) => console.log(err)
                );
        }
    }

    changePassword() {
        if (this.validForm(this.passwordForm)) {
            this._authService
                .changePassword(this.passwordForm.value)
                .then((res) => {
                    this._toastrService.show({
                        message: 'Contraseña actualizada con exito'
                    });

                    this.modalService.dismissAll();
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
