import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EmailService } from 'src/app/services/email.service';
import { ToastService } from 'src/app/services/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/utils/header/header.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent
  ]
})
export class ContactComponent implements OnInit {
  name!: string;
  email!: string;
  content!: string;

  constructor(private sEmail: EmailService, private toastService: ToastService, private sTitle: Title) { }

  ngOnInit(): void {
    this.sTitle.setTitle(`Contacto`);
  }

  sendEmail() {
    try {
      this.sEmail.sendEmail({name: this.name, email: this.email, content: this.content}).catch(res => {
      })
    } catch (error: any) {
      //this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
    } finally {
    }
  }
}
