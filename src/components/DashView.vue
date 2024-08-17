
<template>
  <div>
  </div>
  <div class="column">
    <canvas id="chartSql1"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      chart: null,
      pollingInterval: null,
      data: [],
      previousData: [],// Almacenar los datos anteriores
      colors: [
      'rgba(255, 99, 132, 0.5)', // Rojo suave con transparencia
      'rgba(255, 159, 64, 0.5)', // Naranja suave con transparencia
      'rgba(139, 195, 74, 0.5)', // Verde lima suave con transparencia
      'rgba(75, 192, 192, 0.5)'  // Verde azulado suave con transparencia
    ],
      
      
      // colors: [
      //           'rgb(255, 99, 132)', // Rojo suave
      //           'rgb(255, 159, 64)', // Naranja suave
      //           'rgb(139, 195, 74)', // Verde lima suave
      //           'rgb(75, 192, 192)',] // Verde azulado suave 
    };
  },
  mounted() {
    this.loadData(); // Cargar datos al inicio
    this.startPolling(); // Iniciar polling
  },
  beforeUnmount() {
    clearInterval(this.pollingInterval); // Limpiar el intervalo al destruir el componente
  },
  methods: {
    loadData() {
      fetch('https://privilegecare-deploy.onrender.com/pediatria/nciudad/')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          if (this.hasDataChanged(data)) { // Verificar si los datos han cambiado
            this.data = data;
            this.updateChart();
            this.previousData = data.slice(); // Actualizar los datos anteriores
          }
        })
        .catch(error => {
          console.error('Error al obtener datos:', error);
        });
    },
    updateChart() {
      let delayed;
      const lugares = this.data.map(item => item.lugar_nacimiento);
      const cantidades = this.data.map(item => item.cantidad_nacimientos);
  
      const ctx = document.getElementById('chartSql1').getContext('2d');
      if (this.chart) {
        this.chart.destroy(); // Destruir la instancia anterior del gráfico si existe
      }
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: lugares,
          datasets: [
            {
              label: 'Nacimientos',
              data: cantidades,
              backgroundColor: this.colors,
              borderColor: '#ffffff',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
                      title: {
                          display: true,
                          text: 'Cantidad de Nacimientos por Ciudad' 
                      },
                      tooltips: {
                          enabled: false
                      }
                  },
          animation: {
                        onComplete: () => {
                            delayed= true;
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
    },
    startPolling() {
      this.pollingInterval = setInterval(() => {
        this.loadData(); // Cargar datos cada 3 segundos
      }, 2500);
    },
    hasDataChanged(newData) {
      // Comparar los nuevos datos con los datos anteriores
      return JSON.stringify(newData) !== JSON.stringify(this.previousData);
    }
  }
};
</script>


<style scoped>
.column {
  width: 45%;
  /* Cada columna ocupa inicialmente el 25% del ancho */
  padding: 10px;
  /* Añade algo de espacio entre las columnas */
  box-sizing: border-box;
  /* Incluye el padding y el border en el tamaño total de la columna */
  border: 1px solid #ccc;
}

</style>