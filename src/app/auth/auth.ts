import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { FirebaseService } from '../services/firebase.service';
import { User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

function validation(control: AbstractControl) {
   const value = control.value || '';

  return value.includes('?')
    ? null
    : { mustInclude: '?' };

};

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth.html'
})
export class Auth implements OnInit {
  authForm: FormGroup;
  user$: Observable<User | null>;
  errorMessage = '';
  returnUrl: string = '/liste-products';

  constructor(
    private fb: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.user$ = this.fb.user$;

    this.authForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6), validation])
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/liste-products';
  }

  private get email() {
    return this.authForm.value.email;
  }

  private get password() {
    return this.authForm.value.password;
  }

  signup() {
    this.fb.signup(this.email, this.password).subscribe({
      next: () => {
        this.authForm.reset();
        this.errorMessage = '';
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        console.error('Signup error', err);
        this.errorMessage = err.message;
      }
    });
  }

  login() {
    this.fb.login(this.email, this.password).subscribe({
      next: () => {
        this.authForm.reset();
        this.errorMessage = '';
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        console.error('Login error', err);
        this.errorMessage = err.message;
      }
    });
  }

  logout() {
    this.fb.logout().subscribe();
  }
}
