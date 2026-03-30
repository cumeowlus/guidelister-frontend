import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Guide } from '../../models/guide';
import { Activity } from '../../models/activity';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin-guide-detail',
  templateUrl: './admin-guide-detail.component.html',
  styleUrl: './admin-guide-detail.component.css',
  imports: [FormsModule, CommonModule]
})
export class AdminGuideDetailComponent implements OnInit {
  guide!: Guide;
  loading = false;
  currentGuideId!: number;
  authorizedUsers?: User[];
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.currentGuideId = parseInt(id);
      this.loadUsers(this.currentGuideId);
      this.loadGuide(this.currentGuideId);
    };
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
        this.loading = false
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

  addActivity(activity: Activity) {
    const title = prompt('Titre de l\'activité');
    if (!title || !this.guide?.id) return;
    this.api.addActivityToGuide(this.guide.id, activity).subscribe({
      next: () => this.loadGuide(this.currentGuideId),
      error: () => alert('Erreur lors de l\'ajout de l\'activité')
    });
  }

  addUser() {
    this.router.navigate(['/admin/users/new'], { queryParams: { guideId: this.guide?.id } });
  }

  deleteUserFromGuide(userId: number) {
    if (!this.currentGuideId) return;
    if (!confirm('Supprimer cet utilisateur de ce guide ?')) return;
    this.api.deleteUserFromGuide(this.currentGuideId, userId).subscribe({
      next: () => {
        this.router.navigate(['/admin/guides/', this.currentGuideId])
        this.loadGuide(this.currentGuideId);
        this.cdr.markForCheck();
      },
      error: () => alert('Erreur lors de la suppression.')

    });
  }

  deleteActivityFromGuide(activityId: number) {
    if (!this.currentGuideId) return;
    if (!confirm('Supprimer cette activité ?')) return;
    this.api.deleteActivityFromGuide(this.currentGuideId, activityId).subscribe({
      next: () => {
        this.loadGuide(this.currentGuideId);
      },
      error: () => alert('Erreur lors de la suppression.')

    });
  }
}