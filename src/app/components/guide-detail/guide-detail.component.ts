import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Guide } from '../../models/guide';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guide-detail',
  templateUrl: './guide-detail.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class GuideDetailComponent implements OnInit {
  guide?: Guide;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) { this.error = 'Invalid guide id'; this.loading = false; return; }
    this.api.getGuide(id).subscribe({
      next: g => { this.guide = g; this.loading = false; },
      error: e => { this.error = 'Unable to load guide'; this.loading = false; }
    });
  }
}
