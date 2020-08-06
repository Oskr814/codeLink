import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-project-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterProjectComponent implements OnInit {
  @Output() layout = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  setLayout(layout) {
    this.layout.emit(layout);
  }

}
