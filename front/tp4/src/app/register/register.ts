import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm!: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

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
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      login: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      pass: ['', [Validators.required, Validators.minLength(6)]],
      confirmPass: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('pass')?.value;
    const confirmPass = group.get('confirmPass')?.value;
    return pass === confirmPass ? null : { passwordMismatch: true };
  }

  // Vérifier la disponibilité du login en temps réel
  async checkLoginAvailability() {
    const loginControl = this.registerForm.get('login');
    if (loginControl?.valid && loginControl.value.length >= 3) {
      this.authService.checkLoginAvailability(loginControl.value).subscribe({
        next: (response) => {
          if (!response.available) {
            loginControl.setErrors({ loginTaken: true });
          }
        },
        error: (error) => {
          console.error('Erreur lors de la vérification du login:', error);
        }
      });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { nom, prenom, login, pass } = this.registerForm.value;
      
      const newUser = {
        nom: nom as string,
        prenom: prenom as string,
        login: login as string,
        pass: pass as string
      };

      this.authService.register(newUser).subscribe({
        next: (response) => {
          console.log('Inscription réussie:', response);
          this.successMessage = 'Inscription réussie ! Redirection vers la page de connexion...';
          
          // Rediriger vers la page de connexion après 2 secondes
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          console.error('Erreur lors de l\'inscription:', error);
          this.isLoading = false;
          
          if (error.status === 409) {
            this.errorMessage = 'Cet identifiant est déjà utilisé.';
          } else if (error.status === 400) {
            this.errorMessage = 'Données invalides. Veuillez vérifier le formulaire.';
          } else {
            this.errorMessage = 'Erreur lors de l\'inscription. Veuillez réessayer.';
          }
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get nom() { return this.registerForm.get('nom'); }
  get prenom() { return this.registerForm.get('prenom'); }
  get login() { return this.registerForm.get('login'); }
  get pass() { return this.registerForm.get('pass'); }
  get confirmPass() { return this.registerForm.get('confirmPass'); }
}
