#!/bin/sh

sudo update-rc.d ssh disable && sudo invoke-rc.d ssh stop && echo "SSH stopped" && exit 0 
echo "SSH could not be stopped"
