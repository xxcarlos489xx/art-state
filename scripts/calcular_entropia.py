# scripts/analizar_entropia.py
import sys
import os
import re
import traceback
from datetime import datetime
import mysql.connector
from dotenv import load_dotenv

# Librerías científicas
import numpy as np
from pypdf import PdfReader
from scipy.stats import entropy
import matplotlib.pyplot as plt

# Librerías de PNL
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from collections import Counter

from langdetect import detect, LangDetectException

# --- Configuración y Logs ---
script_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(script_dir, "..", ".env")
log_path = os.path.join(script_dir, "log_entropy.txt")
load_dotenv(dotenv_path)

def write_log(message):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(f"{timestamp} - {message}\n")

try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
except nltk.downloader.DownloadError:
    write_log("Paquetes de NLTK no encontrados. Ejecuta: nltk.download('punkt') y nltk.download('stopwords')")
    sys.exit(1)

def extract_text_from_pdf(pdf_path):
    try:
        reader = PdfReader(pdf_path)
        text = "".join(page.extract_text() or "" for page in reader.pages)
        return text
    except Exception as e:
        write_log(f"Error extrayendo texto de {pdf_path}: {e}")
        return ""

def preprocess_text(text, language='autodetect'):
    """
    Tokeniza, convierte a minúsculas, elimina puntuación y stopwords.
    Si language es 'autodetect', intentará detectar el idioma.
    """
    detected_language = None
    
    if language == 'autodetect':
        try:
            lang_code = detect(text)
            if lang_code == 'es':
                detected_language = 'spanish'
            elif lang_code == 'en':
                detected_language = 'english'
            # más mapeos de idiomas
            else:
                write_log(f"Idioma detectado '{lang_code}', no soportado para stopwords. Procesando sin ellas.")
                detected_language = None
        except LangDetectException:
            write_log("No se pudo detectar el idioma. Procesando sin stopwords.")
            detected_language = None
    else:
        detected_language = language

    tokens = word_tokenize(text.lower())
    
    stop_words = set()
    if detected_language:
        stop_words = set(stopwords.words(detected_language))
    
    filtered_tokens = [
        word for word in tokens 
        if word.isalpha() and word not in stop_words
    ]
    return filtered_tokens

def calculate_shannon_entropy(tokens):
    """Calcula la entropía de Shannon a partir de una lista de tokens."""
    if not tokens:
        return 0.0
    
    # Contar la frecuencia de cada token
    counts = Counter(tokens)
    # Convertir las cuentas a probabilidades
    probabilities = np.array(list(counts.values())) / len(tokens)
    
    # Calcular entropía usando la base 2 (el resultado estará en "bits")
    return entropy(probabilities, base=2)

def update_sota_db(topic_id, image_path):
    try:
        db_connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        if db_connection.is_connected():
            cursor = db_connection.cursor()
            query = "UPDATE sotas SET img_entropy = %s WHERE topic_id = %s"
            # Ajusta esta lógica según cómo sirvas tus archivos estáticos
            web_path = '/' + os.path.join(*image_path.split(os.sep)[-3:]).replace('\\', '/')
            cursor.execute(query, (web_path, topic_id))
            db_connection.commit()
            write_log(f"Ruta de análisis actualizada en BD - sotas para topic_id: {topic_id}")
    except Exception as e:
        write_log(f"ERROR de MySQL al actualizar ruta: {e}")

# --- Lógica Principal ---
if __name__ == "__main__":
    if len(sys.argv) < 3:
        write_log("Faltan parámetros: sota_id, ruta_sota_pdf y rutas de los PDFs fuente.")
        sys.exit(1)

    topic_id    =   sys.argv[1]
    output_dir  =   sys.argv[2]
    
    write_log(f"Iniciando análisis de entropía para topic_id: {topic_id}")

    try:
        sota_body_pdf_path = os.path.join(output_dir, f'sota_body.pdf')

        # 1. Procesar el SOTA
        sota_text = extract_text_from_pdf(sota_body_pdf_path)
        if not sota_text:
            write_log("El PDF del SOTA está vacío o no se pudo leer.")
        
        sota_tokens     =   preprocess_text(sota_text, language='spanish')
        sota_entropy    =   calculate_shannon_entropy(sota_tokens)
        write_log(f"Entropía del SOTA: {sota_entropy:.4f} bits")

        # 2. Procesar las fuentes (combinadas)
        all_source_tokens = []

        for filename in os.listdir(output_dir):
            if filename.lower().endswith('.pdf') and filename.lower() != 'sota_body.pdf':
                source_path = os.path.join(output_dir, filename)
                write_log(f"  - Procesando fuente: {source_path}")
                
                # Extraer texto del PDF actual
                source_text = extract_text_from_pdf(source_path)
                
                if not source_text.strip():
                    write_log(f"    - Aviso: El archivo {filename} está vacío o no se pudo leer texto.")
                    continue

                # Pre-procesar ESTE TEXTO con autodetección de idioma
                # La función preprocess_text se encarga de detectar y aplicar las stopwords correctas.
                tokens_from_this_source = preprocess_text(source_text, language='autodetect')
                
                # Añadir los tokens limpios de este PDF a la lista general
                all_source_tokens.extend(tokens_from_this_source)
        
        if not all_source_tokens:
            write_log("No se pudo extraer texto de ninguna fuente.")
        
        source_entropy  =   calculate_shannon_entropy(all_source_tokens)
        write_log(f"Entropía de las Fuentes (combinadas): {source_entropy:.4f} bits")

        # 3. Generar la gráfica comparativa
        write_log("Generando gráfica de entropía...")
        labels = ['Fuentes Originales', 'Estado del Arte (SOTA)']
        values = [source_entropy, sota_entropy]

        fig, ax = plt.subplots(figsize=(8, 5))
        bars = ax.bar(labels, values, color=['#4c72b0', '#55a868'])
        ax.set_ylabel('Entropía de Shannon (bits)')
        ax.set_title('Análisis de Diversidad Léxica')
        
        for bar in bars:
            yval = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2.0, yval + 0.1, f'{yval:.2f}', ha='center', va='bottom')

        plt.tight_layout()

        image_path = os.path.join(output_dir, f'entropia.png')
        plt.savefig(image_path)
        write_log(f"Gráfica guardada en: {image_path}")

        update_sota_db(topic_id, image_path)
        
        write_log("Proceso completado.")

    except Exception as e:
        write_log(f"ERROR CRÍTICO durante el análisis de entropía: {e}")
        write_log(traceback.format_exc())
        sys.exit(1)