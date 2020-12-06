import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core';

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
  public loginInfo: FormGroup 
  constructor(
    private router: Router
  ) {
    this.loginInfo = new FormGroup({
      "login": new FormControl('', [Validators.required]),
      "password": new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    
  }

  public Login(){
    this.router.navigate(["/account"]);

  }


  

}
