import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from "angularfire2";

import _ from 'lodash';

import { OrderPage } from '../pages';

 @Component ({
     templateUrl: 'registry.page.html'
 })

 export class RegistryPage {

    orders = [];
    private allDates: any;
    queryText: string = "";

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

    search(){
        let queryTextLower = this.queryText.toLowerCase();
        let filteredOrders = [];
        
        _.forEach(this.allDates, dat => {
            let orders = _.filter(dat.order, or => (<any>or).repartidor.toLowerCase()
            .includes(queryTextLower));
            if (orders.length) {
                filteredOrders.push({ date: dat.date, order: orders});
            }
        });

        this.orders = filteredOrders;
    }


 }