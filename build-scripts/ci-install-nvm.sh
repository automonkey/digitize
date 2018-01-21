#!/usr/bin/env bash

set -eo pipefail

NVM_INSTALL_SCRIPT_URL="https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh"
NVM_INSTALL_SCRIPT_SHA_256="7cf21c604a59ce5bb3b42f038f3417462bddf1dc0aafa8657dc1d4617c9cf06e"

echo -e "\n\n### Installing NVM..."
curl -o nvm-install-script.sh "$NVM_INSTALL_SCRIPT_URL"
./build-scripts/check-sha-256.sh nvm-install-script.sh "$NVM_INSTALL_SCRIPT_SHA_256"
bash nvm-install-script.sh
touch $BASH_ENV
cat >$BASH_ENV <<EOL
export NVM_DIR="\$HOME/.nvm"
set +e # https://github.com/creationix/nvm/issues/993#issue-130348877
[ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"
set -e
EOL
