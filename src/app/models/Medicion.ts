import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;

export class Medicion {
    id?: number;
    Fecha: Timestamp;
    Latitud: string;
    Longitud: string;
    Temperatura: number;
    Turbidez: number;
    email: string;
    pH: number;
    Comentario: string;

    constructor(fecha: Timestamp,Latitud: string, Longitud: string,Temperatura: number,Turbidez: number,email: string,pH: number, Comentario: string){
        this.Fecha=fecha;
        this.Latitud= Latitud;
        this.Longitud=Longitud;
        this.Temperatura=Temperatura;
        this.Turbidez=Turbidez;
        this.email=email;
        this.pH=pH;
        this.Comentario=Comentario;
    }
}