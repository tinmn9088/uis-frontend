import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  constructor(private authorizationService: AuthorizationService, 
    private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void { }

  onSubmit(formDirective: FormGroupDirective) {
    if (this.formGroup.invalid) {
      return;
    }

    // disable form
    this.passwordHidden = true;
    this.formGroup.disable();
    formDirective.resetForm();
    
    const loginForm = this;
    const loginRequest = { username: this.username, password: this.password };

    // TODO: remove timeout
    setTimeout(() => {
      this.authorizationService.login(loginRequest).subscribe({
        next(status) {
          
          // TODO: navigate to main page
          loginForm.formGroup.enable();
          loginForm.router.navigateByUrl(loginForm.activatedRoute.toString());
        }
      });
    }, 3000);
  }

}
