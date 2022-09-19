---
title: "MindsDB"
description: "MindsDB enables you to use your data and make forecasts. It speeds up the ML development process by bringing machine learning into the database. With MindsDB, you can build, train, optimize, and deploy your ML models without the need for other platforms. And to get the forecasts, simply query your data and ML models."
tags: "python, data management, machine learning"
icon: "https://awesome-astra.github.io/docs/img/mindsdb/MindsDBColorPurp_3x.png"
developer_title: "MindsDB"
developer_url: "https://mindsdb.com/"
links:
- title: "MindsDB Quick Install"
  url: "https://docs.mindsdb.com/"
---

<div class="nosurface" markdown="1">
- _This article was originally written by **Steven Matison** on [Datastax JIRA](https://datastax.jira.com/wiki/spaces/TIB/blog/2022/01/26/3284566227/How+to+use+Astra+with+MindsDB)_

<img src="../../../../img/mindsdb/MindsDBColorPurp_3x.png" height="50px" />
</div>

This page will go into details about what I had to do to build the project, modify the `cassandra.py` and `scylla_ds.py`, and get mindsdb GUI connected to Astra.

- **Source Repo:** [GitHub - mindsdb/mindsdb](https://github.com/mindsdb/mindsdb)
- **My Fork:** [ds-steven-matison/mindsdb](https://github.com/ds-steven-matison/mindsdb)
- **Docs:** [https://docs.mindsdb.com/](https://docs.mindsdb.com/)

#### Files Changed

```
/root/mindsdb/lib64/python3.6/site-packages/mindsdb_datasources/datasources/scylla_ds.py
```

- _Path here is correct. “lib64” not part of repo, so I put scylla_ds.py in repo so you can see source code here: [github diff](https://github.com/ds-steven-matison/mindsdb/commit/51d6936d49e0597e47cc7dac24785d2f775f3ea4#diff-9ad8948ab6e9e5fbdfa34873eb019faa3069f62c2297acbb50791ba70af43e9f)_

```
/root/mindsdb/lib64/python3.6/site-packages/mindsdb_datasources/cassandra.py
```

- Changes diff in repo here: [github diff](https://github.com/ds-steven-matison/mindsdb/commit/51d6936d49e0597e47cc7dac24785d2f775f3ea4#diff-23fdac8240db507d6205637ba90dcb72f825d939bf44d5ada16ea4ebfeee0175)

### Git Status

```bash
Untracked files:
  (use "git add <file>..." to include in what will be committed)
	LICENSE.txt
	MindsDB.egg-info/
	bin/
	config.json
	include/
	lib/
	lib64
	mindsdb/integrations/cassandra/cassandra.py.bk
	mindsdb/integrations/cassandra/tmp.py
	pip-selfcheck.json
	share/
```

### Terminal History

```bash
  503  python -v
  504  python -version
  505  ls
  506  python3 -v
  507  python3 -m venv mindsdb
  508  source mindsdb/bin/activate
  509  pip3 install mindsdb
  510  pip3 install Cython
  511  pip3 install mindsdb
  512  pip3 install sentencepiece
  513  pip3 freeze
  514  pip install --upgrade pip
  515  pip3 install sentencepiece
  516  pip3 install mindsdb
  517  pip3 freeze
  518  python3 -m mindsdb
  533  pip3 install mindsdb
  548  pip3 install cassandra-driver
  549  python3 -c 'import cassandra; print (cassandra.__version__)'
  570  python3 mindsdb_cassandra.py
  571  nano mindsdb_cassandra.py
  572  python3 mindsdb_cassandra.py
  573  python3 -m mindsdb --api=mysql --config=config.json
  574  pip3 uninstall mindsdb
  577  git clone https://github.com/ds-steven-matison/mindsdb.git
  578  cd mindsdb/mindsdb/integrations/cassandra/
  579  ls
  580  nano cassandra.py
  581  cp cassandra.py cassandra.py.bk
  582  nano cassandra.py
  588  pip3 install -r requirements.txt
  592  pip3 install cassandra-driver
  636  cp secure-connect-mindsdb.zip /tmp
  637  chmod 755 /tmp/secure-connect-mindsdb.zip
  654  pip3 freeze
  658  pip3 install cassandra-driver
  659  python3 -c 'import cassandra; print (cassandra.__version__)'
  662  nano /root/mindsdb/lib64/python3.6/site-packages/mindsdb_datasources/cassandra.py
  669  nano ./mindsdb/lib/python3.6/site-packages/cassandra/cluster.py
  670  nano /root/mindsdb/lib64/python3.6/site-packages/mindsdb_datasources/datasources/scylla_ds.py
  672  python3 -m venv mindsdb
  673  source mindsdb/bin/activate
  674  cd mindsdb && pip3 install -r requirements.txt
  675  pip install --upgrade pip
  676  pip3 install --upgrade pip
  677  pip3 install -r requirements.txt
  678  python setup.py develop
  683  mkdir /storage
  695  install mindsdb_native[cassandra]
  696  pip3 install mindsdb-sdk
  721  nano config.json
  722  python3 -m mindsdb --config=config.json
```
