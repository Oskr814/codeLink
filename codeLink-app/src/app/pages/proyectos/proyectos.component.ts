import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { ProjectsService } from '../../services/projects.service';
import { User } from '../../interfaces/user.interface';

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
        language: 'html',
        minimap: { enabled: false },
        wordWrap: 'on',
        tabCompletion: true
    };
    editorCSS = { theme: 'vs-dark', language: 'css' };
    editorJS = { theme: 'vs-dark', language: 'javascript' };

    options: GridsterConfig;
    dashboard: Array<GridsterItem>;

    project: any = {};

    user: User;

    constructor(
        private route: ActivatedRoute,
        private _authService: AuthService,
        private _projectsService: ProjectsService,
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
            pushItems: true,
            pushResizeItems: true,
            pushDirections: {
                north: true,
                east: true,
                south: true,
                west: true
            },
            resizable: {
                enabled: true,
                handles: {
                    s: true,
                    e: true,
                    n: true,
                    w: true,
                    se: true,
                    ne: true,
                    sw: true,
                    nw: true
                }
            },
            displayGrid: 'none'
        };

        this.dashboard = [
            { cols: 2, rows: 1, y: 0, x: 0 },
            { cols: 2, rows: 1, y: 1, x: 0 },
            { cols: 2, rows: 1, y: 2, x: 0 },
            { cols: 2, rows: 3, y: 0, x: 1 }
        ];
    }

    static itemChange(item, itemComponent) {
        //console.info('itemChanged', item, itemComponent);
    }

    static itemResize(item, itemComponent) {
        //console.info('itemResized', item, itemComponent);
    }

    //Projects
    saveProject() {
        this._projectsService
            .saveProject(this.user._id, this.project)
            .then((project) => {
                this.project = project;
            });
    }

    renderProject() {
        const iframe = this.iframe.nativeElement;

        iframe.document =
            iframe.contentWindow.document || iframe.contentDocument;

        const iframeSource = `
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

        iframe.document.open();
        iframe.document.writeln(iframeSource);
        iframe.document.close();
    }
}
