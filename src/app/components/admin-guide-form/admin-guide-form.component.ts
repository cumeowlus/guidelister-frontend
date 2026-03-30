import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Guide } from '../../models/guide';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-guide-form',
  templateUrl: './admin-guide-form.component.html',
  imports: [CommonModule, FormsModule]
})
export class AdminGuideFormComponent implements OnInit {
  guide: any = {};
  isEdit = false;
  guideId?: string;
  submitting = false;
  errorMessage = '';

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.guideId = id;
      this.loadGuide(id);
    } else {
      // valeurs par défaut pour la création
      this.guide = {
        titre: '',
        description: '',
        mobilite: '',
        nbJour: 1,
        publicCible: '',
        saison: ''
      };
    }
  }

  loadGuide(id: string) {
    this.api.getGuide(parseInt(id)).subscribe({
      next: (g) => {
        this.guide = {
          titre: (g as any).titre ?? (g as any).title ?? '',
          description: (g as any).description ?? (g as any).bio ?? '',
          mobilite: (g as any).mobilite ?? '',
          nbJour: (g as any).nbJour ?? (g as any).nbJours ?? 1,
          publicCible: (g as any).publicCible ?? '',
          saison: (g as any).saison ?? ''
        };
        this.cdr.markForCheck();

      },
      error: () => {
        this.errorMessage = 'Impossible de charger le guide pour édition.';
      }
    });
  }

  save(form: any) {
    // form is the NgForm object passed from template
    if (form.invalid) return;
    this.submitting = true;
    this.errorMessage = '';

    const payload: Partial<Guide> = {
      // envoyer les mêmes clés que le backend attend (ici on envoie titre/description/...).
      titre: this.guide.titre,
      description: this.guide.description,
      mobilite: this.guide.mobilite,
      nbJour: Number(this.guide.nbJour),
      publicCible: this.guide.publicCible,
      saison: this.guide.saison
    };

    if (this.isEdit && this.guideId) {
      this.api.updateGuide(this.guideId, payload).subscribe({
        next: () => this.router.navigate(['/admin/guides', this.guideId]),
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Erreur lors de la mise à jour.';
          this.submitting = false;
        }
      });
    } else {
      this.api.createGuide(payload as Guide).subscribe({
        next: (res) => {
          const createdId = res?.id;
          if (createdId) {
            this.router.navigate(['/admin/guides', createdId]);
          } else {
            this.router.navigate(['/admin/guides']);
          }
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Erreur lors de la création.';
          this.submitting = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/guides']);
  }
}