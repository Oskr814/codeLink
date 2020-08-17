import { Component, OnInit, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SidebarService } from '../../services/sidebar.service';
import { User } from '../../interfaces/user.interface';
import { AuthService } from '../../services/auth.service';
import { FoldersService } from '../../services/folders.service';
import { ProjectsService } from '../../services/projects.service';
import { ToastrService } from '../../services/toastr.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    activeFolder: string;
    modalItemData: { title: string; type: string; item: any };

    list: boolean = true;

    deviceResolution: number;

    toggleSidebar: boolean;

    user: User;

    root = [];

    folders = [];

    projects = [];

    recentProjects = [];

    actualRoute;

    folder_id: string;

    name: string = '';

    search = '';

    constructor(
        private modalService: NgbModal,
        private _sidebarService: SidebarService,
        private _authService: AuthService,
        private _foldersService: FoldersService,
        private _projectsService: ProjectsService,
        private _toastrService: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this._sidebarService.hideSidebar.subscribe(
            (toggle) => (this.toggleSidebar = toggle)
        );

        this.init();
    }

    ngOnInit(): void {
        this.deviceResolution = window.innerWidth;

        this.list = this.deviceResolution > 576;
    }

    init() {
        this.user = this._authService.authUser();

        this._projectsService
            .getRecentsProjects(this.user._id)
            .then((projects: any) => (this.recentProjects = projects));

        this.route.queryParams.subscribe((params) => {
            this.folder_id = params['folder'] || '';
            this.getFolderContent(this.folder_id);
        });

        this.router.events.subscribe((event: NavigationEnd) => {
            if (event.url) {
                this.actualRoute = event.url;
            }
        });
    }

    navigate() {
        this.location.back();
    }

    getFolderContent(folder_id?) {
        this._foldersService
            .getFolderContent(this.user._id, folder_id || '')
            .then((folder: any) => {
                this.folders = folder.folders;
                this.projects = folder.projects;

                if (folder_id) {
                    this.router.navigate([], {
                        relativeTo: this.route,
                        queryParams: {
                            folder: folder_id
                        },
                        queryParamsHandling: 'merge'
                    });
                } else {
                    this.root = folder.folders;
                }
            });
    }

    loadProject(project) {
        this._projectsService.loadProject(project._id);
    }

    newItem() {
        if (this.modalItemData.type == 'carpeta') {
            this._foldersService
                .newFolder(this.user._id, this.name, this.folder_id)
                .then((folder) => {
                    this.folders.push(folder);

                    if (!this.folder_id) {
                        this.root = this.folders;
                    }
                    this.name = '';
                    this.modalService.dismissAll();
                });
        } else {
            this._projectsService
                .newProject(this.user._id, this.name, this.folder_id)
                .then((project) => {
                    this.projects.push(project);
                    this.name = '';
                    this.modalService.dismissAll();
                });
        }
    }

    editItem() {
        let item = this.modalItemData.item;
        if (this.modalItemData.type == 'carpeta') {
            const folderInxed = this.folders.findIndex(
                (folder) => folder._id == item._id
            );

            this._foldersService
                .editFolder(this.user._id, { _id: item._id, name: this.name })
                .then((folder) => {
                    this.folders.splice(folderInxed, 1, folder);

                    if (!this.folder_id) {
                        this.root = this.folders;
                    }

                    this.name = '';
                    this.modalService.dismissAll();

                    this._toastrService.show({
                        message: 'Carpeta editada con exito!'
                    });
                })
                .catch((err) =>
                    this._toastrService.show({
                        message: err.error.message,
                        type: 'error'
                    })
                );
        } else {
            const projectIndex = this.projects.findIndex(
                (project) => project._id == item._id
            );

            this._projectsService
                .editProject(this.user._id, { _id: item._id, name: this.name })
                .then((project) => {
                    this.projects.splice(projectIndex, 1, project);
                    this.name = '';
                    this.modalService.dismissAll();

                    this._toastrService.show({
                        message: 'Proyecto editado con exito!'
                    });
                })
                .catch((err) =>
                    this._toastrService.show({
                        message: err.error.message,
                        type: 'error'
                    })
                );
        }
    }

    deleteItem() {
        let item = this.modalItemData.item;

        if (this.modalItemData.type == 'carpeta') {
            const folderInxed = this.folders.findIndex(
                (folder) => folder._id == item._id
            );

            this._foldersService
                .deleteFolder(this.user._id, item._id)
                .then((res) => {
                    this.folders.splice(folderInxed, 1);

                    if (!this.folder_id) {
                        this.root = this.folders;
                    }

                    this.name = '';
                    this.modalService.dismissAll();
                    this._toastrService.show({
                        message: 'Carpeta eliminada con exito!'
                    });
                })
                .catch((err) =>
                    this._toastrService.show({
                        message: err.error.message,
                        type: 'error'
                    })
                );
        } else {
            const projectIndex = this.projects.findIndex(
                (project) => project._id == item._id
            );

            this._projectsService
                .deleteProject(this.user._id, item._id)
                .then((res) => {
                    this.projects.splice(projectIndex, 1);
                    this.name = '';
                    this.modalService.dismissAll();
                    this._toastrService.show({
                        message: 'Proyecto eliminado con exito!'
                    });
                })
                .catch((err) =>
                    this._toastrService.show({
                        message: err.error.message,
                        type: 'error'
                    })
                );
        }
    }

    active(event) {
        this.activeFolder = event.target.id;
    }

    openModal(content, type, item = null) {
        if (type == 'carpeta') {
            this.modalItemData = {
                title: 'Nueva carpeta',
                type,
                item
            };
        } else {
            this.modalItemData = {
                title: 'Nuevo proyecto',
                type,
                item
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
