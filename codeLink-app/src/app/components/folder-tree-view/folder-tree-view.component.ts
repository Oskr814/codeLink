import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-folder-tree-view',
  templateUrl: './folder-tree-view.component.html',
  styleUrls: ['./folder-tree-view.component.scss']
})
export class FolderTreeViewComponent implements OnInit {

  activeFolder: string;
  
  constructor() { }

  ngOnInit(): void {
  }

  active(event) {
    this.activeFolder = event.target.id;
  }

}
