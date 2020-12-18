import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpHandlerService } from '../../shared/http-handler.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {
  public loginInfo: FormGroup; 
  public hide: boolean;
  constructor(
    private router: Router,
    private httpHandler: HttpHandlerService
  ) {
    this.loginInfo = new FormGroup({
      "login": new FormControl('', [Validators.required]),
      "password": new FormControl('', [Validators.required])
    });
    this.hide = true;
  }

  ngOnInit(): void {
    
  }

  public Login(){
    if(this.loginInfo.errors === null){
      if(this.httpHandler.LogIn(this.loginInfo.controls['login'].value, this.loginInfo.controls['password'].value)){
        this.router.navigate(["/account"]);      
      }else{
        alert('Логин или пароль введён неправильно.');
      }
    }else{
      alert('Логин или пароль введён неправильно.');
    }
  }


  

}
