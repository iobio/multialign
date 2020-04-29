#!/bin/bash

build=$1
region=$2
basedir=../$build/100way
filename=$basedir/$build.phyloP100way.bw

while true; do
    uuid=$(cat /proc/sys/kernel/random/uuid)
    if [ ! -d $uuid ]; then
        break;
    fi
done

mkdir -p $uuid

./bigwig view -r $region $filename > $uuid/phylop.out
cat $uuid/phylop.out

rm -rf $uuid
