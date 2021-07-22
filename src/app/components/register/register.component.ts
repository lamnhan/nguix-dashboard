import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() goLogin: EventEmitter<void> = new EventEmitter();
  @Output() signedUp: EventEmitter<void> = new EventEmitter();
  @Output() error: EventEmitter<any> = new EventEmitter();

  public readonly registerFormGroup: FormGroup;
  lockdown = false;
  message?: string;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.registerFormGroup = this.formBuilder.group(
      {
        'email': new FormControl('', [
          Validators.required,
          Validators.email
        ]),
        'password': new FormControl('', [
          Validators.required,
          Validators.minLength(7)
        ]),
        'passwordConfirm': new FormControl('', [
          Validators.required,
        ]),
      },
      {
        validators: (control: AbstractControl) => {
          // password confirm
          const password: string = control.get('password')?.value;
          const passwordConfirm: string = control.get('passwordConfirm')?.value;
          if (password !== passwordConfirm) {
            return { invalidPasswordConfirm: true };
          }
          return null;
        }
      }
    );
  }

  ngOnInit(): void {
  }

  signUp() {
    if (this.authService && !this.authService.authenticated && !this.lockdown) {
      this.beforeSignup();
      const email: string = this.registerFormGroup.get('email')?.value;
      const password: string = this.registerFormGroup.get('password')?.value;
      this.authService.createUserWithEmailAndPassword(email, password).subscribe(
        () => this.onSignedUp(),
        error => this.onError(error)
      );
    }
  }

  private beforeSignup() {
    this.lockdown = true;
    this.message = undefined;
  }

  private onSignedUp() {
    this.lockdown = false;
    this.signedUp.emit();
  }

  private onError(error: any) {
    this.registerFormGroup.get('password')?.setValue('');
    this.registerFormGroup.get('passwordConfirm')?.setValue('');
    // default error handling
    const {message} = error;
    this.message = message;
    // events
    this.lockdown = false;
    this.error.emit(error);
  }
}
