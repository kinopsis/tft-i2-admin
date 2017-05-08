import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from "angularfire2";

import { } from '../pages';
import _ from 'lodash';

 @Component ({
     templateUrl: 'delivererLocation.page.html',
 })

 export class DelivererLocationPage {
     
     map: any = {};
     deliverer = [];
     delivererData: any;
     
     constructor(private nav: NavController,
                 public angularFire: AngularFire) { }
     
     ionViewDidLoad(){
         this.map = {
            lat: 27.942246703329612,
            lng: -15.598526000976562,
            zoom: 10
        };

        this.angularFire.database.list('/repartidores').subscribe(data => {
                this.delivererData = _.chain(data)
                                  .filter(o => o.coche != "" && o.horaCapturaGPS !="")
                                  .value();
                this.deliverer = this.delivererData;
            });
        
    }



 }