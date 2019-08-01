#!/bin/sh

# This script isn't used yet, it's just here for future reference, and to keep the tag values somewhere.

aws cloudformation create-stack --stack-name TSBot --template-body file://cloudformation.json --tags "Description=A slack chatbot for all sorts of fun and useful purposes"