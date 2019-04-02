SHELL = /bin/bash

default: help

.PHONY: test
test:
	pytest test/unit/

.PHONY: lint
lint: flake8 bandit safety ## Lint code

.PHONY: flake8
flake8:
	flake8 --max-line-length=120 src/ test/

.PHONY: bandit
bandit:
	bandit -r src/

.PHONY: safety
safety:
	safety check

.PHONY: piprot
piprot: ## Check for outdated dependencies
	piprot requirements.txt
	piprot test_requirements.txt

.PHONY: precommit
precommit: lint ## Sanity check before pushing code

.PHONY: clean
clean: ## Clean generated files
	find . -name '*.pyc' -delete
	find . -name '*.pyo' -delete
	rm -rf build/ dist/ *.egg-info/ .cache .coverage .pytest_cache
	find . -name "__pycache__" -type d -print | xargs -t rm -r
	find . -name "test-output" -type d -print | xargs -t rm -r

.PHONY: deps
deps: pydeps ## Install or update dependencies

.PHONY: pydeps
pydeps:
	pip install -U -r requirements.txt -c constraints.txt
	pip install -U -r test_requirements.txt -c constraints.txt
	pip check
	@ echo "Outdated:"
	@ pip list --outdated

.PHONY: format
format: ## Format code
	find src/ test/ -name "*.py" -exec black -l120 {} \;

.PHONY: install
install: ## Installs the CLI as an executable python command (should NOT be done from a virtual env!)
	python3 setup.py install --user --prefix=


.PHONY: getbinpath
getbinpath: ## Reports the path the script binary can be executed from
	@echo `python3 -m site --user-base`/bin

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1,$$2}'
