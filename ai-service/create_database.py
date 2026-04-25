from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
from pathlib import Path
import os
import shutil

load_dotenv()

CHROMA_PATH = "chroma"
DATA_PATH = "data"

def main():
    print("Starting database creation...")

    pdf_files = list(Path(DATA_PATH).glob("**/*.pdf"))
    if not pdf_files:
        print("ERROR: No PDF files found in data/ folder.")
        print("Please add a PDF to the data/ folder and try again.")
        return

    documents = []
    for pdf in pdf_files:
        print(f"  Loading: {pdf.name}")
        loader = PyPDFLoader(str(pdf))
        documents.extend(loader.load())

    print(f"  Loaded {len(documents)} pages")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
    )
    chunks = splitter.split_documents(documents)
    print(f"  Split into {len(chunks)} chunks")

    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
        print("  Cleared old database")

    print("  Generating embeddings with Google GenAI (this takes a minute)...")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
    
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embeddings)
    import time
    batch_size = 50
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        print(f"  Adding batch {i//batch_size + 1}/{(len(chunks)-1)//batch_size + 1}...")
        try:
            db.add_documents(batch)
            time.sleep(5)
        except Exception as e:
            print(f"Error on batch: {e}. Sleeping 60s...")
            time.sleep(60)
            db.add_documents(batch)

    print(f"Done! Database created with {len(chunks)} chunks.")


if __name__ == "__main__":
    main()
