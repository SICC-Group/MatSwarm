#!/bin/bash
# 编译前端资源：生产模式
yarn
# compile dll
yarn run dll-dist
# compile entry
yarn run dist
