<template>
    <div class="page-heading">
        <div class="page-title">
            <div class="row">
                <div class="col-12 col-md-6 order-md-2 order-first">
                    <nav aria-label="breadcrumb" class="breadcrumb-header float-start float-lg-end">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="index.html">Dashboard</a></li>
                            <li class="breadcrumb-item active" aria-current="page">Layout Vertical Navbar</li>
                        </ol>
                    </nav>
                </div>
                <div class="col-12 col-md-6 order-md-1 order-last">
                    <h3>New Topic</h3>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-content">
                            <div class="card-body">
                                <FormWizard color="#3498db" 
                                            finish-button-text="Create Topic"
                                            errorColor="#e74c3c">
                                    <TabContent title="Paso 1"
                                                :before-change="stepOne"
                                                icon="bi-plus-square">
                                                <div class="card-body">
                                                    <p class="card-text">
                                                        A continuación, debes completar todos los campos para poder generar un tema de investigación
                                                    </p>
                                                    <div class="form-body row">
                                                        <div class="form-group col-6">
                                                            <label for="feedback1" class="sr-only">
                                                                Área General de Conocimiento / Disciplina Principal: 
                                                                <a href="#" data-bs-toggle="tooltip"
                                                                            title='El campo amplio en el que se enmarca la investigación. Ejem.: "Inteligencia Artificial" / "Biología Molecular" / "Historia del Arte del Renacimiento" / "Desarrollo Sostenible" / "Psicología Cognitiva"'>
                                                                            <i class="bi bi-info-circle-fill"></i>
                                                                </a>
                                                            </label>
                                                            <input  type="text" 
                                                                    id="feedback1"
                                                                    :class="{ 'is-invalid': $v.area.$errors.length }"
                                                                    class="form-control"
                                                                    v-model="step1.area"
                                                                    placeholder='...'
                                                                    name="area">
                                                        </div>
                                                        <div class="form-group col-6">
                                                            <label for="feedback4" class="sr-only">
                                                                Metodología Principal o Enfoque Previsto:
                                                                <a href="#" data-bs-toggle="tooltip"
                                                                            title='Idea del tipo de metodología que podría usar (experimental, teórica, revisión sistemática, desarrollo de un modelo, estudio de caso, etc.). Ejem.: "Revisión sistemática de la literatura" / "Desarrollo de un nuevo algoritmo" / "Estudio experimental con participantes humanos" / "Análisis comparativo de políticas"'>
                                                                            <i class="bi bi-info-circle-fill"></i>
                                                                </a>
                                                            </label>
                                                            <input  type="text" 
                                                                    id="feedback4" 
                                                                    class="form-control"
                                                                    :class="{ 'is-invalid': $v.metodologia.$errors.length }"
                                                                    placeholder='....'
                                                                    v-model="step1.metodologia"
                                                                    name="metodologia">
                                                        </div>
                                                        <div class="form-group col-6">
                                                            <label for="feedback3" class="sr-only">
                                                                Contexto o Población de Interés (Si aplica, Opcional):
                                                                <a href="#" data-bs-toggle="tooltip"
                                                                            title='Si la investigación se enfoca en un contexto geográfico, un grupo demográfico, un tipo de industria, un periodo histórico específico, etc. Ejem.: "En países en desarrollo" / "En adolescentes" / "En la industria del software" / "Durante el siglo XXI"'>
                                                                            <i class="bi bi-info-circle-fill"></i>
                                                                </a>
                                                            </label>
                                                            <input  type="text" 
                                                                    id="feedback3" 
                                                                    class="form-control" 
                                                                    placeholder='....'
                                                                    v-model="step1.contexto"
                                                                    name="contexto">
                                                        </div>
                                                        <div class="form-group col-6">
                                                            <label for="feedback4" class="sr-only">
                                                                Tipo de Contribución Deseada (Opcional):
                                                                <a href="#" data-bs-toggle="tooltip"
                                                                            title='¿Qué espera lograr con esta investigación? (Proponer una solución, analizar un impacto, desarrollar una teoría.) Ejem.: "Proponer un nuevo modelo" / "Evaluar el impacto de X en Y" / "Análisis crítico de Z"'>
                                                                            <i class="bi bi-info-circle-fill"></i>
                                                                </a>
                                                            </label>
                                                            <input  type="text" 
                                                                    id="feedback4" 
                                                                    class="form-control"
                                                                    placeholder='....'
                                                                    v-model="step1.contri"
                                                                    name="contri">
                                                        </div>
                                                        <div class="form-group col-12">
                                                            <label for="feedback5" class="sr-only">
                                                                Tema Específico / Palabras Clave Principales:
                                                                <a href="#" data-bs-toggle="tooltip"
                                                                            title='El tema central o los conceptos clave a investigar dentro del área general. Registre varias palabras clave o una frase concisa.'>
                                                                            <i class="bi bi-info-circle-fill"></i>
                                                                </a>
                                                            </label>
                                                            <textarea  type="text" 
                                                                    id="feedback5" 
                                                                    style="height: 100px;resize: none;"
                                                                    :class="{ 'is-invalid': $v.tema.$errors.length }"
                                                                    class="form-control"
                                                                    v-model="step1.tema"
                                                                    placeholder='Ejem.: Si el Área es "IA": "aprendizaje por refuerzo profundo para robótica" / "ética en modelos de lenguaje" / "detección de anomalías en imágenes médicas". Si el Área es "Biología Molecular": "edición genética CRISPR-Cas9 en enfermedades raras" / "microARNs en cáncer de mama" / "plegamiento de proteínas y chaperonas"'
                                                                    name="tema"></textarea>
                                                        </div>
                                                        <div class="form-group col-12">
                                                            <label for="feedback6" class="sr-only">
                                                                Problema Principal o Pregunta de Investigación:
                                                                <a href="#" data-bs-toggle="tooltip"
                                                                            title='Idea del problema que quiere abordar o una pregunta central que busca responder.'>
                                                                            <i class="bi bi-info-circle-fill"></i>
                                                                </a>
                                                            </label>
                                                            <textarea  type="text" 
                                                                    id="feedback6" 
                                                                    style="height: 100px;resize: none;"
                                                                    class="form-control"
                                                                    :class="{ 'is-invalid': $v.problema.$errors.length }"
                                                                    v-model="step1.problema"
                                                                    placeholder='Ejem.: "¿Cómo mejorar la eficiencia del aprendizaje por refuerzo en entornos con recompensas dispersas?" / "¿Cuáles son los mecanismos moleculares por los que el microARN-21 promueve la metástasis?"'
                                                                    name="problema"></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                    </TabContent>
                                    <TabContent title="Paso 2"
                                                :before-change="stepTwo"
                                                icon="bi-journal-bookmark">
                                        <div class="card-body">
                                            <p class="card-text">
                                                Para finalizar, selecciona un tema de investigacón. Si deseas, puedes editar el tema.
                                            </p>
                                            <div class="row mb-4">
                                                <div class="col-12 col-sm-12 col-md-2">
                                                    <div class="list-group" role="tablist">
                                                        <a  v-for="(item, index) in opciones" :key="index"
                                                            @click="checkOption(index)"
                                                            class="list-group-item list-group-item-action"
                                                            :class="{ 'active': item.select }"
                                                            data-bs-toggle="list" :href="'#list-'+index" role="tab"
                                                            :id="'list-'+index+'-list'">
                                                            Opción {{ index + 1 }}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div class="col-12 col-sm-12 col-md-10 mt-1">
                                                    <div class="tab-content text-justify" id="nav-tabContent">
                                                        <div    v-for="(item, index) in opciones" :key="index"
                                                                class="mt-2 tab-pane show"
                                                                :class="{ 'active': item.select }"
                                                                :id="'list-'+index" 
                                                                role="tabpanel"
                                                                :aria-labelledby="'list-'+index+'-list'">
                                                                <textarea   name="" 
                                                                            :id="'list-'+index+'-textarea'" 
                                                                            style="height: 100px;resize: none;"
                                                                            class="w-100" 
                                                                            v-model="item.text"
                                                                            >
                                                                </textarea>
                                                        </div>                                                
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabContent>
                                </FormWizard>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
    </div>
