import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user-form',
  templateUrl: './admin-user-form.component.html',
  imports: [FormsModule, CommonModule]
})
export class AdminUserFormComponent implements OnInit {
  form: FormGroup;
  guideId?: string | null = null;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      isAdmin: [false]
    });
  }

  ngOnInit(): void {
    this.guideId = this.route.snapshot.queryParamMap.get('guideId');
  }

  save() {
    if (this.form.invalid) return;
    this.submitting = true;
    const { email, password, isAdmin } = this.form.value;

    const register$ = isAdmin ? this.api.registerAdmin(email, password) : this.api.registerUser(email, password);

    register$.subscribe({
      next: (res: any) => {
        const createdId = res?.id;
        if (this.guideId && createdId) {
          // associer l'utilisateur au guide
          this.api.addUserToGuide(this.guideId, createdId).subscribe({
            next: () => this.router.navigate(['/admin/guides', this.guideId]),
            error: () => { alert('Utilisateur créé mais association au guide a échoué'); this.router.navigate(['/admin/users']); }
          });
        } else {
          this.router.navigate(['/admin/users']);
        }
      },
      error: (err) => {
        alert('Erreur lors de la création de l\'utilisateur');
        this.submitting = false;
      }
    });
  }

  goToAdminUsersInterface() {
    this.router.navigate(['/admin/users']);
  }
}