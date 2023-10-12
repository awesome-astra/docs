---
title: "LlamaIndex"
description: "LlamaIndex is an open-source framework to build applications based on Large Language Models (LLMs)."
tags: "python, third party tools, genai, llm, vector, vectors, prompt, gpt"
icon: "https://awesome-astra.github.io/docs/img/llamaindex/llamaindex.svg"
recommended: "true"
developer_title: "Jerry Liu"
developer_url: "https://gpt-index.readthedocs.io/en/latest"
links:
- title: "LlamaIndex documentation"
  url: "https://gpt-index.readthedocs.io/en/latest"
- title: "CassIO"
  url: "https://cassio.org/frameworks/llamaindex/about/"
---

<div class="nosurface" markdown="1">

<img src="../../../../img/llamaindex/llamaindex_logo.png"  style="height: 180px;" />

</div>

## Overview

[LlamaIndex](https://gpt-index.readthedocs.io/en/latest), formerly GPT Index, is a Python data framework designed to manage and structure LLM-based applications, with a particular emphasis on storage, indexing and retrieval of data.

LlamaIndex provides a complete set of tools to automate tasks such as data ingestion from heterogeneous sources (PDF files, Web pages, ...) and retrieval-augmented generation (RAG); it also features a rich ecosystem of plugins that make it possible to connect with third-party components, from vector stores to data readers.

<div class="nosurface" markdown="1">
Reference documentation:

- ℹ️ [LlamaIndex documentation](https://docs.langchain.com/docs/)
- ℹ️ [CassIO](https://cassio.org/frameworks/llamaindex/about/)

</div>

## Reasons for using LamaIndex

When working with LLMs, one often needs to augment the power of a model (which comes
equipped with general knowledge already) by supplying domain-specific, possibly
proprietary data, such as internal reports, a corpus of PDF presentations, and so on.

Effective, reproducible management of this domain-specific data needed to augment the LLMs
requires a fair amount
of machinery, which is precisely what LlamaIndex offers: the framework supports
several indexing and retrieval techniques, ranging from simple to quite sophisticated,
and offers plugin for seamless integration with a variety of third-party products.

## Astra DB + LlamaIndex

One of the important abstractions in LlamaIndex is that of the "vector store",
a general interface which allows usage of most vector-capable storage systems
within LlamaIndex.

Recently, support for Astra DB and Apache Cassandra®, as one of the
available vector stores, was introduced. This makes it possible to run advanced
LLM workloads natively in LlamaIndex while at the same time using Astra DB as
the storage backend.

The Astra integration for LlamaIndex is powered by the
open-source `cassIO` library, which provides a set of standardized facilities to interact
with Astra DB (and Cassandra) through the patterns typically needed by ML/LLM applications.

### Vector Store

Creating a vector store in Astra with the LlamaIndex abstractions is as simple
as these few lines of Python code:

```python
from llama_index.vector_stores import CassandraVectorStore

vector_store = CassandraVectorStore(
    session=session,
    keyspace=keyspace,
    table=table_name,
    embedding_dimension=vector_dimension,
)
```

You can then use the store within most LlamaIndex native higher-level abstractions,
such as `VectorStoreIndex`, and within complex LLM-based pipelines, such as
the "query engines" to run question-answering interactions, in just a few lines
of code. **Metadata filtering** is also supported for vector-based document retrieval.

For full working examples, and more, please head over to the
[CassIO pages](https://cassio.org/frameworks/llamaindex/about/)
dedicated to LlamaIndex.

### Future integrations

Other LlamaIndex integrations with Astra DB / Cassandra are planned,
such as a "table reader" for seamless use within the rest of the LlamaIndex
ecosystem.

## Find out more!

You just caught a glimpse of what is possible with LangChain and Astra DB.

Do you want to know more? Visit [cassio.org](https://cassio.org) for full tutorials,
setup guides and other resources.
