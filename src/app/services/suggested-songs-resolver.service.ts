import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { SongsService } from './songs.service';
 
@Injectable({
  providedIn: 'root'
})
export class SuggestedSongsResolverService implements Resolve<any> {
  constructor(private sSongs: SongsService, private router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot) {
    if (!isNaN(Number(route.paramMap.get('id')))) {
      return this.sSongs.getSong(Number(route.paramMap.get('id'))).then(res => {
        if (res.status == 200) {
          return res
        } else {
          this.router.navigateByUrl('/canciones_sugeridas');
          return false;
        }
      });
    } else {
      this.router.navigateByUrl('/canciones_sugeridas');
      return;
    }
  }
}
