# multialign
A service to show multiway alignments from UCSC multiway fasta files.


## Installation software

1. Get brentp bigwig nim app

```
cd /path/to/multialign/scripts
wget "https://github.com/brentp/bigwig-nim/releases/download/v0.0.3/bigwig"
```

2. Install samtools 


3. Get wigToBigWig from UCSC downloads


## Download the multi-way alignments and phyloP scores from UCSC

1. Get the FASTA download for 45 way multi-align for hg19 (GRCh37). For species names see, http://hgdownload.soe.ucsc.edu/goldenPath/hg19/multiz46way/alignments/
```
cd /path/to/multialign/hg19/by_species
wget http://hgdownload.soe.ucsc.edu/goldenPath/hg19/multiz46way/alignments/knownGene.exonAA.fa.gz
wget http://hgdownload.soe.ucsc.edu/goldenPath/hg19/multiz46way/alignments/knownGene.exonNuc.fa.gz
```


2. Test that the multi-way alignments can be retreived.
```
cd /path/to/multialign/hg19
grep RAI1 knownGeneXRef.txt | grep ENST00000353383
grep uc002grm.3 knownCanonical.exonNuc.fa.fai | grep _hg19

cd /path/to/multialign/hg19/by_species
/path/to/samtools faidx knownCanonical.exonNuc.fa uc002grm.3_hg19_1_4 > rai1.huma
/path/to/samtools faidx knownCanonical.exonNuc.fa uc002grm.3_rheMac2_1_4 > rai1.rhesys
/path/to/samtools faidx knownCanonical.exonNuc.fa uc002grm.3_mm9_1_4 > rai1.mouse
/path/to/samtools faidx knownCanonical.exonNuc.fa uc:002grm.3_canFam2_1_4 > rai1.canine
```

3. Download phylop scores
```
cd /path/to/multialign/hg19/100way
wget http://hgdownload.soe.ucsc.edu/goldenPath/hg19/phyloP46way/primates/chr17.phyloP46way.primate.wigFix.gz
wget "http://hgdownload.soe.ucsc.edu/goldenPath/hg19/phyloP100way/hg19.100way.phyloP100way/chr17.phyloP100way.wigFix.gz"
```

4. Convert wigFix to bigWig
```
cd /path/to/multialign/hg19/100way
wigToBigWig -fixedSummaries -keepAllChromosomes chr17.phyloP46way.primate.wigFix http://hgdownload.soe.ucsc.edu/goldenPath/hg19/bigZips/hg19.chrom.sizes chr17.phyloP46way.primate.bw
```


5. Get a region of phastcon scores (gene RAI1)
```
cd /path/to/multialign/hg19/100way
bigwig view -r chr17:17584787-17714767 chr17.phyloP46way.primate.bw
```


## Install the server 

1. Install node 


2. Install the packages for the server
```
cd /path/to/multialign/server
npm install
```

3. Install your certificate so that the server can run using https
```
cd /path/to/multialign/server/certs
# this is where the certificate should be located
```

4. Run the multialign server
```
npm install forever
cd /path/to/multialign/server
forever start server.js
```

