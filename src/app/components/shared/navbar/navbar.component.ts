import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  logoUrl = 'assets/images/logo-dark.png';
  constructor() {}

  ngOnInit(): void {}
}
