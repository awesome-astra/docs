Markdowns to generate the static site https://awesome-astra.github.io/docs

 [![Awesome](https://awesome.re/badge-flat.svg)](https://awesome.re)

Static site is generated on branch `gh-pages` using a github action

## Run the website locally

### 1. Installation 

```bash
python3 -m pip install --upgrade pip     # install pip
python3 -m pip install mkdocs            # install mkdocs 
python3 -m pip install mkdocs-material   # install material theme
python3 -m pip install https://github.com/bmcorser/fontawesome-markdown/archive/master.zip   # install font-awesome
python3 -m pip install mkdocs-git-revision-date-plugin # install git revision date
```

Or use this one-liner :) 

```
python3 -m pip install --upgrade pip && python3 -m pip install mkdocs mkdocs-material https://github.com/bmcorser/fontawesome-markdown/archive/master.zip mkdocs-git-revision-date-plugin
```

### 2. Run 

```
mkdocs serve
```

You should be able to access it on http://localhost:8000

**Known Issue:**

If you get an `mkdocs not found error`, launch it this way: `python3 -m mkdocs serve`

### 3. Instructions

#### Images

**Caution**: when running locally, the site is served at `http://127.0.0.1:8000/pages/[...]`
while when deployed, it is at `https://awesome-astra.github.io/docs/pages/[...]`.

This means that if you use "absolute" image URLs such as `/img/ETC ETC` one will work
and the other won't. Unfortunately you have to always use relative paths and climb up
the ladder with `../../../../img/ETC ETC` !

In other words, **if you use `"/img/tile-java.png"` it will render OK locally and
then screw up once deployed**.

Also, when calculating the number of `..` to insert, count ONE LESS for `index.md` files as opposed to all other `md` files:
`index.md` renders as the page for the path containing it (`a/b/c/index.md` renders the URL `a/b/c`).

For company logo files, SVG format is preferred to PNG.
