SGACTIONS_DEPLOY = $(shell python -c 'import sgactions.deploy as x; print x.__file__')

PYTHON := venv/bin/python
GUNICORN := venv/bin/gunicorn
PORT ?= 8000

.PHONY: default serve

default: serve

serve: 
	${GUNICORN} -b 0.0.0.0:${PORT} sgviewer.main:app

debug: 
	${PYTHON} serve_local.py

SGACTIONS_SENTINEL := .sgactions.make-sentinel
sgactions : $(SGACTIONS_SENTINEL)
$(SGACTIONS_SENTINEL) : sgactions.yml $(SGACTIONS_DEPLOY)
	python -m sgactions.deploy sgactions.yml
	@ touch $(SGACTIONS_SENTINEL)

