(function(){
    var http = require('http');
    var fs = require('fs');
    var cmd = require('./cmd.js');
    const path = 'C:\\CasperFiles\\CasperInbound\\';
    const deleteCmdPath = "C:/InTransit/tools/deletefileShrt.lnk";
    var server = http.createServer(function(req, res) {
        var data = '';
        var completedFiles = 0;
        var cartons ={
            list:[]
        };

        var loadCartons = (stringData)=>{
            var temp = stringData.split(/\r?\n/);
            for(var i = 0; i < temp.length; i++){
                
                if(temp[i] != ''){
                    cartons.list.push(temp[i]);
                }
                
            }

            return JSON.stringify(cartons);
        };

        var returnDelete = (err,data)=>{
            if(err){
                console.log(new Date());
                console.log(err);
                return;
            }

            console.log(data);
            return;
        };
        fs.readdir(path,(err,files)=>{
            if(err){
                console.log(err);
                return;
            }
            if(files.length <= 0){
                res.end(JSON.stringify(cartons));
            }
            for(var i = 0; i < files.length; i++){
                
                console.log(files[i]);
                
                var stream = fs.createReadStream(path+files[i]);
                stream['file'] = files[i];
                
                stream.on('data',function(dataBlock){
                    if(this.file.indexOf('.DAT') > 0){
                        data += dataBlock;
                    }

                });
                
                stream.on('end',function(){
                    console.log("Done with " + this.file);
                    if(fs.statSync(path+this.file).isFile()){
                        
                        cmd.run(deleteCmdPath,[path+ this.file],returnDelete)

                        completedFiles++;
                        console.log("Completed " + this.file + " thats " + completedFiles);    
                        if(completedFiles == files.length){
                            
                            res.end(loadCartons(data));
                        }
                    }

                });
            }
        });
    });

    server.listen(8333);


})();