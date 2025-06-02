<template>
    <div class="page-heading">
        <div class="page-title">
            <div class="row">
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>Lista</h3>
                    <p class="text-subtitle text-muted">Lista de topics.</p>
                </div>
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <nuxt-link to="/">Dashboard</nuxt-link>
                            </li>
                            <li class="breadcrumb-item active" aria-current="page">Lista</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
        <section class="section">
            <table class="table table-bordered table-hover">
                <thead class="table-light">
                    <tr>
                        <th scope="col">Topic</th>
                        <th scope="col">Papers</th>
                        <th scope="col">State of the Art</th>
                        <th scope="col">Config</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(fila, index) in filas" :key="index">
                    <td>{{ fila.topic }}</td>
                    <td>{{ fila.countPaper }}</td>
                    <td>{{ fila.sota }}</td>
                    <td>
                        <div class="dropdown">
                        <button
                            class="btn btn-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i class="bi bi-gear"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-upload"></i>&nbsp;Cargar Paper
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" href="#">
                                    <i class="bi bi-brush"></i>&nbsp;Generar Sota
                                </a>
                            </li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#">Ver más</a></li>
                        </ul>
                        </div>
                    </td>
                    </tr>
                </tbody>
            </table>
        </section>
    </div>
</template>

<script setup lang="ts">
    import { useTopics } from '@/composables/useTopics'

    const { listTopics } = useTopics()
    const topics = ref([])

    definePageMeta({
        layout: 'vertical'
    })

    onMounted(async () => {
        try {
            const data = await listTopics()
            topics.value = data               
        } catch (err: any) {
            useToast().error({
                title: 'Error!',
                // message: err?.message || 'Ocurrió un error',
                message: 'Error al cargar el listado',
                timeout: 3000,
                position: 'center',
                layout: 2,
            })
        }
    })
    const filas = computed(() =>
        topics.value.map((t:any) => ({
            topic: t.titulo,
            sota: t.sotas.lenght > 0 ? t.sotas[0] : '-',
            countPaper: t._count.papers
        }))
    )
</script>

<!-- <style scoped>

</style> -->