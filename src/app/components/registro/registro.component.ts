import { Component, OnInit } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  faEnvelope = faEnvelope;

  user: UserModel;

  constructor() { }

  ngOnInit(): void {
    this.user = new UserModel();

    this.user.email = 'oscar@gmail.com';
  }

  preRegistroUser() {
    console.log(this.user);
    
  }

}
