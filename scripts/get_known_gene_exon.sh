#!/bin/bash

build=$1
gene_name=$2
pos=$3
basedir=../$build
fasta_base_file=$basedir/by_species/knownCanonical.exonNuc
fasta_human=$basedir/by_species/knownCanonical.exonNuc.$build.fa

./get_known_gene.sh $build $gene_name | while read -r known_gene  ; do
  grep $known_gene $fasta_human | while read -r region_rec ; do
    known_gene_exon=$( echo "$region_rec" | cut -d ' ' -f1 )
    known_gene_exon=${known_gene_exon#>}
    known_gene=$( echo "$known_gene_exon" | cut -d '_' -f1 )
    exon=$( echo "$known_gene_exon" | cut -d '_' -f3 )
    exon_of=$( echo "$known_gene_exon" | cut -d '_' -f4 )

    region=$( echo "$region_rec" | cut -d ' ' -f5 | cut -d':' -f2 )
    region_start=$( echo  "$region" |cut -d'-' -f1 )
    region_end=$( echo  "$region" |cut -d'-' -f2 )
    region_end=$( echo  "$region_end" |cut -d'+' -f1 )
    if (( $region_start <= $pos )); then
      if (( $region_end >= $pos )); then
        echo $known_gene "$exon"_"$exon_of" $region_start $region_end
        break
      fi
    fi
  done
done
