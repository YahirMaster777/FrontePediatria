<template>
  <div>
  </div>
  <div class="column">
    <canvas id="chartSql1"></canvas>
  </div>
  <div>
    <form @submit.prevent="PoblarNacimientos">
      <!-- No es necesario el input type="text" con el valor call test.InsertRandomBabies(100); -->
      <button type="submit" style="background-color: aquamarine;">Poblar Nacimientos</button>
    </form>
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
      previousData: [], // Almacenar los datos anteriores
      colors: [
        'rgb(255, 99, 132)', // Rojo suave con transparencia
        'rgb(255, 159, 64)', // Naranja suave con transparencia
        'rgb(139, 195, 74)', // Verde lima suave con transparencia
        'rgb(75, 192, 192)'  // Verde azulado suave con transparencia
      ],
    };
  },
  mounted() {
    this.loadData(); // Cargar datos al inicio
    this.startPolling(); // Iniciar polling
    this.PoblarNacimientos();
  },
  beforeUnmount() {
    clearInterval(this.pollingInterval); // Limpiar el intervalo al destruir el componente
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
        body: JSON.stringify({ script: sql_query })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Tabla poblada con éxito:', data);
        this.loadData(); // Cargar los datos nuevamente después de poblar la tabla
      })
      .catch(error => {
        console.error('Error al poblar la tabla:', error);
      });
    },
    loadData() {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOb21icmVfVXN1YXJpbyI6InlhaXIiLCJDb3JyZW9fRWxlY3Ryb25pY28iOiJzdHJpbmciLCJDb250cmFzZW5hIjoiMTIzNCIsIk51bWVyb19UZWxlZm9uIjoic3RyaW5nIn0.aEXy_fgDdUHif1wzhfpxddKVg4fWAyGR3fd1p-SWDOc'; 

      fetch('https://privilegecare-deploy.onrender.com/pediatria/nciudad/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
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
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ccc;
}
</style>
