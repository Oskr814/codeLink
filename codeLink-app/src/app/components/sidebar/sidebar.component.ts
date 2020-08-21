import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    @Output() createNew = new EventEmitter<string>();
    @Output() createNewSnippet = new EventEmitter<void>();
    @Output() navigate = new EventEmitter<string>();
    @Output() root = new EventEmitter<void>();
    @Input() folders = [];
    @Input() plan = '';
    toggleSidebar: boolean;
    activeFolder: string;

    constructor(private _sidebarService: SidebarService) {
        this._sidebarService.hideSidebar.subscribe(
            (toggleSidebar) => (this.toggleSidebar = toggleSidebar)
        );
    }

    ngOnInit(): void {}

    new(type: string) {
        this.createNew.emit(type);
    }

    newSnippet() {
        this.createNewSnippet.emit();
    }

    active(event) {
        if (event.target.id) {
            this.activeFolder = event.target.id;

            this.navigate.emit(this.activeFolder);
        }
    }
}
