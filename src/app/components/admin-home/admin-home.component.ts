import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html'
})
export class AdminHomeComponent {
  constructor(private router: Router) {}

  goToGuides() {
    this.router.navigate(['/admin/guides']);
  }

  goToUsers() {
    this.router.navigate(['/admin/users']);
  }
}