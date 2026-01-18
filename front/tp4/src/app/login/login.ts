import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Si déjà connecté, rediriger vers l'accueil
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/accueil']);
      return;
    }

    // Initialiser le formulaire
    this.loginForm = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3)]],
      pass: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { login, pass } = this.loginForm.value;

      this.authService.login(login, pass).subscribe({
        next: (response) => {
          console.log('Connexion réussie:', response);
          // Rediriger vers l'accueil
          this.router.navigate(['/accueil']);
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);
          this.isLoading = false;
          
          if (error.status === 401) {
            this.errorMessage = 'Mot de passe incorrect.';
          } else if (error.status === 404) {
            this.errorMessage = 'Utilisateur non trouvé.';
          } else {
            this.errorMessage = 'Erreur lors de la connexion. Veuillez réessayer.';
          }
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get login() { return this.loginForm.get('login'); }
  get pass() { return this.loginForm.get('pass'); }
}
