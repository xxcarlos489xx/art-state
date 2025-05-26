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
                    <td>{{ fila.detalle }}</td>
                    <td>{{ fila.detalle }}</td>
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
                            <li><a class="dropdown-item" href="#">Editar</a></li>
                            <li><a class="dropdown-item" href="#">Eliminar</a></li>
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
    const filas = [
    { topic: 'Tema 1', detalle: 'Detalle del tema 1' },
    { topic: 'Tema 2', detalle: 'Detalle del tema 2' },
    { topic: 'Tema 3', detalle: 'Detalle del tema 3' },
    ]
    definePageMeta({
        layout: 'vertical'
    })
</script>

<!-- <style scoped>

</style> -->