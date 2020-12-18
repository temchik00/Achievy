import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpHandlerService, RegistationError } from 'src/app/shared/http-handler.service';


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return !!(control && (control.invalid || control.parent.errors != null) && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public registrationForm: FormGroup;
  public matcher:MyErrorStateMatcher;
  public hide: boolean;
  constructor(
    private router:Router,
    private httpHanler:HttpHandlerService
  ) {
    let checkPasswords = (group: FormGroup) => {
      let pass = group.controls.password.value;
      let confirmPass = group.controls.confirmPassword.value;
      return pass === confirmPass ? null : { "notSame": true };     
    }
    this.hide = true;
    this.registrationForm = new FormGroup({
      "login": new FormControl('', [Validators.required]),
      "password": new FormControl('', [Validators.required]),
      "confirmPassword": new FormControl('', [Validators.required])
    }, {validators: [checkPasswords]});
    this.matcher = new MyErrorStateMatcher();
  }

  ngOnInit(): void {
  }

  public Register(){
    if(this.registrationForm.errors === null){
      let error:RegistationError = this.httpHanler.Registry(this.registrationForm.controls['login'].value, this.registrationForm.controls['password'].value);
      switch (error) {
        case RegistationError.None:
          this.router.navigate(['/']);
          break;
        
        case RegistationError.LoginTaken:
          alert('Данный логин уже занят.');
          break;
        
        case RegistationError.ServerError:
          alert('Произошла непредвиденная ошибка сервера.');
          break;
      }
    }else{
      alert('Введены некорректные регистрационные данные.');
    }
  }

}
