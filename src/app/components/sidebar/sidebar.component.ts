import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    @Output() createNew = new EventEmitter<string>();
    toggleSidebar: boolean;

    constructor(private _sidebarService: SidebarService) {
        this._sidebarService.hideSidebar.subscribe(
            (toggleSidebar) => (this.toggleSidebar = toggleSidebar)
        );
    }

    ngOnInit(): void {}

    new(type: string) {
        this.createNew.emit(type);
    }
}
