<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css">

## CheatSheet

### Mermaid

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

### Font Awesome

<i class="fa fa-camera-retro fa-lg"></i> fa-lg
