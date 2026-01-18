import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PollutionService } from '../../services/pollution.service';
import { Pollution } from '../../models/pollution';

@Component({
  selector: 'app-accueil',
  imports: [CommonModule, FormsModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {
  searchTerm: string = '';
  pollutions: Pollution[] = [];

  constructor(
    private pollutionService: PollutionService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadPollutions();
  }

  loadPollutions() {
    this.pollutionService.getPollutions().subscribe({
      next: (pollutions) => {
        this.pollutions = pollutions;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des pollutions:', error);
      }
    });
  }

  viewDetails(Id: number) {
    // Navigate to details page with the pollution ID as parameter
    this.router.navigate(['/details', Id]);
  }

  createPollution() {
    // Navigate to the pollution form for creating a new pollution
    this.router.navigate(['/pollution-form']);
  }

  modifyPollution(Id: number) {
    // Navigate to the pollution form with the pollution ID
    this.router.navigate(['/pollution-form', Id]);
  }

  deletePollution(Id: number, titre: string) {
    // Confirm before deleting
    if (confirm(`Êtes-vous sûr de vouloir supprimer la pollution "${titre}" ?`)) {
      this.pollutionService.deletePollution(Id).subscribe({
        next: () => {
          console.log('Pollution supprimée avec succès');
          // Reload the list after deletion
          this.loadPollutions();
          alert('Pollution supprimée avec succès');
        },
        error: (error) => {
          console.error('Erreur lors de la suppression:', error);
          alert('Erreur lors de la suppression de la pollution');
        }
      });
    }
  }

  getFilteredPollutions() {
    return this.pollutions.filter(pollution =>
      pollution.titre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}
