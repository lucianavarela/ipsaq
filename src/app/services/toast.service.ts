import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EventTypes } from '../classes/event-types';
import { ToastEvent } from '../classes/toast-event';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toastEvents: Observable<ToastEvent>;
  private _toastEvents = new Subject<ToastEvent>();

  constructor() {
    this.toastEvents = this._toastEvents.asObservable();
  }

  showSuccessToast(title: string, message: string) {
    this._toastEvents.next({
      message,
      title,
      type: EventTypes.Success,
    });
  }
  
  showErrorToast(title: string, message: string) {
    this._toastEvents.next({
      message,
      title,
      type: EventTypes.Error,
    });
  }

  showWarningToast(title: string, message: string) {
    this._toastEvents.next({
      message,
      title,
      type: EventTypes.Warning,
    });
  }
  
  showInfoToast(title: string, message: string) {
    this._toastEvents.next({
      message,
      title,
      type: EventTypes.Info,
    });
  }
}