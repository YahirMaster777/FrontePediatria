<template>
  <div>
    <div v-if="message" style="margin-top: 10px;">
      {{ message }}
    </div>

    <h1>Listado de Bebés</h1>


    
    <div class="container text-center">
          <!-- Barra de búsqueda -->
      <div style="margin-bottom: 10px;">
        <input 
          type="text" 
          v-model="textoBusqueda" 
          @input="buscarBebes"
          placeholder="Buscar por nombre del padre o madre..."
          style="width: 80%; padding: 8px; border-radius: 4px; border: 1px solid #ddd;">
      </div>
      <div class="row align-items-center">
        <div class="col">
          <p>Total de registros en la base de datos:</p>
          <img src="../img/ambos.png" alt="" style="width: 50px;">
          <h3 v-if="totalpSql !== null"><b>{{ totalpSql }}</b> </h3>
          <p v-else>Cargando...</p>
        </div>
        <div class="col">
          <p>Total de registros Femeninos:</p>
          <img src="../img/mujer.png" alt="" style="width: 50px;">
          <h3 v-if="totalFemenino !== null"> <b>{{ totalFemenino }}</b></h3>
          <p v-else>Cargando...</p>
        </div>
        <div class="col">
          <p>Total de registros Masculinos:</p>
          <img src="../img/hombre.png" alt="" style="width: 50px;">
          <h3 v-if="totalMasculino !== null"><b>{{ totalMasculino }}</b></h3>
          <p v-else>Cargando...</p>
        </div>
      </div>
    </div>
    <br>

    <div class="tabla1">
      <table>
        <thead>
          <tr>
            <th>Id del Bebé</th>
            <th>Sexo del Bebé</th>
            <th>Nombre del Padre</th>
            <th>Nombre de la Madre</th>
            <th>Correo electrónico del contacto</th>
            <th>Fecha de nacimiento</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bebe, index) in bebesFiltrados" :key="index">
            <td>{{ bebe.id }}</td>
            <td>{{ bebe.sexo }}</td>
            <td>{{ bebe.nombre_padre }}</td>
            <td>{{ bebe.nombre_madre }}</td>
            <td>{{ bebe.email_contacto }}</td>
            <td>{{ bebe.fecha_nacimiento }}</td>
            <td>
              <button @click="eliminarBebe(bebe.id)">
                <i class="fas fa-trash-alt"></i> Eliminar
              </button>
              &nbsp;&nbsp;&nbsp;

              <router-link :to="{ name: 'editar', params: { id: bebe.id } }">
                <button>
                  <i class="fas fa-edit"></i> Editar Bebé
                </button>
              </router-link>
              &nbsp;&nbsp;&nbsp;
              <router-link :to="{ name: 'TablaVacunas',params: { id: bebe.id } }">
                <button>
                  <i class="fas fa-syringe"></i> Ver Vacunas
                </button>
              </router-link>


            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div style="margin-top: 10px;">
      <button @click="paginar('anterior')" :disabled="paginaActual === 1" style="background-color: black;">
        Anterior
      </button>&nbsp;
      <button @click="paginar('siguiente')" :disabled="bebes.length < itemsPorPagina" style="background-color: black;">
        Siguiente
      </button>
    </div>

    <div style="margin-top: 10px;">
      Página {{ paginaActual }}
    </div>
  </div>

  
      
  <div>
    <form @submit.prevent="PoblarNacimientos">
        <button type="submit" style="background-color: aquamarine;">Poblar Nacimientos</button>
    </form>

    <form @submit.prevent="EliminarNacimientos">
        <button type="submit" style="background-color: aquamarine;">Eliminar Nacimientos</button>
    </form>
</div>

  <div class="row align-items-center">
    <div class="col">
        <DashView></DashView>
    </div>
    <div class="col">
    <DashView2></DashView2>
    </div>
    <div class="col">
      <DashView3></DashView3>
      </div>
  </div>





</template>

<script>
/* eslint-disable */
import DashView from './DashView.vue';
import DashView2 from './DashView2.vue';
import DashView3 from './DashView3.vue';


