Welcome to your ultimate solution for AI/ML workloads: DataStax Astra. As the demand for robust and scalable artificial intelligence (AI) and machine learning (ML) applications continues to grow, Astra DB provides the power, efficiency, and scalability your systems need to deliver real-time results.

In the ever-evolving landscape of AI, Astra is perfect for meeting the high data demands and complex workload patterns associated with these applications. It's not just about the volume of data; it's about the speed and flexibility with which you can manipulate and interpret it. That's where Astra shines. Its cloud-native, scalable database service is designed to manage your AI/ML data effortlessly, no matter the scale or complexity.

In the upcoming sections, we'll show you the essential tools and knowledge to kickstart your journey with Astra DB for your AI applications.

Get ready to dive into the world of AI/ML with DataStax Astra, which doesn't just meet your data needs - it exceeds them. With Astra DB's robust infrastructure, you'll have everything you need to harness the true power of generative AI and other AI/ML applications, delivering solutions that are not just innovative, but transformative.

## Generative AI / LLMs

Let's focus on one of the most promising and fascinating realms of AI: Generative AI. This cutting-edge technology uses advanced ML models to generate new, original content, requiring the power, speed, and reliability that Astra provides.

A very important topic in Generative AI is that of LLMs, or "Large Language Models".
These are essentially free-form "text in, text out" functions.
Efficient interaction with these models is best done through frameworks that abstract away most
of the low-level operations.

### Vector Search capabilities

Astra DB is now equipped with a feature that is very important for advanced
language-model-related tasks: namely, **Vector Search capability**. (Note:
at the time of writing, this feature is being added to OSS Cassandra as well.)

The practical implication of this is that Astra DB can store,
and efficiently retrieve, pieces of text based on "semantic similarity":
this enables many powerful workloads such as question-answering over
a (possibly very large) knowledge base, retrieval of relevant parts
of a long past conversation, or a caching system that is oblivious of the exact
phrase used to express a concept.

??? info "What's in a Vector?"

    The general idea is that at storing time a piece of unstructured data (the phrase)
    is made into a "vector" (a list of numbers), which is then used at retrieval
    time to assess how "semantically similar" each item is to a given search "term" (a vector itself).

    It may be not immediately clear what exactly the data in a vector is there to represent.
    How does a piece of data, e.g. a paragraph of text, get converted into a vector,
    and why do we want that in the first place? 

    When we have data in the form of a vector, it's computationally simple to compare two pieces of data for similarity by measuring how close vectors are to each other. Which means that if we know how to represent a particular piece of data as a vector, then we have a way to find similar data based on the vector proximity. So, the utility is pretty apparent, but we still haven't answered "how".

    The process by which data is converted into a vector is called "embedding". There are various embedding libraries for all kinds of different data types and purposes. An embedding library analyzes a datum in the context of the data type that it was created for, and outputs a vector representation. Input that is substantially similar will produce output vectors that are geometrically close, and inputs that bear no similarity will be geometrically far apart. So, in particular, two sentences that express the same concept
    with different words and constructions will correspond to two vectors that are very close to each other.

### Integrations

The Astra team is working hard to provide Astra-specific integrations with more and more
GenAI-oriented frameworks. Pick the tile corresponding to your stack to learn more:

<a href="llm/langchain">
 <img src="../../img/langchain/tile-langchain.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp;

## Traditional ML workloads

Many ML applications, especially those around supervised learning,
take advantage of specialized infrastructure, such as Feature Stores.

Here is a collection of the main integrations with Astra that can power
your ML/Real-Time AI application.
Pick the solution you are interested in:

<a href="../tools/integration/feast/">
 <img src="../../img/tile-feast.png" height="130px" width="130px"/>
</a>&nbsp;&nbsp;
