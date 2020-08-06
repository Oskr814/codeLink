import { Component, OnInit, Input, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService } from '../../services/sidebar.service';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { FoldersService } from '../../services/folders.service';
import { ProjectsService } from '../../services/projects.service';

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

    folders = [];

    projects = [];

    navigation = [
        {
            _id: null,
            name: '/'
        }
    ];

    name: string = '';

    search = '';

    constructor(
        private modalService: NgbModal,
        private _sidebarService: SidebarService,
        private _authService: AuthService,
        private _foldersService: FoldersService,
        private _projectsService: ProjectsService
    ) {
        this._sidebarService.hideSidebar.subscribe(
            (toggle) => (this.toggleSidebar = toggle)
        );

        this.user = this._authService.authUser();

        this._foldersService
            .getFolderContent(this.user._id)
            .then((folder: any) => {
                this.folders = folder.folders;
                this.projects = folder.projects;
            });
    }

    ngOnInit(): void {
        this.deviceResolution = window.innerWidth;

        this.list = this.deviceResolution > 576;
    }

    navigate() {
        console.log('nav');

        if (this.navigation.length > 1) this.navigation.pop();
        const folder = this.navigation.splice(-1)[0];
        this.getFolderContent(folder);
    }

    getFolderContent(folder) {
        this.navigation.push({ _id: folder._id, name: folder.name });

        this._foldersService
            .getFolderContent(this.user._id, folder._id || '')
            .then((folder: any) => {
                this.folders = folder.folders;
                this.projects = folder.projects;
            });
    }

    loadProject(project) {
        this._projectsService.loadProject(project._id);
    }

    newItem() {
        const folder_id = this.navigation.slice(-1)[0]._id;

        if (this.modalText.type == 'folder') {
            this._foldersService
                .newFolder(this.user._id, this.name, folder_id)
                .then((folder) => {
                    this.folders.push(folder);
                    this.name = '';
                    this.modalService.dismissAll();
                });
        } else {
            this._projectsService.newProject(this.user._id, this.name, folder_id)
            .then( project => {
                this.projects.push(project)
                this.name = '';
                this.modalService.dismissAll();
            })
        }


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

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.deviceResolution = window.innerWidth;

        this.list = this.deviceResolution > 576;
    }
}
