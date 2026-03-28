# RAG (Ready) Folder Structure

This folder is reserved for your Retrieval-Augmented Generation pipeline.

Planned components:
- `loaders/` : load docs (PDF/text/URLs) into raw text
- `chunkers/` : split documents into chunks
- `embeddings/` : create embeddings for chunks
- `vectorStores/` : store/retrieve embeddings (e.g., local, Pinecone, Chroma)
- `prompts/` : system/user prompt templates

Later you can implement:
- document ingestion script
- a chat endpoint that uses retrieved context

