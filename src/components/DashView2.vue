<template>
    <div>

            <div class="column" >
                <canvas id="partoNaturalChart" ></canvas>
            </div>
            <!-- <div class="column">
                <canvas id="cesareaChart"></canvas>
            </div> -->

        </div>
    </template>

<script>
import Chart from 'chart.js/auto';

export default {
    name: 'DashView2',
    data() {
        return {
            partoNaturalChart: null,
            currentData: {
                pnMasculino: null,
                pnFemenino: null,

            },
            data: {
                labels: [],
                datasets: [{
                    label: 'Parto Natural',
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
                    const newPnMasculino = data[0].pn_masculino;
                    const newPnFemenino = data[0].pn_femeninos;
    
                    // Compara los datos nuevos con los actuales 
                    if (this.currentData.pnMasculino !== newPnMasculino ||this.currentData.pnFemenino !== newPnFemenino) {
                        // si la condicion es verdadera se actualizan los datos actuales en la grafica
                        this.currentData.pnMasculino = newPnMasculino;
                        this.currentData.pnFemenino = newPnFemenino;

                        // se Llama a la función ActualizarDatos solo si hay cambios, para actualizar la tabla
                        this.ActualizarDatos(newPnMasculino, newPnFemenino);
                    }
                })
                .catch(error => {
                    console.error('Error al cargar los datos desde la API:', error);
                });
        },

        /*Escript que se encarga de cargar los datos a las graficas*/
        ActualizarDatos(pnMasculino, pnFemenino) {
            let delayed;
            const data = this.data;
            if (this.partoNaturalChart) {
                this.partoNaturalChart.destroy();
            }
            const ctxPartoNatural = document.getElementById('partoNaturalChart').getContext('2d');
            this.partoNaturalChart = new Chart(ctxPartoNatural, {
                type: 'pie',
                data: {
                    labels: ['Masculino', 'Femenino'],
                    datasets: [{
                        label: data.datasets[0].label,
                        data: [pnMasculino, pnFemenino],
                        backgroundColor: data.datasets[0].backgroundColor
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Comparación en Parto Natural'
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
