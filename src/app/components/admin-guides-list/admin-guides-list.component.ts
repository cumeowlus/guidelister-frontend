import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Guide } from '../../models/guide';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-guides-list',
  templateUrl: './admin-guides-list.component.html',
  styles: './admin-guides-list.component.css',
  imports: [FormsModule, CommonModule]
})
export class AdminGuidesListComponent implements OnInit {
  guides: Guide[] = [];
  filter = '';
  filtered: Guide[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadGuides();
  }

  loadGuides() {
    this.loading = true;
    this.api.getAllGuides().subscribe({
      next: (g) => {
        this.guides = g;
        this.filtered = g;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Impossible de charger les guides', err);
        this.cdr.markForCheck();
      }
    });
  }

  applyFilter() {
    const q = this.filter.toLowerCase().trim();
    this.filtered = this.guides.filter(g =>
      (g.titre ?? '').toLowerCase().includes(q) ||
      (g.description ?? '').toLowerCase().includes(q)
    );
  }

  openGuide(g: Guide) {
    if (!g.id) return;
    this.router.navigate(['/admin/guides', g.id]);
  }

  addGuide() {
    this.router.navigate(['/admin/guides/new']);
  }
}