/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  d1 = '';
  d2 = '';
  constructor(private translate: TranslateService) { }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    const userCenter = new google.maps.LatLng(30.7041, 76.6912);
    const mapProp = {
      center: userCenter,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    const map = new google.maps.Map(document.getElementById('gmap'), mapProp);
    const bounds = new google.maps.LatLngBounds();
    const marked = this.getMarkers();
    if (marked.length > 0) {
      marked.forEach((marker) => {
        bounds.extend(marker.getPosition());
        marker.setMap(map);
      });
    }
    map.fitBounds(bounds);
  }
  getMarkers() {
    const m1 = new google.maps.Marker({
      position: new google.maps.LatLng(30.704649, 76.717873)
    });
    const m2 = new google.maps.Marker({
      position: new google.maps.LatLng(30.7068, 76.7082)
    });
    const m3 = new google.maps.Marker({
      position: new google.maps.LatLng(30.7041, 76.6912),
      title: 'Machine',
      icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
    });
    this.d1 = (google.maps.geometry.spherical.computeDistanceBetween(m1.getPosition(), m3.getPosition()) / 1000).toFixed(2);
    this.d2 = (google.maps.geometry.spherical.computeDistanceBetween(m2.getPosition(), m3.getPosition()) / 1000).toFixed(2);
    m1.setTitle('Distance from location of machine: ' + this.d1 + 'km.');
    m2.setTitle('Distance from location of machine: ' + this.d2 + 'km.');
    const markers = [m1, m2, m3];
    return markers;
  }
}
