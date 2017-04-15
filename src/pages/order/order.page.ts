import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams, AlertController, ToastController } from 'ionic-angular';

import { AngularFire, FirebaseListObservable } from "angularfire2";

import { MapPage } from '../pages';

 @Component ({
     templateUrl: 'order.page.html',
 })

 export class OrderPage {

    order: any;
    deliveryMen: FirebaseListObservable<any>;
    orders: FirebaseListObservable<any>;

    constructor(private nav: NavController, 
                private navParams: NavParams,
                private toastController: ToastController,
                private angularFire: AngularFire,
                private alertController: AlertController){

        this.order = this.navParams.data;
        this.deliveryMen = angularFire.database.list('/repartidores');
        this.orders = angularFire.database.list('/pedidos');
     }


    goToMap(){
        this.nav.push(MapPage, this.order);
    }

    getCorrectColor(deliveryMan){
        return deliveryMan.disponibilidad === "Ocupado" ? 'primary' : 'verde';
    }

    assignDeliveryMan($event, deliveryMan){
        /*  TODO: Editar base de datos para añadir repartidor al paquete seleccionado
        *   Editar base de datos para que el repartidor tenga otro paquete
        *   En HomePage, los paquetes con repartidor no pueden verse (Refresher automático) 
        *   Añadir Toast para indicar que el repartidor se ha añadido al pedido
        */

        let prompt = this.alertController.create({
            title: 'Asignar',
            message: "¿Quieres añadir el repartidor " + deliveryMan.nombre + " al pedido? ",
            buttons: [
                {
                    text: 'Cancelar',
                    handler: data => {
                        console.log('Cancelado');
                    }
                },
                {
                    text: 'Si',
                    handler: data =>{
                        //TODO: cosas

                        this.orders.update(this.order.$key, {repartidor: deliveryMan.nombre});

                        this.nav.popToRoot();

                        let toast = this.toastController.create({
                            message: "Se ha asignado el paquete " + this.order.$key + " al repartidor " + deliveryMan.nombre,
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


 }