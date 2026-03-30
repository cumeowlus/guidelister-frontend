import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html'
})
export class AdminUsersListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.api.getUsers().subscribe({
      next: u => { this.users = u || []; this.loading = false; },
      error: () => { this.error = 'Impossible de charger les utilisateurs'; this.loading = false; }
    });
  }

  deleteUser(u: User) {
    if (!u.id) return;
    if (!confirm(`Supprimer l'utilisateur ${u.email} ?`)) return;
    this.api.deleteUser(u.id).subscribe({
      next: () => this.loadUsers(),
      error: () => alert('Erreur lors de la suppression.')
    });
  }

  addUser() {
    this.router.navigate(['/admin/users/new']);
  }
}