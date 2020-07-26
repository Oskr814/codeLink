import {
    Component,
    OnInit,
    AfterViewInit,
    ViewChild,
    ElementRef
} from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';

//Ace code editor
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/ext-beautify';
//Lenguajes
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-css';
import 'ace-builds/src-noconflict/mode-javascript';

import 'ace-builds/src-noconflict/theme-monokai';

const THEME = 'ace/theme/monokai';
const HTML = 'ace/mode/html';
const CSS = 'ace/mode/css';
const JS = 'ace/mode/javascript';

@Component({
    selector: 'app-proyectos',
    templateUrl: './proyectos.component.html',
    styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit, AfterViewInit {
    @ViewChild('codeEditorHTML') codeEditorHTMLRef: ElementRef;
    @ViewChild('codeEditorCSS') codeEditorCSSRef: ElementRef;
    @ViewChild('codeEditorJS') codeEditorJSRef: ElementRef;

    private codeEditorHTML: ace.Ace.Editor;
    private codeEditorCSS: ace.Ace.Editor;
    private codeEditorJS: ace.Ace.Editor;
    private editorBeautify;

    options: GridsterConfig;
    dashboard: Array<GridsterItem>;

    constructor() {}

    ngOnInit(): void {
        //Gridster
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
            { cols: 1, rows: 1, y: 0, x: 0 },
            { cols: 1, rows: 1, y: 1, x: 0 },
            { cols: 1, rows: 1, y: 2, x: 0 },
            { cols: 2, rows: 3, y: 0, x: 1 }
        ];
    }

    static itemChange(item, itemComponent) {
        console.info('itemChanged', item, itemComponent);
    }

    static itemResize(item, itemComponent) {
        console.info('itemResized', item, itemComponent);
    }

    ngAfterViewInit() {
        //Ace editor
        ace.require('ace/ext/language_tools');
        this.editorBeautify = ace.require('ace/ext/beautify');

        //Inicializar editores
        const htmlElement = this.codeEditorHTMLRef.nativeElement;
        const cssElement = this.codeEditorCSSRef.nativeElement;
        const jsElement = this.codeEditorJSRef.nativeElement;

        const editors = [
            { aceEditor: this.codeEditorHTML, ref: htmlElement, lang: HTML },
            { aceEditor: this.codeEditorCSS, ref: cssElement, lang: CSS },
            { aceEditor: this.codeEditorJS, ref: jsElement, lang: JS }
        ];

        const editorOptions = this.getEditorOptions();

        for (const editor of editors) {
            editor.aceEditor = ace.edit(editor.ref, editorOptions);
            editor.aceEditor.setTheme(THEME);
            editor.aceEditor.getSession().setMode(editor.lang);
            editor.aceEditor.setShowFoldWidgets(true);
        }
    }

    private getEditorOptions(): Partial<ace.Ace.EditorOptions> & {
        enableBasicAutocompletion?: boolean;
    } {
        const basicEditorOptions: Partial<ace.Ace.EditorOptions> = {
            highlightActiveLine: true,
            minLines: 14,
            maxLines: Infinity
        };

        const extraEditorOptions = {
            enableBasicAutocompletion: true
        };
        const options = Object.assign(basicEditorOptions, extraEditorOptions);
        return options;
    }

    private getCode() {
        ///const code = this.codeEditor.getValue();
        //console.log(code);
    }
}
