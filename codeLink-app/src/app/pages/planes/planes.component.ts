import { Component, OnInit, ViewChild } from '@angular/core';
import { Plans } from '../../interfaces/plans.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user.interface';

@Component({
    selector: 'app-planes',
    templateUrl: './planes.component.html',
    styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {
    @ViewChild('content') modal;
    plans: Array<Plans> = [
        {
            code: 'basico',
            title: 'Plan basico',
            price: 'Free',
            subtitle: 'Ideal para aventureros',
            features: [
                { text: 'Almacenamiento en la nube', value: true },
                { text: 'Exportar proyecto', value: false },
                { text: 'Proyectos ilimitados', value: false }
            ]
        },
        {
            code: 'estandar',
            title: 'Plan estandar',
            price: '$3/Mes',
            subtitle: 'Ideal para entusiastas',
            features: [
                { text: 'Almacenamiento en la nube', value: true },
                { text: 'Exportar proyecto', value: true },
                { text: 'Proyectos ilimitados', value: false }
            ]
        },
        {
            code: 'premium',
            title: 'Plan premium',
            price: '$5/Mes',
            subtitle: 'Sin limites!',
            features: [
                { text: 'Almacenamiento en la nube', value: true },
                { text: 'Exportar proyecto', value: true },
                { text: 'Proyectos ilimitados', value: true }
            ]
        }
    ];

    form: FormGroup;
    plan: any;
    user: User;

    constructor(
        private httpCliente: HttpClient,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private _authService: AuthService,
        private router: Router
    ) {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            number: ['', [Validators.required, Validators.minLength(19)]],
            mes: ['', [Validators.required, Validators.minLength(2)]],
            anio: ['', [Validators.required, Validators.minLength(4)]],
            cvc: ['', [Validators.required, Validators.minLength(3)]]
        });

        this._authService.user$.subscribe((user) => {
            this.user = user;

            if (!user) {
                this.router.navigate(['/landing']);
            }
        });
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

    openModal(content) {
        this.modalService.open(content, { centered: true });
    }

    setPlan(code) {
        this.plan = code;

        if (this.user.paymentMethod) {
            return this.updatePlan(null);
        }

        if (code !== 'basico') {
            this.openModal(this.modal);
        } else {
            this.updatePlan(null);
        }
    }

    updatePlan(card) {
        let data: any = {
            plan: this.plan,
            pre: false
        };

        if (card) {
            if (!this.validForm()) return;

            let creditCard = {
                name: this.form.get('name').value,
                number: this.form.get('number').value,
                date:
                    this.form.get('mes').value +
                    '/' +
                    this.form.get('anio').value,
                cvc: this.form.get('cvc').value
            };

            data.creditCard = creditCard;
            data.paymentMethod = true;
        }

        this.httpCliente
            .put(`http://localhost:3000/user/${this.user._id}`, data)
            .subscribe(
                (res: any) => {
                    if (res.ok) {
                        this._authService.setToken(res.token);
                        this.modalService.dismissAll();

                        this.router.navigate(['/home']);
                    }
                },
                (err) => console.log(err)
            );
    }
}
