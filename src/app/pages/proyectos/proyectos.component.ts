import { Component, OnInit } from '@angular/core';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';

@Component({
    selector: 'app-proyectos',
    templateUrl: './proyectos.component.html',
    styleUrls: ['./proyectos.component.scss']
})
export class ProyectosComponent implements OnInit {
    options: GridsterConfig;
    dashboard: Array<GridsterItem>;
    sampleCodes = [
        {
            type: 'html',
            code: `<div id="codeLink">
  Hola mundo!
</div>
<h1>codeLink</h1>`
        },
        {
            type: 'js',
            code: `let nombre = 'Link';
const info = 
getInfo(nombre);
console.log(info);`
        },
        {
            type: 'css',
            code: `div { 
      font-size: 18px;
      color: #171C19;
    }`
        }
    ];

    dimenssions: {};

    constructor() {}

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
}
