# scripts/procesar_pdf_embed.py
import sys, os
from datetime import datetime
import traceback
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import Chroma
from dotenv import load_dotenv
import re

# Logs
script_dir = os.path.dirname(os.path.abspath(__file__))
log_path = os.path.join(script_dir, "log_embed.txt")
dotenv_path = os.path.join(script_dir, "..", ".env")
load_dotenv(dotenv_path)

if len(sys.argv) < 4:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    with open(log_path, "a") as f:
        f.write(f"{timestamp} - Faltan parámetros: topic_id, pdf_path y paper_id\n")
    sys.exit(1)

topic_id = sys.argv[1]
pdf_path = sys.argv[2]
paper_id = sys.argv[3]
persist_directory = os.path.join(script_dir, "chroma", f"db_{topic_id}")

os.makedirs(persist_directory, exist_ok=True)

timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def clean_pdf_text(text):
    """Limpia el texto de un PDF para eliminar patrones no deseados."""
    # Eliminar pies de página comunes, números de página, etc.
    text = re.sub(r'Page \d+ of \d+', '', text)
    # Eliminar textos de copyright
    text = re.sub(r'©.*', '', text)
    text = re.sub(r'Published by.*', '', text)    
    # Reemplazar múltiples saltos de línea con uno solo
    text = re.sub(r'\n\s*\n', '\n', text)
    
    return text.strip()

try:
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()

    for doc in documents:
        doc.page_content = clean_pdf_text(doc.page_content)
        doc.metadata["paper_id"] = paper_id

    # splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

    chunks = splitter.split_documents(documents)

    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    vectordb = Chroma(
        persist_directory=persist_directory,
        embedding_function=embeddings
    )

    # Comprobar si ya hay chunks con ese paper_id
    existing = vectordb.similarity_search("", k=1, filter={"paper_id": paper_id})
    if existing:
        with open(log_path, "a") as f:
            f.write(f"{timestamp} - El paper_id={paper_id} ya está indexado. No se agrega de nuevo.\n")
        sys.exit(0)

    # Agregar nuevos documentos
    vectordb.add_documents(chunks)
    vectordb.persist()

    with open(log_path, "a") as f:
        f.write(f"{timestamp} - Embeddings guardados para topic {topic_id}, paper_id {paper_id}\n")

except Exception as e:
    with open(log_path, "a") as f:
        f.write(f"{timestamp} - ERROR: {str(e)}\n")
        f.write(traceback.format_exc() + "\n")