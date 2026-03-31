import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Guide } from '../../models/guide';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-guide-detail',
  templateUrl: './guide-detail.component.html',
  styleUrl: './guide-detail.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class GuideDetailComponent implements OnInit {

  guide?: Guide;
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private api: ApiService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getGuide(id).subscribe({
      next: g => {
        this.guide = g;
        this.loading = false;
        this.cdr.markForCheck();

        console.log('Guide :', g);
      },
      error: e => {
        this.error = 'Unable to load guide';
        this.loading = false;
        this.cdr.markForCheck();

      }
    });
  }

  navBack() {
    this.router.navigate(['/my-guides']);
  }
}
