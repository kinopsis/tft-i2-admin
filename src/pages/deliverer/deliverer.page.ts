import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController, NavParams } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from "angularfire2";

import _ from 'lodash';

import { OrderPage } from '../pages';

 @Component ({
     templateUrl: 'deliverer.page.html'
 })

 export class DelivererPage {

    deliverer: any = {};

    ordersData: any;
    orders = [];
    
    vehiclesData: any;
    vehicles = [];
    
    carsData: any;
    car = [];
    
    vehiclesDatabase: FirebaseListObservable<any>;
    deliveryMen: FirebaseListObservable<any>;

    constructor(public nav: NavController,
                public navParams: NavParams,
                public loadingController: LoadingController,
                public toastController: ToastController,
                public angularFire: AngularFire,
                public alertController: AlertController){

    }

    ionViewDidLoad(){
        this.deliverer = this.navParams.data;

        console.log(this.deliverer);

        let loader = this.loadingController.create({
            content: 'Cargando...',
            spinner: 'bubbles'
        });

        loader.present().then(() => {
            this.angularFire.database.list('/pedidos').subscribe(data => {
                this.ordersData = _.chain(data)
                                  .filter(o => o.idRepartidor === this.deliverer.$key && o.estado == "En ruta")
                                  .value();

                this.orders = this.ordersData;
            });

            this.angularFire.database.list('/coches').subscribe(data => {
                this.vehiclesData = _.chain(data)
                                    .filter(v => v.disponibilidad === "Libre")
                                    .value();

                this.vehicles = this.vehiclesData;
                this.vehiclesDatabase = this.angularFire.database.list('/coches');
                this.deliveryMen = this.angularFire.database.list('/repartidores');

                loader.dismiss();
            });
        });
            
    }


    addCar($event, vehicle){
        let prompt = this.alertController.create({
            title: 'Asignar',
            message: "¿Quieres añadir el vehículo con matrícula " + vehicle.matricula + " a este repartidor? ",
            buttons: [
                {
                    text: 'Cancelar'
                },
                {
                    text: 'Si',
                    handler: data =>{
                        this.vehiclesDatabase.update(vehicle.$key, {repartidor: this.deliverer.nombre,  disponibilidad: "Ocupado"});
                        this.deliveryMen.update(this.deliverer.$key, {coche: vehicle.matricula});

                        let toast = this.toastController.create({
                            message: "Se ha asignado el vehículo " + vehicle.matricula + " al repartidor ",
                            duration: 4000,
                            position: 'bottom'
                        });

                        toast.present();
                    }
                }
            ]
        });

        prompt.present();

    }


    removeCar(){

        var temp = this.angularFire.database.list('/coches').subscribe(data =>{
            this.carsData = _.chain(data)
                            .filter(c => c.matricula === this.deliverer.coche)
                            .value();

            this.car = this.carsData;
            //SER UN GENIO NIVEL DIOS
            //this.vehiclesDatabase.update(this.car[0].$key, {repartidor: "", disponibilidad: "Libre"});
        });

        this.vehiclesDatabase.update(this.car[0].$key, {repartidor: "", disponibilidad: "Libre"});
        this.deliveryMen.update(this.deliverer.$key, {coche: ""});

        temp.unsubscribe();

        let toast = this.toastController.create({
            message: "Se ha desasignado el vehículo al repartidor",
            duration: 4000,
            position: 'bottom'
        });

        toast.present();

    }


    goToOrder($event, order){
        this.nav.push(OrderPage, order);
    }

    getCorrectColor(deliveryMan){
        return deliveryMan.disponibilidad === "Ocupado" ? 'primary' : 'verde';
    }


 }