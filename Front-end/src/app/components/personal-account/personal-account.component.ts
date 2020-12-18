import { Component, OnInit } from '@angular/core';
import { HttpHandlerService } from 'src/app/shared/http-handler.service';

@Component({
  selector: 'app-personal-account',
  templateUrl: './personal-account.component.html',
  styleUrls: ['./personal-account.component.scss']
})
export class PersonalAccountComponent implements OnInit {

  constructor( public httpHandler: HttpHandlerService ) { }

  ngOnInit(): void {
  }

}
