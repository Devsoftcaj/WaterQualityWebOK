import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Medicion } from 'src/app/models/Medicion';
import { MapService } from 'src/app/services/map.service';

const iconRetinaUrl = './assets/marker-icon-2x.png';
const iconUrl = './assets/marker-icon.png';
const shadowUrl = './assets/marker-shadow.png';
const iconDefault = L.icon({
iconRetinaUrl,
iconUrl,
shadowUrl,
iconSize: [25, 41],
iconAnchor: [12, 41],
popupAnchor: [1, -34],
tooltipAnchor: [16, -28],
shadowSize: [41, 41]
});



var greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
var redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});
var greyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [33, 53], iconAnchor: [16, 53], popupAnchor: [1, -34], shadowSize: [41, 41]
});
var map: L.Map | L.LayerGroup<any> | null | undefined;

L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  
  listMediciones: Medicion[] = [];
  filterForm : FormGroup;
  fechaInicio = Date.parse("01/01/1990");
  fechaFin = Date.parse("01/01/2070");

  constructor(private _mapService : MapService, private fb: FormBuilder) {
      this.filterForm = this.fb.group({
        fromDate:[''],
        toDate:['']
      })
   }

  ngOnInit(): void {

    this.initMap(this.fechaInicio,this.fechaFin);
    
  }

  

  filtrar(){
    this.fechaInicio = Date.parse(this.filterForm.value.fromDate);
    this.fechaFin = Date.parse(this.filterForm.value.toDate);

    if(map !== undefined && map !== null) {map.remove()}
    this.initMap(this.fechaInicio, this.fechaFin);
  }
    
  private initMap(fechaInicio:number, fechaFin:number): void {

    this._mapService.getMediciones().subscribe(data => {
      //this.listMediciones = [];
      
      
      data.forEach((element:any) => {
        this.listMediciones.push({
          id: element.payload.doc.id,
          ...element.payload.doc.data()
        })
      });
      console.log(this.listMediciones)

      map = L.map('map').setView([36.72152663,-4.485942000], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    
      
      
    var markers = L.markerClusterGroup({
        maxClusterRadius: 120,
        iconCreateFunction: function (cluster) {
            var childCount = cluster.getChildCount();
      
           return greyIcon
        }
      });

    

      map.addLayer(markers)

      var array = [];
      for(var i = 0; i < this.listMediciones.length; i++){
        var item = this.listMediciones[i];
        console.log("fechainicio "+fechaInicio)
        console.log("fechafin "+fechaFin+86300000)
        console.log("fechaitem "+item.Fecha.toDate().getTime())
        if(item.Fecha.toDate().getTime()>=fechaInicio && item.Fecha.toDate().getTime()<=fechaFin+86300000){
          if (item.Turbidez>5 || item.Temperatura>30 || item.pH <6.5 || item.pH>9.5){
            var marker = L.marker([parseFloat(item.Latitud),parseFloat(item.Longitud)], {icon: redIcon}).addTo(map)
                          .bindPopup("<b>Fecha medición:</b> "+item.Fecha.toDate().toLocaleString()
                          +"<br><b>Temperatura:</b> "+item.Temperatura
                          +"<br><b>Turbidez:</b> "+item.Turbidez
                          +"<br><b>pH:</b> "+ item.pH
                          +"<br><b>Comentario:</b> "+ item.Comentario);

          } else {
            var marker = L.marker([parseFloat(item.Latitud),parseFloat(item.Longitud)], {icon: greenIcon}).addTo(map)
            .bindPopup("<b>Fecha medición:</b> "+item.Fecha.toDate().toLocaleString()
            +"<br><b>Temperatura:</b> "+item.Temperatura
            +"<br><b>Turbidez:</b> "+item.Turbidez
            +"<br><b>pH:</b> "+ item.pH
            +"<br><b>Comentario:</b> "+ item.Comentario);

          }
          markers.addLayer(marker)
          map.addLayer(markers)
          
        }
       
        
      }
      this.listMediciones = []
    })

  }

  

}
