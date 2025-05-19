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
        </section>
    </div>
</template>

<script setup lang="ts">
    definePageMeta({
        layout: 'vertical'
    })
</script>

<!-- <style scoped>

</style> -->