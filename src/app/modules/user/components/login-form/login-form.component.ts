import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthorizationService } from '../../services/authorization/authorization.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.sass']
})
export class LoginFormComponent implements OnInit {
  
  passwordHidden: boolean = true;
  username: string = '';
  password: string = '';

  formGroup: FormGroup = new FormGroup({
    'username': new FormControl(this.username, Validators.required),
    'password': new FormControl(this.password, Validators.required),
  });

  // TODO: remove activated route
  constructor(private _authorizationService: AuthorizationService, 
    private _router: Router, private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar, private _translate: TranslateService) { }

  ngOnInit(): void { }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.formGroup.invalid) {
      return;
    }

    this.formGroup.disable();
    
    const loginForm = this;
    const loginRequest = { username: this.username, password: this.password };

    // TODO: remove timeout
    setTimeout(() => {
      this._authorizationService.login(loginRequest).subscribe({
        next(status) {
          
          // TODO: navigate to main page
          window.location.reload();    
        },
        error(err) {
          loginForm._translate.get('LoginForm.Snackbar.5XX').subscribe({
            next(message) {
              loginForm.formGroup.enable();
              loginForm._snackBar.open(`❌ ${message}`, '', { duration: 2000 });
            }
          });
        }
      });
    }, 3000);
  }

}
