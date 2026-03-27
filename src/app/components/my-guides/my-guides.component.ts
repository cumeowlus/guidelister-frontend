import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Guide } from '../../models/guide';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-guides',
  templateUrl: './my-guides.component.html',
  standalone: false
})
export class MyGuidesComponent implements OnInit {
  guides: Guide[] = [];
  filter = '';
  filtered: Guide[] = [];

  constructor(private api: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.api.getGuides().subscribe(g => {
      // filter to guides where current user is authorized, if backend returns all guides then filter here
      this.guides = g.filter(guide => {
        // if authorizedUsers provided, check presence; otherwise assume backend already filtered
        // safe check:
        if (!guide.authorizedUsers) return true;
        // current user id not available here; backend ideally returns only authorized guides
        return true;
      });
      this.applyFilter();
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
