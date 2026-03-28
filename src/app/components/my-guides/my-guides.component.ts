import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Guide } from '../../models/guide';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';

@Component({
  selector: 'app-my-guides',
  templateUrl: './my-guides.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class MyGuidesComponent implements OnInit {
  guides: Guide[] = [];
  filter = '';
  filtered: Guide[] = [];
  user?: User;
  error = '';

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.api.me().subscribe({
      next: (u: User) => {
        this.user = u;
        this.api.getGuides(this.user.id).subscribe({
          next: (g) => {
            this.guides = g;
            this.filtered = g;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('getGuides error', err);
            this.cdr.markForCheck();
          }

        });
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

  openGuide(guideId: number) {
    this.router.navigate(['/my-guides', guideId]);
  }
}
