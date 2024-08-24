<template>
    <div>

            <div class="column">
                <canvas id="cesareaChart"></canvas>
            </div>

        </div>
    </template>

<script>
import Chart from 'chart.js/auto';

export default {
    name: 'DashView3',
    data() {
        return {
            cesareaChart: null,
            currentData: {
        
                cMasculino: null,
                cFemenino: null,
            },
            data: {
                labels: [],
                datasets: [
                {
                    label: 'Cesárea',
                    data: [],
                    backgroundColor: ['skyblue', 'lightpink']
                }]
            }
        };
    },
    mounted() {
        this.CargarAPI();
        // Inicia el polling para actualizar los datos cada 5 segundos
        setInterval(this.CargarAPI, 3000);
    },
    methods: {
        CargarAPI() {
            /*ruta del endpoint con la vista de mysql, se espera una respuesta*/
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
                        throw new Error('Error al Recuperar Los datos');
                    }
                    return response.json();
                })
                .then(data => {
                    // declaracion de las variables que contienen los datos necesario para la grafica
                    const newCMasculino = data[0].c_masculino;
                    const newCFemenino = data[0].c_femenino;
                    // Compara los datos nuevos con los actuales 
                    if (this.currentData.cMasculino !== newCMasculino ||this.currentData.cFemenino !== newCFemenino) {
                        // si la condicion es verdadera se actualizan los datos actuales en la grafica
                        this.currentData.cMasculino = newCMasculino;
                        this.currentData.cFemenino = newCFemenino;
                        // se Llama a la función ActualizarDatos solo si hay cambios, para actualizar la tabla
                        this.ActualizarDatos(newCMasculino, newCFemenino);
                    }
                })
                .catch(error => {
                    console.error('Error al cargar los datos desde la API:', error);
                });
        },

        /*Escript que se encarga de cargar los datos a las graficas*/
        ActualizarDatos(cMasculino, cFemenino) {
            let delayed;
            const data = this.data;
            if (this.cesareaChart) {
                this.cesareaChart.destroy();
            }
            const ctxCesarea = document.getElementById('cesareaChart').getContext('2d');
            this.cesareaChart = new Chart(ctxCesarea, {
                type: 'pie',
                data: {
                    labels: ['Masculino', 'Femenino'],
                    datasets: [{
                        label: data.datasets[0].label,
                        data: [cMasculino, cFemenino],
                        backgroundColor: data.datasets[0].backgroundColor
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Comparación en Parto por Cesárea'
                        },
                        tooltips: {
                            enabled: false
                        }
                    },
                    animation: {
                        onComplete: () => {
                            delayed = true;
                        },
                        delay: (context) => {
                            let delay = 0;
                            if (context.type === 'data' && context.mode === 'default' && !delayed) {
                                delay = context.dataIndex * 300 + context.datasetIndex * 100;
                            }
                            return delay;
                        },
                    },
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            stacked: true
                        }
                    }
                }
            });
        }
    }
};
</script>

<style scoped>

.column{
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ccc;
}

</style>
