import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';

import { CustomValidators } from '@utils/validators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {
  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(6), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [ CustomValidators.MatchValidator('password', 'confirmPassword') ]
  });
  status: RequestStatus = 'init';
  statusUser: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();
      this.authService.registerAndLogin(name, email, password)
        .subscribe({
          next: (value) => {
            this.router.navigate(['/app/boards'])
          },
          error: (err) => {
            this.status = 'failed';
          }
        });
    } else {
      this.form.markAllAsTouched();
    }
  }

  isEmailAvailable() {
    const { email } = this.form.getRawValue();
    if (email.trim() !== '') {
      this.authService.userAvailable(email)
        .subscribe({
          next: (value: any) => {
            if (value['isAvailable']) {
               this.statusUser = 'success';
            } else {
               this.statusUser = 'failed';
            }
          },
          error: (err) => {
            this.statusUser = 'failed';
          }
        });
    }

  }
}
