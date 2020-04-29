#!/bin/bash

build=$1
gene_name=$2
known_gene=$3
exon_number=$4
seq_type=$5
species_list=$(./get_species_abbrev.sh "${@}")
basedir=../$build
if [[ "$seq_type" == "aa" ]]; then
  fasta_base_file=$basedir/by_species/knownCanonical.exonAA
  fasta_human=$basedir/by_species/knownCanonical.exonAA.$build.fa
else
  fasta_base_file=$basedir/by_species/knownCanonical.exonNuc
  fasta_human=$basedir/by_species/knownCanonical.exonNuc.$build.fa
fi
 
fai_matching_lines=$(grep $known_gene $fasta_human.fai)
if [ "${#fai_matching_lines}" -gt 0 ]; then
  for species_rec in $species_list; do
    species_name=$( echo  "$species_rec" |cut -d',' -f1 )
    species_abbrev=$( echo "$species_rec" |cut -d',' -f2 )

    echo "##$species_name,$species_abbrev"
        
    fasta_file=$fasta_base_file.$species_abbrev.fa
    fai_file=$fasta_file.fai

    full_ucsc_name="$known_gene"_"$species_abbrev"_"$exon_number"
    grep $full_ucsc_name $fasta_file | grep $species_abbrev | while read -r line ; do
      id=$( echo "$line" |cut -d' ' -f1 | cut -d ">" -f2 )
      region=$( echo "$line" |cut -d' ' -f5)
      echo "#$gene_name $region $species_abbrev" 
      samtools faidx $fasta_file $id 
    done
  done
fi 