export default {
  name: 'TablaView',
  components: {
    DashView,
    DashView2,
    DashView3
  },
 // Aquí registras el componente
  data() {
    return {
      bebes: [], 
      message: '',
      paginaActual: 1,
      itemsPorPagina: 10,
      totalpSql: null,
      totalMasculino: null,
      totalFemenino: null,
      textoBusqueda: '', // Nuevo dato para la búsqueda
    };
  },
  computed: {
    // Computed property para filtrar los bebés según la búsqueda
    bebesFiltrados() {
      if (this.textoBusqueda.trim() === '') {
        return this.bebes;
      }
      const busqueda = this.textoBusqueda.toLowerCase();
      return this.bebes.filter(bebe =>
        bebe.nombre_padre.toLowerCase().includes(busqueda) ||
        bebe.nombre_madre.toLowerCase().includes(busqueda)
      );
    }
  },
  mounted() {
    this.obtenerBebes();
    this.obtenerTotalSQL();
    setInterval(this.obtenerTotalSQL, 2000);
  },
  methods: {
    PoblarNacimientos() {
                const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOb21icmVfVXN1YXJpbyI6InlhaXIiLCJDb3JyZW9fRWxlY3Ryb25pY28iOiJzdHJpbmciLCJDb250cmFzZW5hIjoiMTIzNCIsIk51bWVyb19UZWxlZm9uIjoic3RyaW5nIn0.aEXy_fgDdUHif1wzhfpxddKVg4fWAyGR3fd1p-SWDOc';
                const sql_query = "call test.InsertRandomBabies(100);";

                fetch('https://privilegecare-deploy.onrender.com/pediatria/poblarNacimientos/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sql_query)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Tabla poblada con éxito:', data);
                        // this.loadData(); // Aquí se eliminó la llamada a this.loadData()
                    })
                    .catch(error => {
                        console.error('Error al poblar la tabla:', error);
                    });
            },

            EliminarNacimientos() {
                const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOb21icmVfVXN1YXJpbyI6InlhaXIiLCJDb3JyZW9fRWxlY3Ryb25pY28iOiJzdHJpbmciLCJDb250cmFzZW5hIjoiMTIzNCIsIk51bWVyb19UZWxlZm9uIjoic3RyaW5nIn0.aEXy_fgDdUHif1wzhfpxddKVg4fWAyGR3fd1p-SWDOc';
                const sql_query = "call test.sp_limpiar_nacimientos();";

                fetch('https://privilegecare-deploy.onrender.com/pediatria/poblarNacimientos/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(sql_query)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Nacimientos eliminados con éxito:', data);
                        // this.loadData(); // Aquí se eliminó la llamada a this.loadData()
                    })
                    .catch(error => {
                        console.error('Error al eliminar los nacimientos:', error);
                    });
            },
    obtenerTotalSQL() {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOb21icmVfVXN1YXJpbyI6InlhaXIiLCJDb3JyZW9fRWxlY3Ryb25pY28iOiJzdHJpbmciLCJDb250cmFzZW5hIjoiMTIzNCIsIk51bWVyb19UZWxlZm9uaWNvX01vdmlsIjoic3RyaW5nIn0.aEXy_fgDdUHif1wzhfpxddKVg4fWAyGR3fd1p-SWDOc'; 
      fetch('https://privilegecare-deploy.onrender.com/pediatria/nacimientogenero',{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al obtener los datos');
          }
          return response.json();
        })
        .then(data => {
          if (Array.isArray(data) && data.length > 0) {
            this.totalpSql = data[0].total_pacientes;
            this.totalMasculino = data[0].total_masculino;
            this.totalFemenino = data[0].total_femenino;
          } else {
            throw new Error('No se encontraron datos válidos');
          }
        })
        .catch(error => {
          this.totalpSql = 'Error al obtener los datos';
          this.totalMasculino = 'Error';
          this.totalFemenino = 'Error';
        });
    },

    obtenerBebes() {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOb21icmVfVXN1YXJpbyI6InlhaXIiLCJDb3JyZW9fRWxlY3Ryb25pY28iOiJzdHJpbmciLCJDb250cmFzZW5hIjoiMTIzNCIsIk51bWVyb19UZWxlZm9uaWNvX01vdmlsIjoic3RyaW5nIn0.aEXy_fgDdUHif1wzhfpxddKVg4fWAyGR3fd1p-SWDOc'; 
      fetch(`https://privilegecare-deploy.onrender.com/pediatria/nacimientos/?page=${this.paginaActual - 1}&limit=${this.itemsPorPagina}`,{
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Hubo un problema al obtener la lista de bebés.');
          }
          return response.json();
        })
        .then(data => {
          this.bebes = data;
        })
        .catch(error => {
          this.message = "Error: " + error.message;
        });
    },

    eliminarBebe(id) {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOb21icmVfVXN1YXJpbyI6InlhaXIiLCJDb3JyZW9fRWxlY3Ryb25pY28iOiJzdHJpbmciLCJDb250cmFzZW5hIjoiMTIzNCIsIk51bWVyb19UZWxlZm9uaWNvX01vdmlsIjoic3RyaW5nIn0.aEXy_fgDdUHif1wzhfpxddKVg4fWAyGR3fd1p-SWDOc'; 
      fetch(`https://privilegecare-deploy.onrender.com/pediatria/nacimiento/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Hubo un problema al eliminar el bebé.');
          }
          this.message = "¡Bebé eliminado exitosamente!";
          this.obtenerBebes();
          setTimeout(() => {
            this.message = '';
          }, 3000);
        })
        .catch(error => {
          this.message = "Error: " + error.message;
        });
    },

    buscarBebes() {
      // Este método se llama cada vez que se escribe en la barra de búsqueda.
    },

    paginar(direccion) {
      if (direccion === 'anterior' && this.paginaActual > 1) {
        this.paginaActual--;
      } else if (direccion === 'siguiente') {
        this.paginaActual++;
      }
      this.obtenerBebes();
    }
  }
}
</script>

<style scoped>
/* Tus estilos existentes aquí */
.tabla1 {
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  border-collapse: collapse;
}

.router-link-custom {
  text-decoration: none;
  color: inherit;
}

th, td {
  border: 1px solid #dddddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #45a049;
}

.fas.fa-trash-alt {
  margin-right: 5px;
}

@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
</style>
