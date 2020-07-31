import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { User } from '../../interfaces/user.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
    user: User;
    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private _authService: AuthService,
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
    }

    open(content) {
        this.modalService.open(content);
    }

    ngOnInit(): void {}

    isInvalid(campo) {
        return this.form.get(campo).invalid && this.form.get(campo).touched;
    }

    isValid(campo) {
        return this.form.get(campo).valid;
    }

    validForm() {
        Object.values(this.form.controls).forEach((control) => {
            control.markAsTouched();
        });
        return this.form.valid;
    }

    actualizarUsuario() {
        if (this.validForm()) {
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
}
