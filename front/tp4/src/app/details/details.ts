import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PollutionService } from '../../services/pollution.service';
import { Pollution } from '../../models/pollution';

@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit {
  pollution: Pollution | null = null;
  pollutionId: number = 0;
  isLoading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pollutionService: PollutionService
  ) {}

  ngOnInit() {
  
    // Method 2: Using observable (for dynamic parameters - recommended)
    // This will update if the parameter changes while staying on the same component
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.pollutionId = id ? Number(id) : 0;
      if (this.pollutionId) {
        this.loadPollutionDetails();
      }
    });
  }

  loadPollutionDetails() {
    this.isLoading = true;
    this.error = '';
    
    this.pollutionService.getPollutionById(this.pollutionId).subscribe({
      next: (data) => {
        this.pollution = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des détails:', err);
        this.error = 'Impossible de charger les détails de la pollution';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/accueil']);
  }

  editPollution() {
    if (this.pollutionId) {
      this.router.navigate(['/pollution-form', this.pollutionId]);
    }
  }
}
