#!/usr/bin/env bash

set -eo pipefail

printUsage() {
    echo -e "\nUsage: $0 file expected-sha-256\nfile: Path of file to check\nexpected-sha-256: The expected hash"
}

[ -z "$1" ] && echo "Error: Missing file parameter" && printUsage && exit 1
[ -z "$2" ] && echo "Error: Missing expected-sha-256 parameter" && printUsage && exit 1

FILE=$1
EXPECTED_SHA_256=$2

echo "Computing checksum for file '$FILE'"
ACTUAL_SHA_256="$(shasum -a 256 $FILE | awk '{print $1}')"
if [ "$ACTUAL_SHA_256" == "$EXPECTED_SHA_256" ]; then
    echo "checksums matched"
else
    echo -e "Checksum error!!!" \
        "\n  Actual:   $ACTUAL_SHA_256" \
        "\n  Expected: $EXPECTED_SHA_256"
    exit 2
fi
