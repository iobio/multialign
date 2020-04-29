#!/bin/bash

build=$1
basedir=../$build
fasta_file=$basedir/100way/knownCanonical.exonAA.fa
output_base_file=$basedir/by_species/knownCanonical.exonAA
species_file=$basedir/100way/species.csv

cat $species_file | while read -r species_rec ; do
  species=$( echo "$species_rec" |cut -d',' -f5)
  if [ "${#species}" -gt 0 ]; then
    echo "processing $species"
	  
    output_file=$output_base_file.$species.fa
    python3 parse_fasta.py $fasta_file $species > $output_file
    samtools faidx $output_file
  fi 
done
