import { Injectable } from '@angular/core';
import { ToastrService as NxgToastrService } from 'ngx-toastr';
import { toastrMessage } from '../interfaces/toastr-message.interface';

@Injectable({
    providedIn: 'root'
})
export class ToastrService {
    constructor(private toastr: NxgToastrService) {}

    show({ title = '', message, type = 'success' }: toastrMessage) {
        this.toastr[type](message, title);
    }
}