</template>

<script setup lang="ts">
    import { useTopics } from '@/composables/useTopics'
    import useVuelidate from '@vuelidate/core'
    import { required, email } from '@vuelidate/validators'
    import { reactive, computed } from 'vue'
    const opciones = ref<any[]>([])
    const step1 = reactive({
        area:'Inteligencia Artificial',
        metodologia:'Detección de anomalías en imágenes médicas',
        contexto:'En adolescentes',
        contri:'Proponer una solución',
        tema:'Procesamiento de rx de pulmones',
        problema:'Como detectar cancer de pulmón',
    })

    const rules = computed(() => ({
        area:{ required },
        metodologia:{ required },
        // contexto:{ required },
        // contri:{ required },
        tema:{ required },
        problema:{ required },
    }))

    const $v = useVuelidate(rules, step1)

    definePageMeta({
        layout: 'vertical'
    })
    const { $bootstrap } = useNuxtApp();

    onMounted(() => {
        let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new $bootstrap.Tooltip(tooltipTriggerEl);
        });
    });

    const stepOne = async () => {
        opciones.value.forEach((opt,i) => {
            opt.select = false
        });
        $v.value.$touch()
        await nextTick()
        
        if (!$v.value.$invalid) {
            try {
                const data:any = await $fetch('/api/gemini/generate-topic', {
                    method: 'POST',
                    body: { step1 },
                })
                if (data.response.exito) {
                    data.response.titulos_propuestos.forEach((element:any) => {
                        opciones.value.push({select:false, text: element})
                    });
                    return true
                }else{
                    useToast().error({
                        title: 'Error!', 
                        message: `${data.response.message}`,
                        timeout: 10000,
                        maxWidth:500,
                        position: 'center',
                        layout: 1,
                        // ...options,
                    })
                    return false
                }
            } catch (error) {
                useToast().error({
                    title: 'Error!',
                    message: `Error desde el servidor: ${error}`,
                    timeout: 3000,
                    position: 'center',
                    layout: 2,
                    // ...options,
                })
                return false
            }
        }

        return false
    }
    const stepTwo = async () => {
        const select = opciones.value.find(opt => opt.select);
        const comboOpciones = opciones.value.map(opt => opt.text)
        if (select) {
            try {
                const { createTopic } = useTopics()
                await createTopic(select.text, comboOpciones)

                useToast().success({
                    title: 'Success!',
                    message: 'Creado con éxito',
                    timeout: 3000,
                    position: 'center',
                    layout: 2,
                })

                navigateTo('/topics/lista')
                return true
            } catch (err: any) {
                useToast().error({
                    title: 'Error!',
                    message: err?.message || 'Ocurrió un error',
                    timeout: 3000,
                    position: 'center',
                    layout: 2,
                })
                return false
            }
        }else{
            useToast().error({
                title: 'Error!',
                message: 'Debe seleccionar una opción',
                timeout: 3000,
                position: 'center',
                layout: 2,
                // ...options,
            })
            return false
        }
    }
    const checkOption = (index: number) => {
        opciones.value.forEach((opt,i) => {
            if(i === index) opt.select = true
            else opt.select = false
        });
    }
</script>

<!-- <style scoped>

</style> -->