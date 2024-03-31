import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { SongsService } from './songs.service';
 
@Injectable({
  providedIn: 'root'
})
export class SongsResolverService implements Resolve<any> {
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
