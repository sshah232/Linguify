import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;
  isLoginMode = true; // Switch between login and signup mode
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    const { username, password } = this.authForm.value;

    if (this.isLoginMode) {
      this.authService.login(username, password).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.errorMessage = 'Login failed. Please try again.';
        }
      });
    } else {
      this.authService.signup(username, password).subscribe({
        next: () => {
          this.router.navigate(['auth']);
        },
        error: (err) => {
          this.errorMessage = 'Signup failed. Please try again.';
        }
      });
    }
  }
}
