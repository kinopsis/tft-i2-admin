import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from "angularfire2";

import _ from 'lodash';

import moment from 'moment';

import { OrderPage } from '../pages';

 @Component ({
     templateUrl: 'registry.page.html'
 })

 export class RegistryPage {

    //orders: FirebaseListObservable<any>;
    orders = [];
    private allDates: any;


    constructor(public nav: NavController,
                public alertController: AlertController,
                public angularFire: AngularFire,
                public loadingController: LoadingController){

    }

    ionViewDidLoad(){

        let loader = this.loadingController.create ({
            content: 'Obteniendo datos...',
            spinner: 'bubbles'
        });

        loader.present().then(() => {
            this.angularFire.database.list('/pedidos').subscribe(data => {
                this.allDates = 
                    _.chain(data)
                    .groupBy(fecha => fecha.fechaEntrega.split('T').shift())
                    .toPairs()
                    .map(item => _.zipObject(['date', 'order'],
                    item))
                    .value();

                this.orders = this.allDates;
                loader.dismiss();

            });
        });

    }

    itemTapped($event, order){
        this.nav.push(OrderPage, order);
    }


 }