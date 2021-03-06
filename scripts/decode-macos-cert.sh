#!/bin/bash

set -Eeuxo pipefail

# Set the filename
export CERTIFICATE_P12=cert.p12

# Decode the environment variable into our file
echo $MACOS_CERT_P12 | base64 --decode >$CERTIFICATE_P12

# Let's invent a new keychain
export KEYCHAIN=build.keychain

# Create the keychain with a password (password)
security create-keychain -p password $KEYCHAIN

# Make the custom keychain default, so xcodebuild will use it for signing
security default-keychain -s $KEYCHAIN

# Unlock the keychain
security unlock-keychain -p password $KEYCHAIN

# Add certificates to keychain and allow codesign to access them

# 1) Apple Worldwide Developer Relations Certification Authority
security import ./assets/certs/AppleWWDRCAG3.cer -k ~/Library/Keychains/$KEYCHAIN -T /usr/bin/codesign
# 2) Developer Authentication Certification Authority
security import ./assets/certs/DevAuthCA.cer -k ~/Library/Keychains/$KEYCHAIN -T /usr/bin/codesign
# 3) Developer ID (That's you!)
security import $CERTIFICATE_P12 -k $KEYCHAIN -P "" -T /usr/bin/codesign 2>&1 >/dev/null

# Let's delete the file, we no longer need it
rm $CERTIFICATE_P12

# Set the partition list (sort of like an access control list)
security set-key-partition-list -S apple-tool:,apple: -s -k password $KEYCHAIN

# Echo the identity, just so that we know it worked.
# This won't display anything secret.
security find-identity -v -p codesigning
