import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Guide } from '../../models/guide';
import { Activity } from '../../models/activity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { AdminAddActivityModalComponent } from '../admin-add-activity-modal/admin-add-activity-modal.component';

@Component({
  selector: 'app-admin-guide-detail',
  templateUrl: './admin-guide-detail.component.html',
  styleUrl: './admin-guide-detail.component.css',
  imports: [CommonModule, FormsModule, AdminAddActivityModalComponent]
})
export class AdminGuideDetailComponent implements OnInit, OnDestroy {
  guide!: Guide;
  loading = false;
  currentGuideId!: number;
  authorizedUsers: User[] = [];
  error = '';
  showAddActivityModal = false;

  // recherche inline
  showUserSearch = false;
  userSearchTerm = '';
  searchResults: User[] = [];
  searchLoading = false;
  searchError = '';
  private searchTimer: any = null;

  @ViewChild('userSearchInput') userSearchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.currentGuideId = parseInt(id, 10);
      this.loadGuide(this.currentGuideId);
      this.loadUsers(this.currentGuideId);
    }
  }

  ngOnDestroy(): void {
    if (this.searchTimer) clearTimeout(this.searchTimer);
  }

  loadGuide(id: number) {
    this.loading = true;
    this.api.getGuide(id).subscribe({
      next: (g) => {
        this.guide = g;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Impossible de charger le guide.';
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadUsers(guideId: number) {
    this.api.getGuideUsers(guideId).subscribe({
      next: (users) => {
        this.authorizedUsers = users;
        this.cdr.markForCheck();
      },
      error: () => {
        this.error = 'Aucun utilisateur associé à ce guide';
        this.loading = false;
        this.cdr.markForCheck();
      }
    })
  }

  openAddActivityModal() {
    this.showAddActivityModal = true;
  }

  closeAddActivityModal() {
    this.showAddActivityModal = false;
  }

  onActivitySaved(saved: any) {
    // rafraîchir le guide pour afficher la nouvelle activité
    this.closeAddActivityModal();
    this.loadGuide(this.currentGuideId);
  }

  edit() {
    if (!this.currentGuideId) return;
    this.router.navigate(['/admin/guides/', this.currentGuideId, 'edit']);
  }

  deleteGuide() {
    if (!this.guide?.id) return;
    if (!confirm('Supprimer ce guide ?')) return;
    this.api.deleteGuide(this.guide.id).subscribe({
      next: () => this.router.navigate(['/admin/guides']),
      error: () => alert('Erreur lors de la suppression.')
    });
  }

  addActivity() {
    const title = prompt('Titre de l\'activité');
    if (!title || !this.guide?.id) return;
    const payload: Activity = { titre: title } as any;
    this.api.addActivityToGuide(this.guide.id as any, payload).subscribe({
      next: () => this.loadGuide(this.currentGuideId),
      error: () => alert('Erreur lors de l\'ajout de l\'activité')
    });
  }

  // --- recherche / association d'utilisateur inline ---
  toggleUserSearch() {
    this.showUserSearch = !this.showUserSearch;
    this.userSearchTerm = '';
    this.searchResults = [];
    this.searchError = '';
    if (this.showUserSearch) {
      // focus input après affichage
      setTimeout(() => this.userSearchInput?.nativeElement?.focus(), 0);
    }
  }

  onUserSearchInput() {
    if (this.searchTimer) clearTimeout(this.searchTimer);
    // debounce
    this.searchTimer = setTimeout(() => this.performSearch(), 300);
  }

  performSearch() {
    const term = this.userSearchTerm.trim().toLowerCase();
    if (!term) {
      this.searchResults = [];
      this.searchLoading = false;
      this.cdr.markForCheck();
      return;
    }

    this.searchLoading = true;
    this.searchError = '';

    // Récupérer tous les users puis filtrer côté client (API peut être adaptée pour supporter un param q)
    this.api.getUsers().subscribe({
      next: (users) => {
        const alreadyIds = new Set((this.authorizedUsers || []).map(u => u.id));
        this.searchResults = (users || [])
          .filter(u => {
            // filtrage basique sur email et id ; adaptez si vous avez firstname/lastname
            const email = (u as any).email || '';
            return (String(email).toLowerCase().includes(term) || String(u.id).includes(term));
          })
          // retirer ceux déjà associés
          .filter(u => !alreadyIds.has(u.id));
        this.searchLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.searchError = 'Erreur lors de la recherche des utilisateurs';
        this.searchLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  addExistingUserToGuide(user: User) {
    if (!this.currentGuideId || !user?.id) return;
    if (!confirm(`Associer ${user.email} à ce guide ?`)) return;
    this.api.addUserToGuide(this.currentGuideId, user.id).subscribe({
      next: (updatedGuide) => {
        // recharger le guide et masquer la recherche
        this.loadGuide(this.currentGuideId);
        this.loadUsers(this.currentGuideId);
        this.showUserSearch = false;
        this.userSearchTerm = '';
      },
      error: () => alert('Erreur lors de l\'association de l\'utilisateur.')
    });
  }

  // suppression utilisateur déjà implémentée ailleurs dans le composant
  deleteUserFromGuide(userId: number) {
    if (!this.currentGuideId) return;
    if (!confirm('Supprimer cet utilisateur de ce guide ?')) return;
    this.api.deleteUserFromGuide(this.currentGuideId, userId).subscribe({
      next: () => {
        this.loadGuide(this.currentGuideId);
        this.loadUsers(this.currentGuideId);
        this.cdr.markForCheck();
      },
      error: () => alert('Erreur lors de la suppression.')
    });
  }

  deleteActivityFromGuide(activityId: number) {
    if (!this.currentGuideId) return;
    if (!confirm('Supprimer cette activité ?')) return;
    this.api.deleteActivityFromGuide(this.currentGuideId, activityId).subscribe({
      next: () => this.loadGuide(this.currentGuideId),
      error: () => alert('Erreur lors de la suppression.')
    });
  }

  navBack() {
    this.router.navigate(['/admin/guides']);
  }
}