from datetime import datetime
import sys
import traceback
import os
import traceback
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import Chroma
from dotenv import load_dotenv

script_dir  =   os.path.dirname(os.path.abspath(__file__))
dotenv_path =   os.path.join(script_dir, "..", ".env")
log_path    =   os.path.join(script_dir, "log_chroma.txt")
timestamp   =   datetime.now().strftime("%Y-%m-%d %H:%M:%S")
load_dotenv(dotenv_path)

if len(sys.argv) < 2:
    with open(log_path, "a") as f:
        f.write(f"{timestamp} - No se recibió id_topic\n")
    sys.exit(1)

topic_id = sys.argv[1]
persist_directory = os.path.join(script_dir, "chroma", f"db_{topic_id}")

os.makedirs(persist_directory, exist_ok=True)

try:
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

    with open(log_path, "a") as f:
        f.write(f"{timestamp} - Base vectorial creada o cargada en: {persist_directory}\n")

    # Crear o cargar base vectorial para topic_id
    vectordb = Chroma(
        persist_directory=persist_directory,
        embedding_function=embeddings
    )

except Exception as e:
    with open(log_path, "a") as f:
        f.write(f"{timestamp} - ERROR creando base vectorial: {str(e)}\n")
        f.write(traceback.format_exc() + "\n")