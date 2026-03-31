import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrl: './admin-users-list.component.css',
  imports: [CommonModule]
})
export class AdminUsersListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.api.getUsers().subscribe({
      next: u => {
        this.users = (u || []).map(user => this.normalizeUser(user));
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Impossible de charger les utilisateurs';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  deleteUser(u: User) {
    if (!u.id) return;
    if (!confirm(`Supprimer l'utilisateur ${u.email} ?`)) return;
    this.api.deleteUser(u.id).subscribe({
      next: () => {
        this.loadUsers(),
          this.cdr.markForCheck();
      },
      error: () => alert('Erreur lors de la suppression.')
    });
  }

  addUser() {
    this.router.navigate(['/admin/users/new']);
  }

  private normalizeUser(u: any): User {
    // Normalise différents noms possibles renvoyés par le backend et force un booléen
    const isAdminValue = u?.isAdmin ?? u?.admin ?? u?.is_admin;
    return {
      ...u,
      isAdmin: !!(isAdminValue === true || isAdminValue === 'true' || isAdminValue === 1 || isAdminValue === '1')
    };
  }

  navBack() {
    this.router.navigate(['/admin']);
  }
}