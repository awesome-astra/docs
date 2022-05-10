<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

## Executable Code (REPLIT)

Change values `ASTRA_DB_TOKEN`, `ASTRA_DB_ID`, `ASTRA_DB_REGION`, `ASTRA_DB_KEYSPACE` in the code below and execute with

[![dl](https://dabuttonfactory.com/button.png?t=Download+Project&f=Open+Sans-Bold&ts=14&tc=fff&hp=15&vp=15&w=180&h=50&c=11&bgt=pyramid&bgc=666&ebgc=000&bs=1&bc=444)](https://replit.com/@CLU2/ConnectToAstra.zip)

<iframe frameborder="0" width="100%" height="800px" src="https://replit.com/@CLU2/ConnectToAstra?lite=true"></iframe>

## Mermaids

### 1️⃣ Flow

**Cassandra**

=== "Graph"

    ```mermaid
    graph LR
        user>fa:fa-user Developer]-- Create Database --> cassandra[(fa:fa-database Cassandra)]

        user-- Design -->usecase{{fa:fa-cube Use Case}}
        usecase-- Workflow -->queries[fa:fa-bezier-curve queries]
        usecase-- MCD -->entities[fa:fa-grip-vertical entities]
        queries-- Chebotko modelization -->schema[fa:fa-list schema]
        entities-- Chebotko modelization -->schema[fa:fa-list schema]
        schema[fa:fa-list  schema]-- Inject -->cassandra[(fa:fa-database Cassandra)]

        user-- prepare -->dataset{{fa:fa-coings DataSet}}
        dataset-- input -->dsbulk-- load data -->cassandra

        user-- Create Token -->token{{fa:fa-key Token}}
        usecase-->API

        API-->Request
        token-->Request
        schema-->Request
        Request-- invoke -->cassandra
    ```

=== "Code"

    ```bash
    graph LR
        user>fa:fa-user Developer]-- Create Database --> cassandra[(fa:fa-database Cassandra)]

        user-- Design -->usecase{{fa:fa-cube Use Case}}
        usecase-- Workflow -->queries[fa:fa-bezier-curve queries]
        usecase-- MCD -->entities[fa:fa-grip-vertical entities]
        queries-- Chebotko modelization -->schema[fa:fa-list schema]
        entities-- Chebotko modelization -->schema[fa:fa-list schema]
        schema[fa:fa-list  schema]-- Inject -->cassandra[(fa:fa-database Cassandra)]

        user-- prepare -->dataset{{fa:fa-coings DataSet}}
        dataset-- input -->dsbulk-- load data -->cassandra

        user-- Create Token -->token{{fa:fa-key Token}}
        usecase-->API

        API-->Request
        token-->Request
        schema-->Request
        Request-- invoke -->cassandra
    ```

**Example #1**

=== "Output"

    ```mermaid
    graph TD;
      A-->B;
      A-->C;
      B-->D;
      C-->D;
    ```

=== "Markdown"

    ```
       ```mermaid
       graph TD;
         A-->B;
         A-->C;
         B-->D;
         C-->D;
       ```
    ```

**Example3**

=== "Output"

    ```mermaid
    graph TD
      A[Hard] -->|Text| B(Round)
      B --> C{Decision}
      C -->|One| D[Result 1]
      C -->|Two| E[Result 2]
    ```

=== "Markdown"

    ```
       ```mermaid
       graph TD
         A[Hard] -->|Text| B(Round)
         B --> C{Decision}
         C -->|One| D[Result 1]
         C -->|Two| E[Result 2]
       ```
    ```

### 2️⃣ Sequence

=== "Output"

    ```mermaid
    sequenceDiagram
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
    ```

=== "Markdown"

    ```
       ```mermaid
       sequenceDiagram
       Alice->>John: Hello John, how are you?
       loop Healthcheck
           John->>John: Fight against hypochondria
       end
       Note right of John: Rational thoughts!
       John-->>Alice: Great!
       John->>Bob: How about you?
       Bob-->>John: Jolly good!

       ```
    ```

### 3️⃣ Gantt

=== "Output"

    ```mermaid
    gantt
    section Section
    Completed :done,    des1, 2014-01-06,2014-01-08
    Active        :active,  des2, 2014-01-07, 3d
    Parallel 1   :         des3, after des1, 1d
    Parallel 2   :         des4, after des1, 1d
    Parallel 3   :         des5, after des3, 1d
    Parallel 4   :         des6, after des4, 1d
    ```

=== "Markdown"

    ```
       ```mermaid
       gantt
       section Section
       Completed :done,    des1, 2014-01-06,2014-01-08
       Active        :active,  des2, 2014-01-07, 3d
       Parallel 1   :         des3, after des1, 1d
       Parallel 2   :         des4, after des1, 1d
       Parallel 3   :         des5, after des3, 1d
       Parallel 4   :         des6, after des4, 1d

       ```
    ```

### 4️⃣ Class

=== "Output"

    ```mermaid
    classDiagram
    Class01 <|-- AveryLongClass : Cool
    <<interface>> Class01
    Class09 --> C2 : Where am i?
    Class09 --* C3
    Class09 --|> Class07
    Class07 : equals()
    Class07 : Object[] elementData
    Class01 : size()
    Class01 : int chimp
    Class01 : int gorilla
    class Class10 {
     <<service>>
     int id
     size()
    }
    ```

=== "Markdown"

    ```
       ```mermaid
       classDiagram
       Class01 <|-- AveryLongClass : Cool
       <<interface>> Class01
       Class09 --> C2 : Where am i?
       Class09 --* C3
       Class09 --|> Class07
       Class07 : equals()
       Class07 : Object[] elementData
       Class01 : size()
       Class01 : int chimp
       Class01 : int gorilla
       class Class10 {
        <<service>>
        int id
        size()
       }

       ```
    ```

### 5️⃣ State

=== "Output"

    ```mermaid
    stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
    ```

=== "Markdown"

    ```
       ```mermaid
       stateDiagram-v2
       [*] --> Still
       Still --> [*]
       Still --> Moving
       Moving --> Still
       Moving --> Crash
       Crash --> [*]

       ```
    ```

### 6️⃣ Pie

=== "Output"

    ```mermaid
    pie
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
    ```

=== "Markdown"

    ```
       ```mermaid
       pie
       "Dogs" : 386
       "Cats" : 85
       "Rats" : 15

       ```
    ```

### 7️⃣ Journey

=== "Output"

    ```mermaid
    journey
      title My working day
      section Go to work
        Make tea: 5: Me
        Go upstairs: 3: Me
        Do work: 1: Me, Cat
      section Go home
        Go downstairs: 5: Me
        Sit down: 3: Me
    ```

=== "Markdown"

    ```
       ```mermaid
       journey
        title My working day
        section Go to work
          Make tea: 5: Me
          Go upstairs: 3: Me
          Do work: 1: Me, Cat
        section Go home
          Go downstairs: 5: Me
          Sit down: 3: Me

       ```
    ```

### 8️⃣ ER

=== "Output"

    ```mermaid
    erDiagram
      CUSTOMER ||--o{ ORDER : places
      ORDER ||--|{ LINE-ITEM : contains
      CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
    ```

=== "Markdown"

    ```
       ```mermaid
       erDiagram
         CUSTOMER ||--o{ ORDER : places
         ORDER ||--|{ LINE-ITEM : contains
         CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
       ```
    ```

## Sample Blocs

!!! note "THis is a note"

    my note

!!! abstract "abstract"

    my note

!!! info "info"

    info

???+ tip "Sample tip "

    tip

??? question "How to add plugins to the Docker image?"

    Import Stuff

!!! success "Success"

    my note

!!! warning "Sample warning"

    This is so cool.

!!! failure "failure"

    my note

!!! danger "danger"

    danger

!!! bug "bug"

    bug

??? example "Sample example"

    example

!!! warning "Sample warning"

    warning

??? quote "Sample wuote"

    quote

## Tooltip

```sh
wanna a tooltip ? # (1)!
```

1.  Cedrick rock

    ```
    mkdocs serve
    ```

## Icons

### Material

:material-home:

[HERE is the full list](https://fonts.google.com/icons)

### Font Awesome

HTML

<li><i class="fa fa-camera-retro"></i> = fa-camera-retro</li>

MARKDOWN
:fontawesome-brands-git-alt:

[HERE is the full list](https://fontawesome.com/v5/cheatsheet)

### Opticons

:octicons-tag-24: Sample

### Adding buttons

In order to render a link as a button, suffix it with curly braces and add the
`.md-button` class selector to it. The button will receive the selected
[primary color] and [accent color] if active.

```markdown title="Button"
[Subscribe to our newsletter](#){ .md-button }
```

<div class="result" markdown>

[Subscribe to our newsletter][demo]{ .md-button }

</div>

<div class="result" markdown>

[Subscribe to our newsletter][demo]{ .md-button .md-button--primary }

</div>
