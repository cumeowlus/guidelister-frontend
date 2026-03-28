import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Guide } from '../../models/guide';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    /*this.api.getGuides().subscribe(g => {
      this.guides = g; g.filter(guide => {
        return true;
      });
    });*/
    this.api.getGuides().subscribe({
      next: (g) => {
        console.log('guides from API', g, 'length', g.length);
        this.guides = g;
        this.filtered = g;
        console.log('guides var : ', this.guides)
      },
      error: (err) => console.error('getGuides error', err)
    });
  }

  applyFilter() {
    const q = this.filter.toLowerCase().trim();
    this.filtered = this.guides.filter(g => g.titre.toLowerCase().includes(q) || (g.description || '').toLowerCase().includes(q));
  }

  openGuide(id: number) {
    this.router.navigate(['/guide', id]);
  }
}
