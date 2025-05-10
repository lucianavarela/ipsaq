import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { SeriesService } from './series.service';
import { inject } from '@angular/core';
 
@Injectable({
  providedIn: 'root'
})
export class SeriesResolverService {
  constructor(private sSeries: SeriesService, private router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!isNaN(Number(route.paramMap.get('id')))) {
      return this.sSeries.getSerie(Number(route.paramMap.get('id'))).then(res => {
        if (res.status == 200) {
          return res
        } else {
          this.router.navigateByUrl('/series');
          return false;
        }
      });
    } else {
      this.router.navigateByUrl('/series');
      return;
    }
  }
}

export const serieResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
  return inject(SeriesResolverService).resolve(route, {} as RouterStateSnapshot);
};
