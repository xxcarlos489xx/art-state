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
                            :disabled="isLoading"
                            class="btn btn-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i class="bi bi-gear"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                 <a class="dropdown-item" href="#" @click.prevent="promptFileUpload(fila)">
                                    <i class="bi bi-upload"></i>&nbsp;Cargar Paper
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item" @click.prevent="handleGenerateSota(fila)">
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

        <input
            type="file"
            ref="fileInputRef"
            style="display: none"
            accept=".pdf"
            @change="handleFileSelected"
        />
    </div>
</template>

<script setup lang="ts">
    import { useTopics } from '@/composables/useTopics'

    const { listTopics, uploadPaper }   =   useTopics()
    const { check } = useGemini()
    const { validateDOI } = useScopus()
    const { generateSota } = useSota()

    const topics            =   ref([])
    const fileInputRef      =   ref<HTMLInputElement | null>(null)
    const currentTopicForUpload =   ref<any | null>(null)
    const isLoading = ref(false)

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
            id: t.id,
            topic: t.titulo,
            sota: t.sotas.lenght > 0 ? t.sotas[0] : '-',
            countPaper: t._count.papers
        }))
    )

    const promptFileUpload = (topicData: any) => {
        currentTopicForUpload.value = topicData; // Guardamos el topic actual
        fileInputRef.value?.click(); // Abrimos el diálogo de selección de archivo
    }

    const handleFileSelected = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
            const file = target.files[0];

            if (!currentTopicForUpload.value) {
                useToast().error({ title: 'Error', message: 'No se seleccionó un topic.' });
                return;
            }
            if (file.type !== 'application/pdf') {
                useToast().error({ title: 'Archivo no válido', message: 'Por favor, selecciona un archivo PDF.' });
                target.value = ''; // Limpiar el input
                return;
            }

            await uploadFile(currentTopicForUpload.value.id, file); // Pasamos el ID del topic y el archivo
            target.value = ''; // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
            currentTopicForUpload.value = null; // Limpiar el topic actual
        }
    }

    const uploadFile = async (topicId: string | number, file: File) => {
        try {
            if (file.type !== 'application/pdf') {
                useToast().error({
                    title: 'Archivo inválido',
                    message: 'El archivo debe ser un PDF.',
                    timeout: 3000,
                    position: 'center',
                    layout: 2,
                })
                return
            }
            isLoading.value = true

            useToast().info({
                title: 'Analizando documento, por favor espere...',
                timeout: false,
                close: false,
                position: 'center',
                layout: 2,
            })

            const doiResponse = await check(file)

            if (!doiResponse?.exito || !doiResponse.doi) {
                console.log(doiResponse);
                
                isLoading.value = false
                useToast().destroy()
                useToast().error({
                    title: 'DOI no encontrado',
                    message: doiResponse?.mensaje || 'El paper no contiene un DOI válido.',
                    timeout: 3000,
                    position: 'center',
                    layout: 2,
                })
                return
            }
            // console.log('DOI detectado:', doiResponse.doi)

            // Segunda validación con Scopus
            const scopusResult = await validateDOI(doiResponse.doi)

            if (!scopusResult.valid) {
                isLoading.value = false
                useToast().destroy()
                useToast().error({
                    title: 'DOI inválido',
                    message: scopusResult.reason,
                })
                return
            }

            // console.log('DOI válido:', doiResponse.doi)

            await uploadPaper(file, String(topicId), doiResponse.doi)
            
            useToast().destroy()

            useToast().success({
                title: 'Éxito',
                message: 'El paper fue subido correctamente.',
                timeout: 3000,
                position: 'center',
                layout: 2
            })
            isLoading.value = false

            const data      =   await listTopics()
            topics.value    =   data
        } catch (error: any) {
            useToast().destroy()
            isLoading.value = false
            useToast().error({
                title: 'Error!',
                message: error?.message || 'Error al subir el archivo',
                timeout: 3000,
                position: 'center',
                layout: 2,
            })
        }        
    }

    const handleGenerateSota = async (topic: any) => {
        isLoading.value = true
        useToast().info({
            title: 'Generando SOTA...',
            timeout: false,
            close: false,
            position: 'center',
            layout: 2,
        })

        try {
            const { message } = await generateSota(topic.id)
            useToast().destroy()
            useToast().success({
                title: 'SOTA Generada',
                message: message,
                timeout: 3000,
                position: 'center',
                layout: 2,
            })

            // Recargar lista
            const data = await listTopics()
            topics.value = data

        } catch (error: any) {
            useToast().destroy()
            useToast().error({
                title: 'Error al generar SOTA',
                message: error.message || 'Inténtalo más tarde.',
                timeout: 3000,
                position: 'center',
                layout: 2,
            })
        } finally {
            isLoading.value = false
        }
    }
</script>

<!-- <style scoped>

</style> -->