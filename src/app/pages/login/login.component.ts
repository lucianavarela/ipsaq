import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { SupabaseService } from "src/app/services/supabase.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  email: string = "";
  pw: string = "";

  constructor(
    private readonly supabase: SupabaseService,
    private sToast: ToastService,
    private router: Router,
    private sTitle: Title

  ) { }

  ngOnInit() {
    this.sTitle.setTitle('Iniciar Sesión');
  }

  async login(): Promise<void> {
    try {
      this.supabase.signIn(this.email, this.pw).then((res: any) => {
        if (!res.error) {
          this.supabase.setUser(res.data.user);
          this.sToast.showSuccessToast("Exito!", "Usuario logueado.");
          this.router.navigate(["/"]);
        } else {
          this.sToast.showErrorToast("Error!", "Credenciales incorrectas :(");
        }
      });
    } catch (error: any) {
      this.sToast.showErrorToast(
        "Error al loguearse",
        error.error_description || error.message
      );
    }
  }

  async requestReset() {
    if (this.email && this.email != '') {
      try {
        this.supabase.requestReset(this.email).then((res: any) => {
          if (!res["error"]) {
            this.sToast.showSuccessToast(
              "Exito!",
              "Email para resetear enviado."
            );
          } else {
            this.sToast.showErrorToast("Error!", "Credenciales incorrectas :(");
          }
        });
      } catch (error: any) {
        this.sToast.showErrorToast(
          "Error!",
          error.error_description || error.message
        );
      }
    } else {
      this.sToast.showErrorToast("Error!", "El email debe ser completado.");
    }
  }
}
