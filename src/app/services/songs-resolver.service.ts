import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { SongsService } from './songs.service';
 
@Injectable({
  providedIn: 'root'
})
export class SongsResolverService implements Resolve<any> {
  constructor(private sSongs: SongsService, private router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!isNaN(Number(route.paramMap.get('id')))) {
      return this.sSongs.getSong(Number(route.paramMap.get('id')));
    } else {
      this.router.navigateByUrl('/cancionero');
      return;
    }
  }
}
