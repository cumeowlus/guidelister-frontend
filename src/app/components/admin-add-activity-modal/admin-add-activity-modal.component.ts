import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin-add-activity-modal',
    templateUrl: './admin-add-activity-modal.component.html',
    imports: [FormsModule]
})
export class AdminAddActivityModalComponent {
    @Input() guideId!: number | string;
    @Output() saved = new EventEmitter<any>(); // émet l'activité créée (ou la réponse du backend)
    @Output() close = new EventEmitter<void>();

    submitting = false;
    error = '';

    // modèle du formulaire — noms de champs inchangés (titre, ordreVisite, ...)
    activity: any = {
        titre: '',
        ordreVisite: null,
        description: '',
        adresse: '',
        categorie: '',
        horaires: '',
        nbJours: 1,
        siteWeb: '',
        telephone: ''
    };

    constructor(private api: ApiService) { }

    submit(form: NgForm) {
        if (form.invalid) return;
        if (!this.guideId) {
            this.error = 'Identifiant du guide manquant';
            return;
        }
        this.submitting = true;
        this.error = '';

        // n'altère pas les noms de champs — envoie tel quel
        this.api.addActivityToGuide(this.guideId, this.activity).subscribe({
            next: (res) => {
                this.submitting = false;
                this.saved.emit(res);
            },
            error: (err) => {
                this.submitting = false;
                this.error = err?.error?.error || err?.message || 'Erreur lors de la création de l\'activité';
            }
        });
    }

    onClose() {
        this.close.emit();
    }
}