#!/bin/sh
git pull
npm run codegen
npm run create-local
npm run deploy-local