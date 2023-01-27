import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class EmailService {
    sender = 'lucianafvarela@gmail.com';

    constructor(private sSupabase: SupabaseService) { }

    sendEmail(emailInfo: { name: string, email: string, content: string }) {
        return this.sSupabase.functions({
            email: this.sender,
            subject: 'Solicitud de Contacto de ' + emailInfo.name,
            //text: emailInfo.content + '|' + emailInfo.email,
            message: '<strong>' + emailInfo.content + '</strong><br/>' + emailInfo.email,
        });
    }
}
