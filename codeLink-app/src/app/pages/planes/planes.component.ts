import { Component, OnInit } from '@angular/core';
import { Plans } from '../../interfaces/plans.interface';

@Component({
  selector: 'app-planes',
  templateUrl: './planes.component.html',
  styleUrls: ['./planes.component.scss']
})
export class PlanesComponent implements OnInit {

  plans:Array<Plans> = [
    {
      title: 'Plan basico',
      price: 'Free',
      subtitle: 'Ideal para aventureros',
      features: ['Almacenamiento en la nube', 'Exportar proyecto', 'Proyectos ilimitados', 'Lineas de codigo ilimitadas']
    },
    {
      title: 'Plan estandar',
      price: '$3/Mes',
      subtitle: 'Ideal para entusiastas',
      features: ['Almacenamiento en la nube', 'Exportar proyecto', 'Proyectos ilimitados', 'Lineas de codigo ilimitadas']
    },
    {
      title: 'Plan premium',
      price: '$5/Mes',
      subtitle: 'Sin limites!',
      features: ['Almacenamiento en la nube', 'Exportar proyecto', 'Proyectos ilimitados', 'Lineas de codigo ilimitadas']
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
