import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService } from '../../services/sidebar.service';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { FoldersService } from '../../services/folders.service';

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

    user: User;

    folders: [];

    projects: [];

    navigation = [
        {
            _id: '',
            name: '/'
        }
    ];

    search = '';

    constructor(
        private modalService: NgbModal,
        private _sidebarService: SidebarService,
        private _authService: AuthService,
        private _foldersService: FoldersService
    ) {
        this._sidebarService.hideSidebar.subscribe(
            (toggle) => (this.toggleSidebar = toggle)
        );

        this.user = this._authService.authUser();

        this._foldersService
            .getFolderContent(this.user._id)
            .then((folder: any) => {
                this.folders = folder.folders;
                console.log(folder);

                this.projects = folder.projects;
            });
    }

    ngOnInit(): void {
        this.deviceResolution = window.innerWidth;

        this.list = this.deviceResolution > 576;
    }

    getFolderContent(folder) {
        this.navigation.push({ _id: folder._id, name: folder.name });

        this._foldersService
            .getFolderContent(this.user._id, folder._id)
            .then((folder: any) => {
                this.folders = folder.folders;
                this.projects = folder.projects;
            });
    }

    navigate() {
        console.log('nav');
        
        if (this.navigation.length > 1) this.navigation.pop();
        const folder = this.navigation.splice(-1)[0];
        this.getFolderContent(folder);
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
