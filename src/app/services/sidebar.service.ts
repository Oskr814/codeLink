import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    toggle: boolean = false;
    hideSidebar = new BehaviorSubject<boolean>(this.toggle);

    constructor() {}

    toggleSidebar() {
        this.toggle = !this.toggle;
        this.hideSidebar.next(this.toggle);
    }
}
