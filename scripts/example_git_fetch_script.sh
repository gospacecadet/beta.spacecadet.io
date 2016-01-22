#!/bin/bash
# merge all SpaceCadet repos
cd ~/workspace/spacecadet/beta.spacecadet.io
git fetch origin
git merge origin/master

cd ~/workspace/spacecadet/mart-vibe-spacecadet
git fetch origin
git merge origin/master

cd ~/workspace/spacecadet/mart
git fetch origin
git merge origin/master

cd ~/workspace/spacecadet/bootstrap
git fetch upstream
git fetch origin
git checkout spacecadet
git merge origin/spacecadet
git merge upstream/v4-dev
