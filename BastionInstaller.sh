#!/bin/bash
#
# Copyright 2018 The Kara Bot Project.
# Licensed under the GNU General Public License, Version 3.0
# <https://www.gnu.org/licenses/gpl.txt>.
#
# This is just a little script that can be downloaded from the internet to
# install Kara on a linux based operating system with the apt package
# manager. It installs Kara and all the required dependencies and packages.

# Exit immediately if a pipeline, which may consist of a single simple command,
# a list, or a compound command returns a non-zero status
set -e
# Reinitialize the terminal
reset

# Set local variables for coloring output
NC='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[0;33m'
CYAN='\033[0;36m'

# Set local variables for use in script
KARA_DIR="$HOME/Kara"
KARA_SETTINGS_DIR="$KARA_DIR/settings"
KARA_REPO="https://github.com/TheKaraBot/Kara.git"

# Function to print message from Kara
# Params:
#   $@ The message string
function print::bastion() {
  echo -e "${CYAN}[Kara]: ${NC}$@${NC}"
}

# Function to print warning (to STDERR)
# Params:
#   $@ The warning string
function print::warning() {
  echo -e "${ORANGE}[WARNING]: $@${NC}" >&2
}

# Function to print error (to STDERR) & link to Kara HQ and exit the script
# Params:
#   $@ The error string
function print::error() {
  echo
  echo -e "${RED}[ERROR]: $@${NC}" >&2
  echo
  echo "Join Kara HQ and ask for help!"
  echo -e "${CYAN}https://discord.gg/fzx8fkt${NC}"
  echo "And our amazing support staff will help you out."
  echo
  exit 1
}

# Function to print 'Done' after a step is complete
function print::done() {
  print::bastion "Done."
  echo
}

# Function to print the current date & time
function print::date() {
  echo "[ $(date) ]"
  echo
}

# Function to print a user prompt before taking input from the user
# Params:
#   $@ The hint string for the input
function prompt::user() {
  echo
  print::bastion $@
  echo -en "${GREEN}[$USER]: ${NC}"
}

# Function to check if the script was run with superuser permission, warn the
# user about it and ask them if they like to proceed
function check_sudo() {
  if [ "$(id -u)" -eq "0" -a -n "$SUDO_USER" -a "$SUDO_USER" != "root" ]; then
    print::warning "The installer doesn't require superuser permission."
    echo

    print::bastion "Are you sure you want to install Kara with superuser permission?"
    print::bastion "Proceed if and only if you know what you are doing."

    prompt::user "[Yes/NO]"
    read -n 1 -r
    echo -e "\n"
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      INS_DIR=/root
    else
      print::bastion  "Run this installer again without superuser permission."
      exit 1
    fi
  fi
}

# Function to install any given package(s) from the package manager
# Params:
#   $@ The list of package names
function install::package() {
  if ! hash $@ &>/dev/null; then
    sudo apt install -qq -y $@ || \
      print::error "Unable to download and install $@."
  fi
}

# Function to install any given package group from the package manager
# Params:
#   $@ The list of package group name
function install::package_group() {
  # Using `apt-get` instead of `apt` because `apt` does not yet have a stable
  # CLI interface.
  sudo apt-get install -qq -y $@ || \
    print::error "Unable to download and install $@."
}

# Function to install system packages required by Kara
# List of packages:
#   1. curl
#   2. wget
#   3. screen
#   4. python
#   5. git
#   6. build-essential
function install::packages() {
  print::bastion "Installing required system packages..."

  sudo apt update -qq || print::error "Unable to update package list."

  install::package "curl"
  install::package "wget"
  install::package "screen"
  install::package "python"
  install::package "git"
  install::package_group "build-essential"

  print::done
}

# Function to install Node.js or check if the right version is installed
function install::nodejs() {
  print::bastion "Installing Node.js..."

  if ! hash node &>/dev/null; then
    (curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -) &>/dev/null || \
      (print::error "Unable to add node source." && exit 1)
    install::package "nodejs"
  fi

  if [ "$(node --version | cut -d'v' -f 2 | cut -d'.' -f 1)" -ne 10 ]; then
    print::error "Please upgrade to Node.js LTS before running the installer again."
  fi

  print::done
}

# Function to relocate previous installation of Kara and clone the latest
# stable version from GitHub
function install::bastion() {
  print::bastion "Installing Kara..."

  cd "$HOME"

  if [ -d "Kara" ]; then
    if [ -d "Kara-Old" ]; then sudo rm -rf Kara-Old; fi
    sudo mv -f Kara Kara-Old
  fi

  git clone -b stable -q --depth 1 "$KARA_REPO" || \
    print::error "Unable to download Kara system files."

  print::done
}

# Function to install all the dependencies of Kara
function bastion::dependencies() {
  print::bastion "Installing Kara dependencies..."

  install::package "ffmpeg"

  sudo npm install --global yarn 1>/dev/null || \
    print::error "Unable to download and install Yarn."

  cd "$KARA_DIR"
  yarn install --production --no-lockfile 1>/dev/null || \
    print::error "Unable to download and install node modules."

  print::done
}

# Function to generate the configuration & credentials file of Kara
function bastion::configure() {
  print::bastion "Finalizing..."

  cp "$KARA_SETTINGS_DIR/configurations.example.yaml" "$KARA_SETTINGS_DIR/configurations.yaml"
  cp "$KARA_SETTINGS_DIR/credentials.example.yaml" "$KARA_SETTINGS_DIR/credentials.yaml"

  print::done
}

# Function to print that Kara was successfully installed
function bastion::ready {
  print::bastion "Ready to boot up and start running."
  echo
  print::bastion "Join Kara HQ: https://discord.gg/fzx8fkt"
  echo
}

function main() {
  print::date

  # Check if user is running the script using `sudo`.
  check_sudo

  # Install required system packages
  install::packages

  # Install Node.js
  install::nodejs

  # Clone Kara from GitHub
  install::bastion

  # Install Kara dependencies
  bastion::dependencies
  # Configure Kara settings
  bastion::configure

  # Successfully installed
  bastion::ready

  echo
}


main

exit 0

# EOF
