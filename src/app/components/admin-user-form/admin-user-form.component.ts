import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin-user-form',
  templateUrl: './admin-user-form.component.html',
  imports: [FormsModule, CommonModule]
})
export class AdminUserFormComponent implements OnInit {
  user: any = {};
  password!: string;
  submitting = false;
  errorMessage: any;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void { }

  save(form: any) {
    if (form.invalid) return;
    this.submitting = true;

    const email = this.user.email;
    const isAdmin = !!this.user.isAdmin;
    const password = this.password;

    if (this.user.isAdmin) {
      this.api.registerAdmin(this.user.email, this.password).subscribe({
        next: () => this.router.navigate(['/admin/users']),
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Erreur lors de la création.';
          this.submitting = false;
        }
      })
    } else {
      this.api.registerUser(this.user.email, this.password).subscribe({
        next: () => this.router.navigate(['/admin/users']),
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Erreur lors de la création.';
          this.submitting = false;
        }
      })
    }
  }

  goToAdminUsersInterface() {
    this.router.navigate(['/admin/users']);
  }
}