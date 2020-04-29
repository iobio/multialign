var path = require('path');
var express = require('express');
var app = express();
var async = require('async');
var http = require('http');
var https = require('https')
var fs = require('fs')

const shell = require('shelljs')

var cors = require('cors');
var app = express();

// Certificate
const privateKey = fs.readFileSync('./certs/privkey.pem', 'utf8');
const certificate = fs.readFileSync('./certs/cert.pem', 'utf8');
const ca = fs.readFileSync('./certs/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};



app.use(cors());




app.use(express.static(__dirname ));

app.use(express.static(__dirname, { dotfiles: 'allow' } ));

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

const storage = require('node-persist');
(async() => {
	await storage.init({ dir: 'persist_cache'});

	app.get('/', function (req, res) {
	  res.sendFile(path.join(__dirname,'index.html'));
	})

  app.get('/sequence', function (req, res) {
	  var gene    = req.query.gene;
	  var build   = req.query.build;
	  var species = req.query.species;
	  var seqType = req.query.type;
	  var pos     = req.query.pos;

    promiseGetKnownGeneExon(build, gene, pos)
    .then(function(data) {
      
      let knownGene  = data.knownGene;    
      let exonNumber = data.exonNumber;
      
      let speciesList = species.split(",");
      let speciesDone = {}
      let seq = "";

      let promises = [];
      speciesList.forEach(function(speciesKey) {
        let p = promiseGetSequence(build, gene, knownGene, exonNumber, seqType, speciesKey)
        .then(function(data) {
          speciesDone[data.speciesKey] = data.sequence;
        })  
        promises.push(p); 
      })

      Promise.all(promises)  
      .then(function() {
        let buf = ""
        speciesList.forEach(function(theSpeciesKey) {
          buf += speciesDone[theSpeciesKey];
        })
        res.send(buf);
      })

    })
  })

  let promiseGetKnownGeneExon = function(build, gene, pos) {
    return new Promise(function(resolve, reject) {
      
      shell.cd('~/multialign/scripts');
      shell.exec("./get_known_gene_exon.sh " + build + " " + gene + " " + pos,
      function(code, stdout, stderr) {
        var tokens = stdout.split(" ");
        var knownGene  = tokens[0];
        var exonNumber = tokens[1];
        resolve({'knownGene': knownGene, 'exonNumber': exonNumber})
      });
     
    })
  }

  let promiseGetSequence = function(build, gene, knownGene, exonNumber, seqType, speciesKey)  {

    return new Promise(function(resolve, reject) {

      let key = 'seq' + "-" + build + "-" + gene + "-" + exonNumber + "-" + seqType + "-" + speciesKey;

      let speciesName = speciesKey.replace(/_/g, " ");
      speciesName = "\"" + speciesName + "\"";

      storage.getItem(key)
      .then(function(cachedSeq) {
      
        if (cachedSeq) {
          resolve({'speciesKey': speciesKey, 'key': key, 'sequence': cachedSeq})
        } else {
          shell.cd('~/multialign/scripts');
          shell.exec("./get_sequence.sh" + " " + build + " " + gene + " " + knownGene 
                                         + " " + exonNumber + " " + seqType + " " + speciesName,
          function(code, stdout, stderr) {
            resolve({'speciesKey': speciesKey, 'key': key, 'sequence': stdout})
            storage.setItem(key, stdout);
          });
        }
      })
    })
  }

	app.get('/phylop', function (req, res) {
	  var build   = req.query.build;
	  var region  = req.query.region;

	  shell.cd('~/multialign/scripts');
	  shell.exec('./get_phylop_scores.sh' + " " + build + " " + " " + region,
	  function(code, stdout, stderr) {
		res.send(stdout);
	  });

	})

	app.get('/sequence-deprecated', function (req, res) {
	  var gene    = req.query.gene;
	  var build   = req.query.build;
	  var species = req.query.species;
	  var type    = req.query.type;

	  let key = 'seq-deprecated' + '-' + build + "-" + gene + "-" + type + "-" + species;
	  
	  (async() => {

		  let cached_item = await storage.getItem(key);
		  
		  if (cached_item) {
			  res.send(cached_item);
		  } else {
			  let scriptName = './get_sequence_nuc.sh';
			  if (type == 'aa') {
  				scriptName = './get_sequence_aa.sh';
			  }

			  species = species.replace(/_/g, " ");
			  species = "\"" + species + "\"";	
			  species = species.replace(/,/g, "\" \"");

			  shell.cd('~/multialign/scripts');
			  shell.exec(scriptName + " " + build + " " + gene + " " + species, 
			  function(code, stdout, stderr) {
				  
				  res.send(stdout);  

				  (async() => {
					  await storage.setItem(key, stdout);
				  })()
			  });
		  }

	  })()
	})

/*  var server = https.createServer(
   {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert')
   }, app)
	.listen(8081, function () {

	  var host = server.address().address
	  var port = server.address().port

	  console.log('multialign app listening at http://%s:%s', host, port)

	})
*/
/*  let server = app.listen(80, function() {
	  var host = server.address().address
	  var port = server.address().port

	  console.log('multialign app listening at http://%s:%s', host, port)
  })
*/

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443');
});


})()

