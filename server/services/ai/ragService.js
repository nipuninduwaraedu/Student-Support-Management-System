// RAG service placeholder.
// Later you will implement:
// - document ingestion (load -> chunk -> embed -> store)
// - retrieval (query -> embed -> vector search)
// - answer generation (LLM + retrieved context)

function createRagService() {
  return {
    // eslint-disable-next-line no-unused-vars
    async answerQuestion({ question }) {
      throw new Error("RAG not implemented yet.");
    },
  };
}

module.exports = { createRagService };

