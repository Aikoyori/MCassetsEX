const fs = require('fs');
const makeDir = require('make-dir');
const cpy = require('cpy');
const prompt = require('prompt');

const properties = [
    {
        name: 'version',
        validator: /^[\d\.-\w]+$/,
        warning: 'Username must be only letters, spaces, or dashes'
    }
];
var props = {
    properties: {
        version: {
        pattern: /(.*-)?.+\..+/,
        message: 'Use actual version from the list lmao',
        required: true
      },
      mode: {
        pattern: /[0123]/,
        required: true,
        message: 'What is that mode',

      }
    }
  };
// StackOverflow Magic
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 
 console.log("WELCOME TO THE MOST EPIC PROGRAM BY THE AIKOYORI \N\N ASSETS LISTING FROM YOUR INDEXES FOLDER : ");

const assetsDir = process.env.APPDATA + "/.minecraft/assets/"
const objDir = assetsDir + "objects/"
const indexDir = assetsDir + "indexes/"
fs.readdir(indexDir, (err, files) => {
    files.forEach((fileRaw, index) => {
        console.log("- " + fileRaw.substr(0,fileRaw.length-5))
    })
    console.log('\nType the version you want assets from\n e.g. 1.16, 1.8\n\nMode 0 - name with full path seperated by period (for people who want to make music like me) \nMode 1 - Original name from the index json file (for resource pack makers)\nMode 2 - Use hashes for these file names (for people who want to analyze the relationship)\nMode 3 - Randomly generate file name + extension\nMode 4 - Fuck you why would you want to use this mode (random file name no extension)\n')
    prompt.start();
    
    prompt.get(props, function (err, result) {
        if (err) throw err;
        console.log('\nChosen version - ' + result.version+"\n")
        console.log('Chosen mode    - ' + result.mode+"\n")
        const filenameMode = result.mode
        const ver = result.version
        let version = ver + "-mode" + filenameMode
        const targetDir = "assets/" + version + "/"
        makeDir(targetDir);
        fs.readFile(indexDir+ver + '.json', (err2, data) => {
            let obj = JSON.parse(data);
            console.log(obj)
            if (err2) throw err2;
            for (let [key, value] of Object.entries(obj.objects)) {
                let dir = ((targetDir + key).split('/'))
                let fileName = key
                let count = 0;
                dir.pop();
                if (filenameMode == 0) {
                    fileName = (key).split('/').join(".")

                }
                if (filenameMode == 1) {
                    fileName=(key).split('/')[(key).split('/').length-1]

                }
                if(filenameMode == 2)
                {
                    
                    fileName = makeid(32)+"."+(key).split('/')[(key).split('/').length-1].split(".")[(key).split('/')[(key).split('/').length-1].split(".").length-1]
                }
                if(filenameMode == 3)
                {
                    
                    fileName = makeid(32)
                }
                let destDir = dir.join("/");

                makeDir(destDir);
                cpy(objDir + value.hash.substring(0, 2) + "/" + value.hash, destDir, {
                    rename: fileName
                });

                console.log("Source      : " + objDir + value.hash.substring(0, 2) + "/" + value.hash)
                console.log("Destination : " + destDir)
                console.log("")
            }
        });
    })

})