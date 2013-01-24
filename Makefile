SGACTIONS_DEPLOY = $(shell python -c 'import sgactions.deploy as x; print x.__file__')

PYTHON := venv/bin/python

.PHONY: default serve

default: serve

serve: 
	${PYTHON} serve_local.py

SGACTIONS_SENTINEL := .sgactions.make-sentinel
sgactions : $(SGACTIONS_SENTINEL)
$(SGACTIONS_SENTINEL) : sgactions.yml $(SGACTIONS_DEPLOY)
	python -m sgactions.deploy sgactions.yml
	@ touch $(SGACTIONS_SENTINEL)

