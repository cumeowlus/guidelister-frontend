import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: false
})
export class HeaderComponent implements OnInit {
  userEmail = '';

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.api.me().subscribe({
      next: (u: User) => this.userEmail = u.email,
      error: () => this.userEmail = ''
    });
  }

  logout() {
    this.api.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
