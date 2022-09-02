import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { SermonsService } from './sermons.service';
 
@Injectable({
  providedIn: 'root'
})
export class SermonsResolverService implements Resolve<any> {
  constructor(private sSermons: SermonsService, private router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!isNaN(Number(route.paramMap.get('id')))) {
      return this.sSermons.getSermon(Number(route.paramMap.get('id')));
    } else {
      this.router.navigateByUrl('/cancionero');
      return;
    }
  }
}
