#!/bin/bash
echo "sourcing ~~/devd_controller.sh"

# source file ordering here is very important
source "${DEVD}/src/utils/dotShaw/helper_functions.sh"
source "${DEVD}/src/utils/dotShaw/ssh_init.sh"
source "${DEVD}/receivers/.bash_aliases"
source "${DEVD}/receivers/environmentals.sh"

function enrichPath() {
  if test -r "${DEVD}/receivers/path_prefixes.ldf"; then
    mapfile -t paths_in < <(cat ${DEVD}/receivers/path_prefixes.ldf)

    for path_to_add in "${paths_in[@]}"; do
      path_to_add=$(expand_string $path_to_add)
      if [[ $path_to_add != "empty" ]]; then
        PATH="${path_to_add}:${PATH}"
      fi
    done

    printf '%s\n' 'Done adding path path_prefixes'
  fi

  if test -r "${DEVD}/receivers/path_suffixes.ldf"; then
    mapfile -t paths_in < <(cat ${DEVD}/receivers/path_suffixes.ldf)

    for path_to_add in "${paths_in[@]}"; do
      path_to_add=$(expand_string $path_to_add)
      if [[ $path_to_add != "empty" ]]; then
        PATH="${PATH}:${path_to_add}"
      fi
    done

    printf '%s\n' 'Done adding path suffixes'
  fi
}

function planet() {
  # get directory where command was called from
  currentDir=$(pwd)

  # for quality experience, allow custom name, must be FIRST POSITIONAL argument
  fileName=$1

  # remove output filename from incoming args to facilitate easy passing to binary
  shift

  # get the planet bin location
  planet_exe=$(dirname "$(which "planet.exe")")

  # move to the planet.exe bin dir
  pushd "$planet_exe" >> /dev/null || exit

  # run the command, but add in the called dir's path and custom filename
  planet.exe "$@" -o "$currentDir/$fileName"

  # go back to origin dir
  pushd +1 >> /dev/null || exit
}

function promptCustom() {
  PS1='\[\033]0;$TITLEPREFIX:$PWD\007\]' # set window title
  PS1="$PS1"'\n'                         # new line
  PS1="$PS1"'\[\033[32;1m\]'             # change to green
  PS1="$PS1"'\u@\h '                     # user@host<space>
  PS1="$PS1"'\[\033[35;1m\]'             # change to purple
  PS1="$PS1"'$MSYSTEM '                  # show MSYSTEM
  PS1="$PS1"'\[\033[33m\]'               # change to brownish yellow
  PS1="$PS1"'\w'                         # current working directory
  if test -z "$WINELOADERNOEXEC"; then
    GIT_EXEC_PATH="$(git --exec-path 2>/dev/null)"
    COMPLETION_PATH="${GIT_EXEC_PATH%/libexec/git-core}"
    COMPLETION_PATH="${COMPLETION_PATH%/lib/git-core}"
    COMPLETION_PATH="$COMPLETION_PATH/share/git/completion"
    if test -f "$COMPLETION_PATH/git-prompt.sh"; then
      . "$COMPLETION_PATH/git-completion.bash"
      . "$COMPLETION_PATH/git-prompt.sh"
      PS1="$PS1"'\[\033[36m\]' # change color to cyan
      PS1="$PS1"'`__git_ps1`'  # bash function
    fi
  fi
  PS1="$PS1"'\[\033[37m\]' # change color
  PS1="$PS1"'\n'           # new line
  PS1="$PS1"'$ '           # prompt: always $
}

enrichPath
promptCustom
