from datetime import datetime
import sys

def crear_base_vectorial(id_topic):
    db_name = f"db_{id_topic}"
    # print(f"Creando base vectorial: {db_name}")
    # lógica para crear la base con Chroma o lo que uses
    with open("scripts/log.txt", "a") as f:
        f.write(f"Creando base vectorial:  {db_name} - {datetime.now()}\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: falta id del topic")
        sys.exit(1)
    
    id_topic = sys.argv[1]
    crear_base_vectorial(id_topic)
