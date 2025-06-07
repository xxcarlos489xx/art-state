import os
from langchain_google_genai.embeddings import GoogleGenerativeAIEmbeddings
from langchain.vectorstores import Chroma

script_dir = os.path.dirname(os.path.abspath(__file__))
topic_id = "testtopic"
persist_directory = os.path.join(script_dir, "chroma", f"db_{topic_id}")

os.makedirs(persist_directory, exist_ok=True)

embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

vectordb = Chroma(
    persist_directory=persist_directory,
    embedding_function=embeddings
)

print("Persist directory used:", persist_directory)
