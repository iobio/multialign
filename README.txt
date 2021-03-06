#
# Get brentp bigwig nim app
#
wget "https://github.com/brentp/bigwig-nim/releases/download/v0.0.3/bigwig"

# Get the FASTA download for 45 way multi-align for hg19 (GRCh37)
# for species names see,
#   http://hgdownload.soe.ucsc.edu/goldenPath/hg19/multiz46way/alignments/
```
wget http://hgdownload.soe.ucsc.edu/goldenPath/hg19/multiz46way/alignments/knownGene.exonAA.fa.gz
wget knownGene.exonNuc.fa.gz
```

# Get the human multi-alignment for RAI1
```
grep RAI1 knownGeneXRef.txt | grep ENST00000353383
grep uc002grm.3 knownCanonical.exonNuc.fa.fai | grep _hg19



~/minion/bin/samtools faidx knownCanonical.exonNuc.fa uc002grm.3_hg19_1_4 > rai1.huma
~/minion/bin/samtools faidx knownCanonical.exonNuc.fa uc002grm.3_rheMac2_1_4 > rai1.rhesys
~/minion/bin/samtools faidx knownCanonical.exonNuc.fa uc002grm.3_mm9_1_4 > rai1.mouse
~/minion/bin/samtools faidx knownCanonical.exonNuc.fa uc:002grm.3_canFam2_1_4 > rai1.canine
```

# Download phylop scores
```
wget http://hgdownload.soe.ucsc.edu/goldenPath/hg19/phyloP46way/primates/chr17.phyloP46way.primate.wigFix.gz
wget "http://hgdownload.soe.ucsc.edu/goldenPath/hg19/phyloP100way/hg19.100way.phyloP100way/chr17.phyloP100way.wigFi
x.gz"
```

# Convert wigFix to bigWig
```
./wigToBigWig -fixedSummaries -keepAllChromosomes chr17.phyloP46way.primate.wigFix http://hgdownload.soe.ucsc.edu/g
oldenPath/hg19/bigZips/hg19.chrom.sizes chr17.phyloP46way.primate.bw
```


# Get a region of phastcon scores (gene RAI1)
```
./bigwig view -r chr17:17584787-17714767 chr17.phyloP46way.primate.bw

