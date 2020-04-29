import sys
import os

def main():
   filepath       = sys.argv[1]
   species_abbrev = sys.argv[2]

   if not os.path.isfile(filepath):
       print("File path {} does not exist. Exiting...".format(filepath))
       sys.exit()

   keepNext = False 
   with open(filepath) as fp:
       cnt = 0
       for line in fp:
           if (line.startswith(">")):
                tokens      = line.split(" ")
                name        = tokens[0]
                name_tokens = name.split("_")
                known_gene  = name_tokens[0]
                species     = name_tokens[1]
                exon_number = name_tokens[2]
                exon_count  = name_tokens[3]
                if (species == species_abbrev): 
                    keepNext = True
                    print(line, end='')
                    cnt = cnt + 1
                else:
                    keepNext = False
           elif (keepNext == True):
               print(line, end='')
               keepNext = False

  
if __name__ == '__main__':
   main()
