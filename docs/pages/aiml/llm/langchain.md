---
title: "LangChain"
description: "LangChain is an open-source framework to automate usage of Large Language Models (LLMs)."
tags: "python, third party tools, genai, llm, vector, vectors, prompt, gpt"
icon: "https://awesome-astra.github.io/docs/img/langchain/langchain.svg"
recommended: "true"
developer_title: "Harrison Chase"
developer_url: "https://python.langchain.com/"
links:
- title: "LangChain documentation"
  url: "https://docs.langchain.com/docs/"
- title: "LangChain Python docs"
  url: "https://python.langchain.com/"
- title: "CassIO"
  url: "https://cassio.org/frameworks/langchain/about/"
---

<div class="nosurface" markdown="1">

<img src="../../../../img/langchain/langchain_logo.png"  style="height: 180px;" />
</div>

## Overview

[LangChain](https://docs.langchain.com/docs/) is a popular and rapidly evolving
framework to automate most of the management of, and interaction with, large language
models (LLMs): among its features are support for memory, vector-based similarity search,
an advanced prompt templating abstraction and much more.

LangChain comes with a Python and a Javascript implementation. This section
targets the Python version.

<div class="nosurface" markdown="1">
Reference documentation:

- ℹ️ [LangChain documentation](https://docs.langchain.com/docs/)
- ℹ️ [LangChain Python docs](https://python.langchain.com/)
- ℹ️ [CassIO](https://cassio.org/frameworks/langchain/about/)

</div>

## Benefits of LangChain

Essentially, interacting with a LLM amounts to this: some free-form text
is sent to it, and the model "responds" by producing other text. That's it.

This is the starting point for a wide variety of
tasks, from translations to question answering, from code completion to
chatbot assistants, and so on. But how exactly are all those more complex
usages constructed out of the simple "text in, text out" building block?

This is where the power of LangChain comes in. The framework makes it easier
to manage the handling of typical LLM-oriented tasks such as constructing
prompts programmatically, parsing the output back to a structured form,
providing memory of past interactions, and so on.

Further, LangChain's modularity means it can work regardless of the actual
service providing the core LLM functionality
(OpenAI, Google PaLM, Azure OpenAI, AWS SageMaker LLMs ...).
LangChain also offers a modular set of abstractions, so that one can stack
them on top of each other and design complex LLM applications with minimal boilerplate.

## Astra DB + LangChain

There are several tasks that benefit from the Astra integration for LangChain,
as there are many different reasons to augment the power of an LLM with the kind
of persistent storage Astra DB can offer.

Generally speaking, the Astra integration for LangChain builds on top of the
open-source `cassIO` library, which provides a set of standardized facilities to interact
with Astra DB (and Cassandra) through the patterns typically needed by ML/LLM applications.
The `cassIO` library is framework-agnostic: it is in turn used by the Astra-specific
extensions of any specific framework (such as LangChain).

The integration takes advantage of Astra DB's Vector Search capabilities, so that
it is possible to run advanced LLM workloads, based on semantic similarity,
without leaving your Astra DB storage backend.

### Usage Examples

The LangChain integration for Astra DB is documented in detail in the LangChain
section of the `cassIO` website, with complete tutorials and sample applications.

Have a look at what this integration enables ... and to learn more, and stay up
to date, check out the `cassIO` homepage!

#### Caching

Save on latencies and token costs by using Astra DB as a cache
for the responses to frequently-used prompts:

```python
langchain.llm_cache = CassandraCache(
    session=session,
    keyspace=keyspace,
)

llm("What is the best way to peel a tomato?")       # 1-2 seconds

...

llm("What is the best way to peel a tomato?")       # milliseconds
```

You can make the cache semantically-aware as well:

```python
langchain.llm_cache = CassandraSemanticCache(
    session=session,
    keyspace=keyspace,
    embedding=myEmbedding,
)

llm("What is the best way to peel a tomato?")       # 1-2 seconds

...

llm("Tell me how do I best peel tomatoes.")         # milliseconds
```

#### Prompt management

You can attach one or more Astra DB tables to a prompt template, so that
at "rendering time" the DB is queried and the relevant values are injected
into the prompt with minimal boilerplate:

```python
ctemplate0 = """
You are helpful a tech support chatbot providing assistance to a human user.
The user's name is {user_name}, from this city: {user_city}.

Please provide an answer to the user's question below.

USER: {user_question}
YOUR ANSWER:"""

cassPrompt = createCassandraPromptTemplate(
    session=session,
    keyspace=keyspace,
    template=ctemplate0,
    input_variables=['user_id', 'user_question'],
    field_mapper={
        # template-variable: (table-name, column-name)
        'user_name': ('users', 'u_name'),
        'user_city': ('users', 'u_city'),
    },
)

...

finalPrompt = cassPrompt.format(
    user_id='fc4ab05',
    user_question='How do I ...',
)
```

#### Memory

Give LLMs a memory of past interactions stored in an Astra table and
leave it to LangChain to retrieve previous exchanges and store the new ones
as the conversation proceeds:

```python
message_history = CassandraChatMessageHistory(
    session_id='my-session-id',
    session=session,
    keyspace=keyspace,
)

cassBuffMemory = ConversationBufferMemory(
    chat_memory=message_history,
)

conversation = ConversationChain(
    llm=llm, 
    memory=cassBuffMemory,
)

conversation.predict(input="Hello, what can you tell me about rainforests?")
```

The base `CassandraChatMessageHistory` works as well when you ask LangChain
to keep a separate "summary" of the whole past conversation, which is automatically
updated and injected into each new interaction:

```python
memory = ConversationSummaryBufferMemory(
    llm=llm,
    chat_memory=message_history,
    max_token_limit=180,
)

summaryConversation = ConversationChain(
    llm=llm, 
    memory=memory,
)
```

Alternatively, you can have a semantically aware memory element, able to
pick the most relevant exchanges occurred and make the LLM aware of them
regardless of how far back they took place:

```python
cassVStore = Cassandra(
    session=session,
    keyspace=keyspace,
    embedding=myEmbedding,
)

retriever = cassVStore.as_retriever(search_kwargs={'k': 3})

semanticMemory = VectorStoreRetrieverMemory(retriever=retriever)

semanticMemoryTemplateString = ...

memoryPrompt = PromptTemplate(
    input_variables=["history", "input"],
    template=semanticMemoryTemplateString
)

conversationWithVectorRetrieval = ConversationChain(
    llm=llm, 
    prompt=memoryPrompt,
    memory=semanticMemory,
)

conversationWithVectorRetrieval.predict(
    input="Do you remember what I told you about rainforests?"
)
```

#### Question answering

With the help of Vector Search, applications such as natural-language
question answering over documents are made easy. Once the input
documents are loaded and indexed,

```python
index_creator = VectorstoreIndexCreator(
    vectorstore_cls=Cassandra,
    embedding=myEmbedding,
    vectorstore_kwargs={
        'session': session,
        'keyspace': keyspace,
    },
)

loader = ...

index = index_creator.from_loaders([loader])
```

a Q&A session is just a single line of code:

```python
index.query("How do I restore a deleted file?", llm=llm)
```

## Find out more!

You just caught a glimpse of what is possible with LangChain and Astra DB.

Do you want to know more? Visit [cassio.org](https://cassio.org) for full tutorials,
setup guides and other resources.
