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
import { SnippetsService } from '../../services/snippets.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MonacoLanguages } from '../../models/monaco-languages.model';

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

    editor = {
        theme: 'vs',
        wordWrap: 'on',
        tabCompletion: true,
        language: ''
    };

    monacoLanguages = new MonacoLanguages();

    user: User;

    root = [];

    folders = [];

    projects = [];

    snippets = [];

    snippet: FormGroup;

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
        private _snippetsService: SnippetsService,
        private _toastrService: ToastrService,
        private formBuilder: FormBuilder,
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

        this.getRecentProject();

        this.route.queryParams.subscribe((params) => {
            this.folder_id = params['folder'] || '';
            this.getFolderContent(this.folder_id);
        });

        this.router.events.subscribe((event: NavigationEnd) => {
            if (event.url) {
                this.actualRoute = event.url;
            }
        });

        this.snippet = this.formBuilder.group({
            _id: [''],
            name: ['', Validators.required],
            code: ['', Validators.required],
            language: [this.monacoLanguages.languages[0], Validators.required]
        });

        this.setEditorLanguage();
    }

    navigate() {
        this.location.back();
    }

    getRecentProject() {
        this._projectsService
            .getRecentsProjects(this.user._id)
            .then((projects: any) => (this.recentProjects = projects));
    }

    getFolderContent(folder_id?) {
        this._foldersService
            .getFolderContent(this.user._id, folder_id || '')
            .then((folder: any) => {
                this.folders = folder.folders;
                this.projects = folder.projects;
                this.snippets = folder.snippets;

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

                    this._toastrService.show({
                        message: 'Carpeta creada con exito!'
                    });
                })
                .catch((err) =>
                    this._toastrService.show({
                        message: err.error.message,
                        type: 'error'
                    })
                );
        } else {
            this._projectsService
                .newProject(this.user._id, this.name, this.folder_id)
                .then((project) => {
                    this.projects.push(project);
                    this.name = '';
                    this.modalService.dismissAll();

                    this._toastrService.show({
                        message: 'Proyecto creado con exito!'
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

                    this.getRecentProject();

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
        const item = this.modalItemData.item;
        const type = this.modalItemData.type;

        switch (type) {
            case 'carpeta':
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
                        this.getRecentProject();
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
                break;
            case 'proyecto':
                const projectIndex = this.projects.findIndex(
                    (project) => project._id == item._id
                );

                this._projectsService
                    .deleteProject(this.user._id, item._id)
                    .then((res) => {
                        this.projects.splice(projectIndex, 1);
                        this.name = '';
                        this.modalService.dismissAll();

                        this.getRecentProject();

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
                break;
            case 'snippet':
                const snippetIndex = this.snippets.findIndex(
                    (snippet) => snippet._id == item._id
                );

                this._snippetsService
                    .deleteSnippet(this.user._id, item._id)
                    .then((res) => {
                        this.snippets.splice(snippetIndex, 1);
                        this.snippet.reset();
                        this.snippet.get('language').setValue('javascript');
                        this.modalService.dismissAll();
                        this._toastrService.show({
                            message: 'Snippet eliminado con exito!'
                        });
                    })
                    .catch((err) =>
                        this._toastrService.show({
                            message: err.error.message,
                            type: 'error'
                        })
                    );
                break;

            default:
                break;
        }
    }

    openModalSnippet(content, type, item = null) {
        this.modalItemData = {
            title: 'Nuevo snippet',
            type,
            item
        };

        if (item) {
            this.snippet.setValue({
                _id: item._id,
                name: item.name,
                language: item.language,
                code: item.code
            });

            this.setEditorLanguage();
        }

        this.modalService.open(content, { centered: true, size: 'xl' });
    }

    newSnippet() {
        if (this.snippet.valid) {
            this._snippetsService
                .newSnippet(this.user._id, this.snippet.value, this.folder_id)
                .then((snippet) => {
                    this.snippets.push(snippet);

                    this.snippet.reset();

                    this.modalService.dismissAll();

                    this._toastrService.show({
                        message: 'Snippet creado con exito!'
                    });
                });
        }
    }

    editSnippet() {
        if (this.snippet.valid) {
            const snippetIndex = this.snippets.findIndex(
                (snippet) => snippet == this.snippet.get('_id').value
            );
            this._snippetsService
                .editSnippet(this.user._id, this.snippet.value)
                .then((snippet) => {
                    this.snippets.splice(snippetIndex, 1, snippet);

                    this.modalService.dismissAll();

                    this.snippet.reset();

                    this._toastrService.show({
                        message: 'Snippet editado con exito!'
                    });
                });
        }
    }

    setEditorLanguage() {
        const language = this.snippet.get('language').value;

        this.editor = {
            theme: 'vs-dark',
            wordWrap: 'on',
            tabCompletion: true,
            language
        };
    }

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.deviceResolution = window.innerWidth;

        this.list = this.deviceResolution > 576;
    }
}
