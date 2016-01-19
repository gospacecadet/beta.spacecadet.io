#!/bin/bash
# Commit all SpaceCadet repos in one go
cd ~/workspace/spacecadet/beta.spacecadet.io
git add .
git commit -m "$1"
git push origin master

cd ~/workspace/spacecadet/mart-vibe-spacecadet
git add .
git commit -m "$1"
git push origin master

cd ~/workspace/spacecadet/mart
git add .
git commit -m "$1"
git push origin master

cd ~/workspace/spacecadet/bootstrap
git add .
git commit -m "$1"
git push origin spacecadet
