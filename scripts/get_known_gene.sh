#!/bin/bash

build=$1
gene_name=$2
basedir=../$build

grep -w $gene_name $basedir/knownGeneXRef.txt | while read -r line ; do
  known_gene=$( echo "$line"  |cut  -f1 )
  mrna_id=$( echo "$line"     |cut  -f4 )
  gene_symbol=$( echo "$line" |cut  -f5 )
  refseq_id=$( echo "$line"   |cut  -f6)
  ensembl_id=$( echo "$line"  |cut  -f2)
  
  if [ $build == 'hg19' ]
  then
    gene_id=$known_gene
  else
    gene_id=$ensembl_id
  fi

  prefix_rna_id=$( echo "$mrna_id" | cut -c1)
  if [ $prefix_rna_id == 'N' ]
  then
    echo "$gene_id"
  fi
done
