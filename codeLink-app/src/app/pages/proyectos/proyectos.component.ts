import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ProjectsService } from '../../services/projects.service';
import { User } from '../../interfaces/user.interface';
import { ToastrService } from '../../services/toastr.service';

declare const monaco: any;
@Component({
    selector: 'app-proyectos',
    templateUrl: './proyectos.component.html',
    styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {
    @ViewChild('iframe') iframe: ElementRef;

    editorHTML = {
        theme: 'vs-dark',
        wordWrap: 'on',
        tabCompletion: true,
        language: 'html',
    };

    editorCSS = {
        theme: 'vs-dark',
        wordWrap: 'on',
        tabCompletion: true,
        language: 'css',
        snippetSuggestions: { enabled: false }
    };
    editorJS = {
        theme: 'vs-dark',
        wordWrap: 'on',
        tabCompletion: true,
        language: 'javascript',
        snippetSuggestions: { enabled: false }
    };

    options: GridsterConfig;
    dashboard: Array<GridsterItem>;

    project: any = {};

    user: User;

    constructor(
        private route: ActivatedRoute,
        private _authService: AuthService,
        private _projectsService: ProjectsService,
        private _toastrService: ToastrService,
        private http: HttpClient
    ) {
        this.route.paramMap.subscribe(async (params) => {
            const _id = params.get('_id');

            this.user = this._authService.authUser();

            if (_id) {
                this.project = await this.http
                    .get(
                        `${environment.baseUrl}/project/${this.user._id}/${_id}`
                    )
                    .toPromise();

                this.renderProject();
            }
        });
    }

    ngOnInit(): void {
        this.options = {
            itemChangeCallback: ProyectosComponent.itemChange,
            itemResizeCallback: ProyectosComponent.itemResize,
            displayGrid: 'none',
            margin: 0
        };

        this.setLayout('left');
    }

    static itemChange(item, itemComponent) {
        //console.info('itemChanged', item, itemComponent);
    }

    static itemResize(item, itemComponent) {
        //console.info('itemResized', item, itemComponent);
    }

    setLayout(layout) {
        this.dashboard = [];
        switch (layout) {
            case 'left':
                this.dashboard = [
                    { cols: 1, rows: 1, y: 0, x: 0 },
                    { cols: 1, rows: 1, y: 1, x: 0 },
                    { cols: 1, rows: 1, y: 2, x: 0 },
                    { cols: 1, rows: 3, y: 0, x: 1 }
                ];
                break;
            case 'top':
                this.dashboard = [
                    { cols: 1, rows: 1, y: 0, x: 0 },
                    { cols: 1, rows: 1, y: 0, x: 1 },
                    { cols: 1, rows: 1, y: 0, x: 2 },
                    { cols: 3, rows: 1, y: 1, x: 0 }
                ];
                break;
            case 'bottom':
                this.dashboard = [
                    { cols: 1, rows: 1, y: 1, x: 0 },
                    { cols: 1, rows: 1, y: 1, x: 1 },
                    { cols: 1, rows: 1, y: 1, x: 2 },
                    { cols: 3, rows: 1, y: 0, x: 0 }
                ];
                break;
            case 'right':
                this.dashboard = [
                    { cols: 2, rows: 1, y: 0, x: 2 },
                    { cols: 2, rows: 1, y: 1, x: 2 },
                    { cols: 2, rows: 1, y: 2, x: 2 },
                    { cols: 2, rows: 3, y: 0, x: 0 }
                ];
                break;

            default:
                break;
        }
    }

    //Projects
    editProject() {
        this._projectsService
            .editProject(this.user._id, this.project)
            .then((project) => {
                this.project = project;
                this._toastrService.show({
                    message: 'Cambios guardados con exito!'
                });
            })
            .catch((err) =>
                this._toastrService.show({
                    message: err.error.message,
                    type: 'error'
                })
            );
    }

    renderProject() {
        const iframe = this.iframe.nativeElement;

        iframe.document =
            iframe.contentWindow.document || iframe.contentDocument;

        iframe.document.open();
        iframe.document.writeln(this.getSourceCode());
        iframe.document.close();
    }

    exportProject(type = '') {
        const sourceCode = this.getSourceCode(type);
        const file = new Blob([sourceCode], { type: `text/${type || 'html'}` });

        const fileURL = URL.createObjectURL(file);

        const link = document.createElement('a');

        link.download =
            this.project.name + `${type ? ' ' + type.toUpperCase() : ''}`;

        link.href = fileURL;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        this.editProject();
    }

    getSourceCode(type?) {
        switch (type) {
            case 'html':
                return this.project.html;

            case 'css':
                return this.project.css;

            case 'js':
                return this.project.js;
            default:
                return `
                <html>
                    <head>
                    <script>
                        ${this.project.js}
                    </script>
                    <style>
                        ${this.project.css}
                    </style>
                    </head>
                    <body>
                        ${this.project.html || ''}
                    </body>
                </html>
            `;
        }
    }
}
