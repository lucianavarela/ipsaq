import { Component, OnInit } from '@angular/core';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  name!: string;
  email!: string;
  content!: string;

  constructor(private sEmail: EmailService) { }

  ngOnInit(): void {
  }

  sendEmail() {
    this.sEmail.sendEmail({name: this.name, email: this.email, content: this.content});
  }
}
