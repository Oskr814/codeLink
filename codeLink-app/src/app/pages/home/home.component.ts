import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService } from '../../services/sidebar.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    activeFolder: string;
    modalText: { title: string; type: string };

    list: boolean = true;

    deviceResolution: number;

    toggleSidebar: boolean;

    constructor(
        private modalService: NgbModal,
        private _sidebarService: SidebarService
    ) {
        this._sidebarService.hideSidebar.subscribe(
            (toggle) => (this.toggleSidebar = toggle)
        );
    }

    ngOnInit(): void {
        this.deviceResolution = window.innerWidth;

        this.list = this.deviceResolution > 576;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.deviceResolution = window.innerWidth;

        this.list = this.deviceResolution > 576;
    }

    active(event) {
        this.activeFolder = event.target.id;
    }

    openModal(content, type) {
        if (type == 'carpeta') {
            this.modalText = {
                title: 'Nueva carpeta',
                type
            };
        } else {
            this.modalText = {
                title: 'Nuevo proyecto',
                type
            };
        }

        this.modalService.open(content, { centered: true });
    }
}
