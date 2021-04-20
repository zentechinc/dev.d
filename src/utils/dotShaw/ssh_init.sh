#!/bin/bash
echo 'sourcing ~~/ssh-init.sh'

SSH_ENV="/c/Users/evanc/dev.d/creds/ssh-init_fancy.env"

agent_load_env() {
  test -f "$SSH_ENV" && . "$SSH_ENV" >|/dev/null
}

start_agent() {
  (
    umask 077
    ssh-agent >|"$SSH_ENV"
  )
  . "$SSH_ENV" >|/dev/null
}

agent_load_external_keys() {
  ssh-add
  add_keys_clear
  add_keys_crypto
}

add_keys_clear() {
  printf '\t%s\n' 'Adding clear keys'
  # clear keys are discouraged since crypto keys are now well supported

  printf '\t%s\n' 'Done adding clear keys'
}

add_keys_crypto() {
  printf '\t%s\n' 'Adding crypto keys'
  read -sp 'Please enter the decryption Key: ' id_rsa_decryption_key
  printf '\n' # forces a new line after the read command

  mapfile -t keys_in < <(cat ${DEVD}/build/crypto_keys.ldf)
  for key_in in "${keys_in[@]}"; do
    path_to_add=$(expand_string $key_in)
    if [[ $path_to_add != "empty" ]]; then
      PROXY_RESPONSE=$(SSH_ASKPASS="${DEVD}/src/utils/dotShaw/askpass-proxy.sh" ssh-add $path_to_add <<<"$id_rsa_decryption_key" 2>&1)
      printf '\t%s\n' "$PROXY_RESPONSE"
    fi
  done

  printf '%s\n' 'Done adding crypto keys'
}

agent_load_env

# agent_run_state: 0=agent running w/ key; 1=agent w/o key; 2=agent not running
agent_run_state=$(
  ssh-add -l >|/dev/null 2>&1
  echo $?
)

if [ ! "$SSH_AUTH_SOCK" ] || [ $agent_run_state = 2 ]; then
  echo "Initialising new SSH agent..."
  start_agent
  echo "Agent init complete"
  echo "Adding Keys..."
  agent_load_external_keys
  echo "Key add(s) complete"
elif [ "$SSH_AUTH_SOCK" ] && [ $agent_run_state = 1 ]; then
  echo "Agent is already running, but has no keys. Adding Keys..."
  agent_load_external_keys
  echo "Key add(s) complete"
fi

unset SSH_ENV
