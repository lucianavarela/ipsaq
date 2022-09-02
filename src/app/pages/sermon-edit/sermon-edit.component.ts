import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Sermon } from 'src/app/classes/sermon';
import { SermonsService } from 'src/app/services/sermons.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-sermon-edit',
  templateUrl: './sermon-edit.component.html',
  styleUrls: ['./sermon-edit.component.scss']
})
export class SermonEditComponent implements OnInit {

  sermon!: Sermon;
  loading = false;

  constructor(private sSermons: SermonsService, private router: Router, private activatedRoute: ActivatedRoute,
    private toastService: ToastService) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ sermon }) => {
      if (sermon) {
        this.sermon = new Sermon(sermon.data);
      } else {
        this.sermon = new Sermon();
      }
    })
  }

  async updateSermon() {
    try {
      this.loading = true;
      this.sSermons.updateSermon(this.sermon).then((res:any) => this.router.navigateByUrl('/cultos/'+res.data[0]['id']));
      this.toastService.showSuccessToast('Exito!', 'Culto actualizado.');
    } catch (error: any) {
      this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
    } finally {
      this.loading = false;
    }
  }

  async addSermon() {
    try {
      this.loading = true;
      delete this.sermon.id;
      this.sSermons.createSermon(this.sermon).then((res:any) => this.router.navigateByUrl('/cultos/'+res.data[0]['id']));
      this.toastService.showSuccessToast('Exito!', 'Culto actualizado.');
    } catch (error: any) {
      this.toastService.showErrorToast('Error al guardar', error.error_description || error.message);
    } finally {
      this.loading = false;
    }
  }
}
