import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private _loaderService: LoaderService) {
    this._loaderService.isLoading.subscribe( action => {
      if(action) {
        return this.spinner.show();
      }

      setTimeout(() => {
        this.spinner.hide();
      }, 0);
    });
  }

  ngOnInit(): void {
  }

}
