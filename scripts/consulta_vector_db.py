# scripts/consulta_vector_db.py
import sys
import os
from datetime import datetime
import traceback
import mysql.connector

from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.vectorstores import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema.output_parser import StrOutputParser
from dotenv import load_dotenv

# --- CONFIGURACIÓN Y LOGS (Consistente con tus otros scripts) ---
script_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(script_dir, "..", ".env")
log_path = os.path.join(script_dir, "log_sota.txt")
load_dotenv(dotenv_path)

def write_log(message):
    """Función para escribir en el log con timestamp."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(f"{timestamp} - {message}\n")

# --- LÓGICA PRINCIPAL ---
if __name__ == "__main__":
    if len(sys.argv) < 3:
        write_log("Faltan parámetros: se requiere topic_id y topic_title.")
        sys.exit(1)

    topic_id = sys.argv[1]
    topic_title = sys.argv[2] # El título o tema de la investigación
    persist_directory = os.path.join(script_dir, "chroma", f"db_{topic_id}")
    
    write_log(f"Iniciando generación de SOTA para topic_id: {topic_id} con título: '{topic_title}'")

    try:
        # 1. Cargar la base de datos vectorial existente
        embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
        vectordb = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings
        )
        
        # 2. Crear un "retriever" para buscar documentos relevantes
        # k=15 significa que buscará los 15 chunks más relevantes al tema
        retriever = vectordb.as_retriever(search_kwargs={"k": 10})
        # retriever = vectordb.as_retriever(search_kwargs={"k": 20})
        # retriever = vectordb.as_retriever(search_kwargs={"k": 25})


        # 3. Definir el prompt para Gemini
        # Este es el corazón de la operación. Le damos instrucciones muy precisas.
        template = """
        Eres un experto investigador académico especializado en la redacción de revisiones de literatura y estados del arte (State of the Art).
        Tu tarea es sintetizar la información proporcionada para construir una sección de "Estado del Arte" coherente, bien estructurada y académica sobre el siguiente tema de investigación.

        TEMA DE INVESTIGACIÓN: "{question}"

        Utiliza ÚNICAMENTE la siguiente información extraída de documentos académicos como base para tu redacción. No inventes información ni utilices conocimiento externo. Cita las fuentes cuando sea relevante, usando el 'paper_id' que se encuentra en los metadatos de los documentos.

        CONTEXTO (FUENTES):
        {context}

        INSTRUCCIONES ADICIONALES:
        - Si encuentras información contradictoria entre las fuentes, menciónalo explícitamente en tu análisis (ej: "Mientras que el autor X (paper_id_1) argumenta que..., el autor Y (paper_id_2) presenta una visión opuesta...").
        - Sintetiza y agrupa los hallazgos comunes entre múltiples fuentes para identificar las ideas principales en el campo.

        INSTRUCCIÓN CRÍTICA: 
        Si el CONTEXTO proporcionado no contiene información relevante o suficiente para responder de manera significativa a la solicitud sobre el TEMA DE INVESTIGACIÓN, responde únicamente con el siguiente mensaje y nada más: "No se encontró información relevante en los documentos proporcionados para generar un Estado del Arte sobre este tema."

        INSTRUCCIONES DE FORMATO:
        - Comienza con una introducción que presente el tema y su importancia.
        - Organiza el cuerpo del texto en párrafos temáticos, agrupando ideas similares de diferentes fuentes.
        - Finaliza con una breve conclusión que resuma los hallazgos principales e identifique posibles vacíos en la investigación actual (gaps).
        - Mantén un tono formal y objetivo.

        ESTADO DEL ARTE GENERADO:
        """
        prompt = ChatPromptTemplate.from_template(template)

        # 4. Configurar el modelo de Gemini
        llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-lite", temperature=0.3, convert_system_message_to_human=True)
        
        # 5. Crear la "cadena" de RAG (Retrieval-Augmented Generation)
        # Esto conecta el retriever, el prompt y el modelo en un flujo de trabajo.
        rag_chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )

        # 6. Ejecutar la cadena y generar el SOTA
        write_log(f"Invocando la cadena RAG con Gemini para el topic '{topic_title}'...")
        sota_result = rag_chain.invoke(topic_title)
        write_log(f"SOTA generado exitosamente...")
        write_log(sota_result)
        
        # write_log(f"SOTA generado exitosamente. Guardando en la base de datos...")

        # 7. Guardar el resultado en la base de datos MySQL
        # update_topic_sota_in_db(topic_id, sota_result)
        
        write_log("Proceso completado.")

    except Exception as e:
        write_log(f"ERROR CRÍTICO durante la generación de SOTA: {str(e)}")
        write_log(traceback.format_exc())
        # Opcional: podrías actualizar la BD con un estado de error
        # update_topic_status(topic_id, "error")
        sys.exit(1)