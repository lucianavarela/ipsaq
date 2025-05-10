import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { SongsService } from './songs.service';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SongsResolverService {
  constructor(private sSongs: SongsService, private router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    if (!isNaN(Number(route.paramMap.get('index')))) {
      return this.sSongs.getSongByIndex(Number(route.paramMap.get('index'))).then(res => {
        if (res.status == 200) {
          return res
        } else {
          this.router.navigateByUrl('/cancionero');
          return false;
        }
      });
    } else {
      this.router.navigateByUrl('/cancionero');
      return;
    }
  }
}

export const songResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
  return inject(SongsResolverService).resolve(route);
};
