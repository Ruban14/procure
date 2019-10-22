import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  // private _server_url = "http://localhost:8000/";
  private _server_url = 'http://192.168.0.4:8000/';

  constructor() {}
  get server_url() {
    return this._server_url;
  }
}
