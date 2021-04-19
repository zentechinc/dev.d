expand_string() {
  echo "$( envsubst < <(echo $1) )"
}

path_prefix() {
  PATH="${1}:${PATH}"
}

path_suffix() {
  PATH="${PATH}:${1}"
}

export expand_string
