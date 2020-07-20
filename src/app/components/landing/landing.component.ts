import { Component, OnInit } from "@angular/core";
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "ngx-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  faCoffee = faCoffee;
  sampleCodes = [
    {
      type: "html",
      code: 
      `<div id="codeLink">
  Hola mundo!
</div>
<h1>codeLink</h1>`,
    },
    {
      type: "js",
      code: 
      `let nombre = 'Link';
const info = 
getInfo(nombre);
console.log(info);`,
    },
    {
      type: "css",
      code: `div { 
      font-size: 18px;
      color: #171C19;
    }`
    },
  ];
  caracteristicas = [
    {
      titulo: "Centralizado",
      descripcion: "Todo lo que necesitas en un solo lugar, solo haz lo tuyo!",
      imagen: "assets/images/landing/caracteristica-all-in-one.png",
    },
    {
      titulo: "Rapido",
      descripcion: "Mas rapido que un entorno de desarrollo tradicional",
      imagen: "assets/images/landing/caracteristica-fast.png",
    },
    {
      titulo: "Intuitivo",
      descripcion:
        "Interfaz intuitiva y amigable, no necesitas ser un experto para empezar a trabajar!",
      imagen: "assets/images/landing/caracteristica-ux.png",
    },
  ];

  constructor() {}

  ngOnInit(): void {}
  ngAfterViewInit() {}
}
