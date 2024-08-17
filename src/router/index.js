import { createRouter, createWebHistory } from 'vue-router';
import FormView from '@/components/FormView.vue';
import TablaView from '@/components/TablaView.vue';
import EditView from '@/components/EditView.vue';
import ChartView from '@/components/DashView.vue';
import ChartView2 from '@/components/DashView2.vue';
import VacunasView from '@/components/VacunasForm.vue';
import VacunasView2 from '@/components/TablaVacunas.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: TablaView
  },
  {
    path: '/chart1',
    name: 'chart1',
    component: ChartView
  },
  {
    path: '/chart2',
    name: 'chart2',
    component: ChartView2
  },
  {
    path: '/about',
    name: 'About',
    component: FormView
  },
  {
    path: '/editar/:id',  // Define la ruta con el parámetro `id`
    name: 'editar',
    component: EditView,
    props: true  // Permite pasar el parámetro `id` como prop al componente
  },
  {
    path: '/vacunas/:id',
    name: 'Vacunas',
    component: VacunasView// Componente de error 404
  },
  {
    path: '/tvacunas/:id',
    name: 'TablaVacunas',
    component: VacunasView2
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
