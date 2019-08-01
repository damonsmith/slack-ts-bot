#!/bin/bash

git fetch
HAS_CHANGES=$(git log HEAD..origin/master --oneline)
if [[ ! -z $HAS_CHANGES ]]
then
  echo $(date) "updating tsbot with $HAS_CHANGES" >> /home/ubuntu/tsbot.log
  git pull
  nodenv install -s
  npm install -g yarn
  nodenv rehash
  yarn
  yarn decrypt-config
  sudo systemctl restart tsbot
  echo $(date) "tsbot restarted" >> /home/ubuntu/tsbot.log
fi