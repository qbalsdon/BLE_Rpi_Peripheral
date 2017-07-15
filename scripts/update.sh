#!/bin/sh

sudo lxterminal -e 'sudo apt-get --assume-yes update && sudo apt-get --assume-yes dist-upgrade' & echo 'Started update'
