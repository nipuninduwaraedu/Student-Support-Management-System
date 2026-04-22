from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
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

    print("  Generating embeddings with OpenAI (this takes a minute)...")
    embeddings = OpenAIEmbeddings()
    Chroma.from_documents(chunks, embeddings, persist_directory=CHROMA_PATH)

    print(f"Done! Database created with {len(chunks)} chunks.")


if __name__ == "__main__":
    main()
