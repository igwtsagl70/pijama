import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent implements OnInit {
  isOpen = false;
  isOpenMain = true;
  isSelected: boolean[] = [
      false,
      false,
      false,
      false,
      false,
      false
  ];

  constructor() { }

  ngOnInit() {
  }

  open(option: number) {
      this.isOpen = true;
      this.isOpenMain = false;
      this.isSelected[option] = true;
  }

  close(option: number) {
      this.isOpen = false;
      this.isOpenMain = true;
      this.isSelected[option] = false;
  }

}
