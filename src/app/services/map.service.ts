import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor(private _firestore: AngularFirestore) { }


  getMediciones() : Observable<any>{
    return this._firestore.collection('measurements').snapshotChanges();
  }
}
