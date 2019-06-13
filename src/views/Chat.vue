<template>
  <v-layout justify-center>
    <v-flex>
      <v-card class="text-xs-center">
        <v-card-text>
          <h3>Bienvenido {{usuario.nombre}}</h3>
        </v-card-text>
        <v-card-text style="height:60vh; overflow:auto;" v-chat-scroll>
          <div :class="item.nombre === usuario.nombre ? 'text-xs-right': 'text-xs-left'" v-for="(item, index) in mensajes" :key="index">
            <v-chip>
              <v-avatar>
                <img :src="item.foto">
              </v-avatar>
              {{item.mensaje}}
            </v-chip>
            <p class="caption mr-2">{{item.fecha}}</p>
          </div>
        </v-card-text>
        <v-card-text>
          <v-form @submit.prevent="enviarMensaje" v-model="valido">
            <v-text-field
              v-model="mensaje"
              label="Escribe tu mensaje aquí"
              required
              :rules="reglas"
            ></v-text-field>
          </v-form>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapState } from "vuex";
import { db } from "@/firebase";
import moment from "moment";

export default {
  data() {
    return {
      mensaje: "",
      valido: false,
      reglas: [v => !!v || "Tienes que escribir un texto"],
      mensajes: []
    };
  },
  computed: {
    ...mapState(["usuario"])
  },
  methods: {
    enviarMensaje() {
      if (this.valido === true) {
        console.log("enviaste el mensaje", this.mensaje);
        db.collection("chats")
          .add({
            mensaje: this.mensaje,
            nombre: this.usuario.nombre,
            foto: this.usuario.foto,
            fecha: Date.now()
          })
          .catch(error => console.log(error));

        this.mensaje = "";
      } else {
        console.log("no escribiste nada");
      }
    }
  },
  created() {
    let ref = db.collection("chats").orderBy("fecha", 'desc').limit(10); //leee en tiempo real los mensajes de la colleccion que se van generando

    ref.onSnapshot(querySnapshot => {
      this.mensajes = [];
      querySnapshot.forEach(doc => {
       
        //this.mensajes.push(doc.data()); aqui empujabamos todo el data pero ahora construiremos el objeto nosotros  mismos
         this.mensajes.unshift({
            mensaje: doc.data().mensaje,
            foto: doc.data().foto,
            nombre: doc.data().nombre,
            fecha: moment(doc.data().fecha).format('lll'),
          }); 
      });
      console.log(this.mensajes);
    });
  }
};
</script>
