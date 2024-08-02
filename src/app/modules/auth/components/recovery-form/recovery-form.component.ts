import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '@services/auth.service';

import { CustomValidators } from '@utils/validators';

@Component({
  selector: 'app-recovery-form',
  templateUrl: './recovery-form.component.html',
})
export class RecoveryFormComponent {
  form = this.formBuilder.nonNullable.group(
    {
      newPassword: ['', [Validators.minLength(6), Validators.required]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: [
        CustomValidators.MatchValidator('newPassword', 'confirmPassword'),
      ],
    }
  );
  status: string = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  token = '';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: ActivatedRoute,
    private route: Router
  ) {
    this.router.queryParamMap.subscribe((params: any) => {
        const token = params.get('token')
        if (token) {
          this.token = token;
        } else {
          this.route.navigate(['/login']);
        }
      });
  }

  recovery() {
    if (this.form.valid) {
      this.status = 'loading';
      const { newPassword } = this.form.getRawValue();
      this.authService.changePassword(this.token, newPassword).subscribe({
        next: () => {
          this.status = 'success';
        },
        error: (err: any) => {
          this.status = 'failed';
        }
      });

    } else {
      this.form.markAllAsTouched();
    }
  }
}
