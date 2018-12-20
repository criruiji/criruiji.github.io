document.addEventListener('DOMContentLoaded', function () {
    //API_KEY
    const BEARER_TOKEN = 'keySwoklV60WEBzQY'; 
    //URL del API generado por Airtable
    const URL_API = 'https://api.airtable.com/v0/appXfro3sHfsEHe6u/tareas';

    let app = new Vue({
        el: '#app',
        data: {
            //Inputs donde escribimos tareas para anyadir
            nuevaTareaCold: '',
            nuevaTareaWarm: '',
            nuevaTareaHot: '',
            nuevaTareaEnprogreso: '',
            nuevaTareaEnrevision: '',
            //input para editar una tarea de la lista
            nombreTareaEditadaCold: '',
            nombreTareaEditadaWarm: '',
            nombreTareaEditadaHot: '',
            nombreTareaEditadaEnprogreso: '',
            nombreTareaEditadaEnrevision: '',
            nombreTareaEditadaFinalizada: '',
            //array donde se almacenarán las tareas de la lista
            listaTareas: [],
            //arrays para los submenus
            submenuCold: [],
            submenuWarm: [],
            submenuHot: [],
            submenuEnprogreso: [],
            submenuEnrevision: [],
            submenuFinalizada: [],
            anyadirFinalizada: false,
            cold: 'cold',
            warm: 'warm',
            hot: 'hot',
            enprogreso: 'enprogreso',
            enrevision: 'enrevision',
            finalizada: 'finalizada',

           
            
            
        },
        //Lo primero que montamos es la API KEY para acceder a nuestra base de datos y cargamos los datos que contiene
        mounted: function () {
            axios.defaults.headers.common['Authorization'] = `Bearer ${BEARER_TOKEN}`;
            moment.locale('es-Es');
            this.cargarLista();
            
        },
        //Ponemos la inicial en mayuscula
        filters: {
            capital: function (inicial) {
                return `${inicial[0].toUpperCase()}${inicial.slice(1)}`
            }
        },

        computed: {
            //Ordenamos la lista
            listaTareasOrdenadas: function () {
                return _.orderBy(this.listaTareas, ['fields.fecha'], ['asc'])
            },
            //Filtramos la lista por categorias
            categoriaCold: function () {
                return this.listaTareas.filter((tarea) => tarea.categoria == 'cold');
            },
            categoriaWarm: function () {
                return this.listaTareas.filter((tarea) => tarea.categoria == 'warm');
            },
            categoriaHot: function () {
                return this.listaTareas.filter((tarea) => tarea.categoria == 'hot');
            },

            categoriaEnProgreso: function () {
                return this.listaTareas.filter((tarea) => tarea.categoria == 'enprogreso');
            },
            categoriaEnRevision: function () {
                return this.listaTareas.filter((tarea) => tarea.categoria == 'enrevision');
            },
            categoriaFinalizada: function () {
                return this.listaTareas.filter((tarea) => tarea.categoria == 'finalizada');
            }
            
        },

        methods: {
            //CARGAMOS LOS DATOS DE NUESTRA BASE DE DATOS
            cargarLista: function () {
                axios.get(URL_API)
                    .then(function (response) {
                    // handle success
                    app.listaTareas = response.data['records'];
                    let miLista = app.listaTareas.map(function (tarea) {
                        return {
                                nombre: tarea.fields.nombre,
                                categoria: tarea.fields.categoria,
                                editable: tarea.fields.editable
                            }
                        });
                    })
                    .catch(function (error) {
                    // handle error
                    console.log(error);
                    });
                },
            //Anyadimos tareas pasandole la categoria y el v-model para nuevaTarea que le hemos dicho en el html
            anyadirTareas: function (categoria, nuevaTarea) {
                //*(el trim es para eliminar los espacios y que no se envie al hacer enter)
                if (_.trim(nuevaTarea)) {
                    axios.post(URL_API, {
                    fields: {
                        nombre: nuevaTarea,
                        categoria: categoria,
                        editable: 'false',
                        fecha: new Date().toISOString()
                    }
                    
                })
                  .then(function (response) {
                      // Borramos el campo del input
                      app.nuevaTareaCold = '';
                      app.nuevaTareaWarm = '';
                      app.nuevaTareaHot = '';
                      app.nuevaTareaEnprogreso = '';
                      app.nuevaTareaEnrevision = '';
                      // Volvemos a cargar la lista
                      app.cargarLista();
                  })
                  .catch(function (error) {
                    // handle error
                    console.log(error);
                  });
                }
               

            },
                //Para borrar tareas
                borrarTarea: function (index) {
                    axios.delete(`${URL_API}/${app.listaTareas[index].id}`)
                        .then(function (response) {
                           app.cargarLista();
                        })
                        .catch(function (error) {
                            // handle error
                            console.log(error);
                        });
                },
                //Editar tareas
                confirmarEdicion: function (index, nuevoNombre) {
                    axios.patch(`${URL_API}/${app.listaTareas[index].id}`, {
                          fields: {
                                nombre: nuevoNombre
                            }
                        })
                        .then(function (response) {
                           //Cuando se acabe la petición: limpiamos el input de anyadir tarea
                           app.cargarLista();
                           app.submenuCold = [];
                           app.submenuWarm = [];
                           app.submenuHot = [];
                           app.submenuEnprogreso = [];
                           app.submenuEnrevision = [];
                           app.submenuFinalizada = [];
                           app.nombreTareaEditadaCold = '';
                           app.nombreTareaEditadaWarm = '';
                           app.nombreTareaEditadaHot = '';
                           app.nombreTareaEditadaEnprogreso = '';
                           app.nombreTareaEditadaEnrevision = '';
                           app.nombreTareaEditadaFinalizada = '';
                        })
                        .catch(function (error) {
                            // handle error
                            console.log(error);
                        });
                },
                //Para cambiar una tarea de categoria
                modificarCategoria: function (index, nuevaCategoria) {
                    axios.patch(`${URL_API}/${app.listaTareas[index].id}`, {
                          fields: {
                                categoria: nuevaCategoria
                            }
                        })
                        .then(function (response) {
                           app.cargarLista();
                        })
                        .catch(function (error) {
                            // handle error
                            console.log(error);
                        });
                },

                ocultarSubmenuCold: function (index) {
                    this.submenuCold = this.submenuCold.splice(index, 1);
                }
              

               
            

        }
});
    
});