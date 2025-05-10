import { enableProdMode, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { appRoutes } from './app/app-routing.module';
import 'zone.js';  // Included with Angular CLI
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { NoAccentsPipe } from './app/decorators/no-accents.pipe';

// Material modules that might be needed globally
import { MatDialogModule } from '@angular/material/dialog';

registerLocaleData(localeEsAr, 'es-Ar');

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(
      MatDialogModule
    ),
    NoAccentsPipe,
    { provide: LOCALE_ID, useValue: 'es-Ar' }
  ]
}).catch(err => console.error(err));
