#!/bin/bash
echo "sourcing ~~/main.sh to build dev.d files"

# We need to discover where this script is located so we can properly enter the Javascript logic
# We will resolve this script's source to an absolute path and store it as an global runtimeOptions variable called DEVD
script_source="${BASH_SOURCE[0]}"
while [ -h "$script_source" ]; do # resolve $script_source until the file is no longer a symlink
  DEVD="$(cd -P "$(dirname "$script_source")" >/dev/null 2>&1 && pwd)"
  script_source="$(readlink "$script_source")"
  [[ $script_source != /* ]] && script_source="$DEVD/$script_source" # if $script_source was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done

DEVD="$(cd -P "$(dirname "$script_source")" >/dev/null 2>&1 && pwd)"

export DEVD
echo "<------- marker 1 ------->"
node "${DEVD}/src/build.js" $DEVD
