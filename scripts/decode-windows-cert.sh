#!/bin/bash

set -Eeuxo pipefail

# Set the filename
export CERTIFICATE_P12=cert.p12

# Decode the environment variable into our file
echo $WINDOWS_CERT_P12 | base64 --decode >$CERTIFICATE_P12
