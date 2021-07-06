import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, NativeUserCredential } from '@lamnhan/ngx-useful';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Input('authService') auth?: AuthService;

  @Output() goRegister: EventEmitter<void> = new EventEmitter();
  @Output() signedIn: EventEmitter<NativeUserCredential> = new EventEmitter();
  @Output() error: EventEmitter<any> = new EventEmitter();

  public readonly loginFormGroup: FormGroup;
  lockdown = false;
  message?: string;

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.loginFormGroup = this.formBuilder.group({
      'email': new FormControl('admin@lamnhan.com', [
        Validators.required,
        Validators.email
      ]),
      'password': new FormControl('1234567890', [
        Validators.required,
        Validators.minLength(7)
      ])
    });
  }

  ngOnInit(): void {}

  signIn() {
    if (this.auth && !this.auth.authenticated && !this.lockdown) {
      this.beforeSignin();
      const email: string = this.loginFormGroup.get('email')?.value;
      const password: string = this.loginFormGroup.get('password')?.value;
      this.auth.signInWithEmailAndPassword(email, password).subscribe(
        credential => this.onSignedIn(credential),
        error => this.onError(error)
      );
    }
  }

  private beforeSignin() {
    this.lockdown = true;
    this.message = undefined;
  }

  private onSignedIn(credential: NativeUserCredential) {
    this.lockdown = false;
    this.signedIn.emit(credential);
  }

  private onError(error: any) {
    // default error handling
    const {code, message, email} = error;
    if (this.auth && code === 'auth/account-exists-with-different-credential') {
      this.auth
        .handleAccountExistsWithDifferentCredential(email as string)
        .subscribe(() => this.message = message);
    } else {
      this.message = message;
    }
    // events
    this.lockdown = false;
    this.error.emit(error);
  }
}
