import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { EmailService } from '../email-service';
import { AuthService } from '../auth.service';
import { SuccessDialogComponent } from '../success-dialog/success-dialog.component';
import { Router } from '@angular/router'; // Import the Router module

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  contactForm: FormGroup;
  isAuthenticated = false;
public: any;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private dialog: MatDialog,
    public authService: AuthService,
    private router: Router // Add the Router module as a dependency
  ) {
    this.contactForm = this.fb.group({
      topic: ['', Validators.required],
      name: ['', Validators.required],
      surname: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    this.authService.checkAuth().subscribe(response => {
      this.isAuthenticated = response.authenticated;
    });
  }

  onLogout() {
    this.authService.logout().subscribe(response => {
      console.log('Logout successful', response);
      this.isAuthenticated = false;
      this.router.navigate(['/']);
    }, error => {
      console.error('Logout error', error);
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.emailService.sendContactForm(this.contactForm.value).subscribe(response => {
        this.contactForm.reset(); // Clear the form
        // this.dialog.open(SuccessDialogComponent); // Open the success dialog
      }, error => {
        console.error('Error submitting form', error);
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
