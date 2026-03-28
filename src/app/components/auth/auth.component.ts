import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class AuthComponent {
  email = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private router: Router) { }

  login() {
    this.error = '';
    this.api.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/my-guides']),
      error: (err) => this.error = err?.error?.error || 'Login failed'
    });
  }

  register() {
    this.error = '';
    this.api.registerUser(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/my-guides']),
      error: (err) => this.error = err?.error?.error || 'Register failed'
    });
  }
}
