#!/bin/bash
build=$1
basedir=../$build/100way

input=("$@")
for species_name in "${input[@]}"
do
    if [[ ${i} -gt 4 ]]; then
        grep  "$species_name" $basedir/species.csv | while read -r line ; do
          abbrev=$( echo "$line" |cut -d','  -f5 )
          echo "$species_name,$abbrev"
        done
    fi
    i=$((i+1))
done
