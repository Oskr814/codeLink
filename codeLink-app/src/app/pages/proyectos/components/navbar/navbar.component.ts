import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-project-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarProjectComponent implements OnInit {
  @Input() name: string;
  @Output() updateName = new EventEmitter<string>();
  @Output() save = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();

  deviceResolution: number;


  constructor() { }

  ngOnInit(): void {
    this.deviceResolution = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
      this.deviceResolution = window.innerWidth;
  }

  setName(name) {
    this.updateName.emit(name);
  }

}
