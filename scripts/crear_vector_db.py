from datetime import datetime
import sys
import chromadb
from chromadb.config import Settings
import traceback
from chromadb.errors import NotFoundError
import os
import traceback

script_dir  =   os.path.dirname(os.path.abspath(__file__))
log_path    =   os.path.join(script_dir, "log.txt")
timestamp   =   datetime.now().strftime("%Y-%m-%d %H:%M:%S")

id_topic = "No se recibió id" 

if len(sys.argv) > 1:
    id_topic = sys.argv[1]
    try:
        # print("Directorio actual:", os.getcwd())
        db_name = f"db_{id_topic}"
        client = chromadb.PersistentClient() 

        try:
            collection = client.get_collection(db_name)
        except NotFoundError:
            collection = client.create_collection(db_name)

        with open(log_path, "a") as f:
            f.write(f"{timestamp} - Base vectorial creada: {db_name}\n")

    except Exception as e:
        with open(log_path, "a") as f:
            f.write(f"{timestamp} - ERROR creando base vectorial: {e}\n")
            f.write(traceback.format_exc() + "\n")
else:
    with open(log_path, "a", encoding="utf-8") as f:
        f.write(f"[{timestamp}] Parámetro recibido: {id_topic}\n")
        f.write("---------------------------------------\n")