import os
import sys
from datetime import datetime

script_dir = os.path.dirname(os.path.abspath(__file__))
log_path = os.path.join(script_dir, "log.txt")

parametro_recibido = "No se recibió parámetro"

if len(sys.argv) > 1:
    parametro_recibido = sys.argv[1] # Primer argumento

# Manejar múltiples argumentos:
# if len(sys.argv) > 2:
#     otro_parametro = sys.argv[2]

with open(log_path, "a", encoding="utf-8") as f:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    f.write(f"[{timestamp}] Script Python ejecutado.\n")
    f.write(f"[{timestamp}] Parámetro recibido: {parametro_recibido}\n")
    # if 'otro_parametro' in locals(): # otro_parametro
    #     f.write(f"[{timestamp}] Otro parámetro: {otro_parametro}\n")
    f.write("---------------------------------------\n")