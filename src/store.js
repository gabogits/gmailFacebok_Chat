import Vue from 'vue'
import Vuex from 'vuex'
import { auth, db } from '@/firebase';
import router from '@/router';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        usuario: '',
    },
    mutations: {
        nuevoUsuario(state, payload) {

            if (payload === null) {
                state.usuario = ''
            } else {
                state.usuario = payload
            }
        }
    },

    actions: {
        //si se esta autenticado al arrancar la app se va ejecutar esta accion 
        async setUsuario({ commit }, user) { //user es el payload


            try {

                const doc = await db.collection('usuarios').doc(user.uid).get();
                //se va buscar mendante el id  del objeto user -que se pasa de este desde el metodo de autenticacion  auth.onAuthStateChanged(function (user)-
                //si ese usuario eciste en la base de datos


                if (doc.exists) {
                    //si es id existe va setear el estado usuario con los datos de del documento o registro de la base de datos
                    commit('nuevoUsuario', doc.data());
                    //con esto traeria la foto actual, si es que se cambio en la app
                } else {

                    //si el usuario no existe va setear el estado con los datos del provedor de autenticaciob osea google o facebook
                    //con esto treria la foto del provedor de autenticacion

                    const usuario = {
                        nombre: user.displayName,
                        email: user.email,
                        uid: user.uid,
                        foto: user.photoURL,
                    }
                    await db
                        .collection("usuarios")
                        .doc(usuario.uid)
                        .set(usuario);
                    console.log("Usuario guardado en DB");

                    commit('nuevoUsuario', usuario);
                }

            } catch (error) {
                console.log(error);
            }
        },
        cerrarSesion({ commit }) {
            auth.signOut();
            commit('nuevoUsuario', null);
            router.push({ name: 'ingreso' })
        }
    }
})