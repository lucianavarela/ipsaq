import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { MailService } from '@sendgrid/mail';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EmailService {
    sender = 'lucianafvarela@gmail.com';

    constructor(private http: HttpClient) { }

    sendEmail(emailInfo: { name: string, email: string, content: string }) {
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs

        this.http.post('https://api.emailjs.com/api/v1.0/email/send', {
            email: this.sender,
            _subject: 'Solicitud de Contacto de ' + emailInfo.name,
            //text: emailInfo.content + '|' + emailInfo.email,
            _replyto: this.sender,
            message: '<strong>' + emailInfo.content + '</strong><br/>' + emailInfo.email,
        }).subscribe(res => {
            console.log(res)
        })


        /*const msg = {
            to: this.sender,
            from: this.sender,
            subject: 'Solicitud de Contacto de ' + emailInfo.name,
            text: emailInfo.content + '|' + emailInfo.email,
            html: '<strong>' + emailInfo.content + '</strong><br/>' + emailInfo.email,
        }

        this.sMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error: any) => {
                console.error(error)
            })*/
    }
}
