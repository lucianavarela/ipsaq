import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from 'src/app/services/supabase.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-reset-pw',
  templateUrl: './reset-pw.component.html',
  styleUrls: ['./reset-pw.component.scss']
})
export class ResetPwComponent {
  token: string = '';
  pw1: string = '';
  pw2: string = '';

  constructor(private readonly supabase: SupabaseService, private sToast: ToastService, private route: ActivatedRoute,
    private router: Router, private sTitle: Title) {}

  ngOnInit() {
    this.sTitle.setTitle(`Resetear contraseña`);
    this.route.queryParams
      .subscribe(params => {
        if (params['access_token']) this.token = params['access_token'];
      }
    );
  }

  async reset() {
    if (this.pw1 && this.pw2 && this.pw1 == this.pw2) {
      try {
        this.supabase.resetPW(this.token, this.pw1).then((res: any) => {
          this.supabase.setUser(res.user);
          if (res.user) {
            this.supabase.setUser(res.user);
            this.sToast.showSuccessToast('Exito!', 'Usuario logueado.');
            this.router.navigate(["/"]);
          } else {
            this.sToast.showErrorToast('Error al resetear!', 'No se pudo resetear la contraseña.');
          }
        })
      } catch (error: any) {
        this.sToast.showErrorToast('Error al resetear!', error.error_description || error.message);
      }
    } else {
      this.sToast.showErrorToast('Error', 'Las contraseñas deben ser iguales.');
    }
  }
}
