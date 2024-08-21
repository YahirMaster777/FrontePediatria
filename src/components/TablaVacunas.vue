<template>
    <div>
        <div v-if="message" style="margin-top: 10px;">
            {{ message }}
        </div>

        <h1>Listado de Vacunas</h1>

        <br>
        <div class="tabla1">
            <table>
                <thead>
                    <tr>
                        <th>Id del Bebé</th>
                        <th>Vacuna administrada</th>
                        <th>Dosis(ml)</th>
                        <th>Vía de Administración</th>
                        <th>Lote</th>
                        <th>Fecha de Aplicación</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(vacuna, index) in vacunas" :key="index">
                        <td>{{ vacuna.nacimientos_id }}</td>
                        <td>{{ vacuna.vacuna_administrada }}</td>
                        <td>{{ vacuna.dosis }}</td>
                        <td>{{ vacuna.via_administracion }}</td>
                        <td>{{ vacuna.numero_lote }}</td>
                        <td>{{ vacuna.fecha_administracion }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br>
        <router-link :to="{ name: 'Home'}">
            <button>
                <i class="fas fa-syringe"></i> Home
            </button>
        </router-link>
        &nbsp;
        <router-link :to="{ name: 'Vacunas'}">
            <button>
                <i class="fas fa-syringe"></i> Registrar Vacuna
            </button>
        </router-link>


        <div style="margin-top: 10px;">
            <button @click="paginar('anterior')" :disabled="paginaActual === 1" style="background-color: black;">
                Anterior
            </button>&nbsp;
            <button @click="paginar('siguiente')" :disabled="vacunas.length < itemsPorPagina" style="background-color: black;">
                Siguiente
            </button>
        </div>

        <div style="margin-top: 10px;">
            Página {{ paginaActual }}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            vacunas: [],
            message: '',
            paginaActual: 1,
            itemsPorPagina: 10,
            textoBusqueda: '' // Elimina esta línea si ya no es necesario
        };
    },
    mounted() {
        this.obtenerVacunas();
    },
    methods: {
        obtenerVacunas() {
            const id = this.$route.params.id;
            const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOb21icmVfVXN1YXJpbyI6InlhaXIiLCJDb3JyZW9fRWxlY3Ryb25pY28iOiJzdHJpbmciLCJDb250cmFzZW5hIjoiMTIzNCIsIk51bWVyb19UZWxlZm9uaWNvX01vdmlsIjoic3RyaW5nIn0.aEXy_fgDdUHif1wzhfpxddKVg4fWAyGR3fd1p-SWDOc'; 

            fetch(`https://privilegecare-deploy.onrender.com/pediatria/vacunas/${id}/?page=${this.paginaActual - 1}&limit=${this.itemsPorPagina}`,{
                method: 'GET',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Hubo un problema al obtener la lista de Vacunas. O el paciente no tiene ninguna Vacuna');
                    }
                    return response.json();
                })
                .then(data => {
                    this.vacunas = data;
                })
                .catch(error => {
                    this.message = "Error: " + error.message;
                });
        },
        paginar(direccion) {
            if (direccion === 'anterior' && this.paginaActual > 1) {
                this.paginaActual--;
            } else if (direccion === 'siguiente') {
                this.paginaActual++;
            }
            this.obtenerVacunas(); // Corrige el nombre del método
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

th,
td {
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
