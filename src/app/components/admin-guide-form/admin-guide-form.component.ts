import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Guide } from '../../models/guide';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-guide-form',
  templateUrl: './admin-guide-form.component.html',
  imports: [FormsModule, CommonModule]
})
export class AdminGuideFormComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  guideId?: string;
  loading = false;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.email],
      phone: [''],
      bio: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.guideId = id;
      this.api.getGuide(parseInt(id)).subscribe(g => this.form.patchValue(g));
    }
  }

  save() {
    if (this.form.invalid) return;
    this.submitting = true;
    const payload: Partial<Guide> = this.form.value;
    if (this.isEdit && this.guideId) {
      this.api.updateGuide(this.guideId, payload).subscribe({
        next: () => this.router.navigate(['/admin/guides', this.guideId]),
        error: () => { alert('Erreur lors de la mise à jour.'); this.submitting = false; }
      });
    } else {
      // Nouveau guide via POST /api/guides/new (endpoint ajouté)
      this.api.createGuide(payload as Guide).subscribe({
        next: (res) => {
          // Si le backend retourne l'objet créé avec un id, naviguer vers le détail, sinon aller à la liste
          const createdId = res?.id;
          if (createdId) {
            this.router.navigate(['/admin/guides', createdId]);
          } else {
            this.router.navigate(['/admin/guides']);
          }
        },
        error: () => { alert('Erreur lors de la création du guide.'); this.submitting = false; }
      });
    }
  }

  goToAdminGuidesInterface() {
    this.router.navigate(['/admin/guides']);
  }
}