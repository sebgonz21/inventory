(function(){
    var http = require('http');
    var spawn = require('child_process').spawn;
    var fs = require('fs');

    var server = http.createServer(function(req, res) {
        //console.log("Got Request");
        var url = req.url;
        
        if(url == "/favicon.ico"){
            res.end("");
            return;
        }

        res.writeHead(200);

        var file_name = "C:/CasperFiles/DD_CART_CNF_";
        var trigger_name = 'C:/CasperFiles/TD_CART_CNF_';

        req.on('data', function(chunk) {
            
            console.log("Received body data:");
            console.log(chunk.toString());
            var carton_data;

			try{
				carton_data = JSON.parse(chunk.toString()).cartons; 
			}catch(error){
				res.writeHead(400, "Bad Data", {'Content-Type': 'text/html'});
				res.end();
			}

            var carton_string = "";
            
            for(var i = 0; i < carton_data.length; i ++){
                carton_string += carton_data[i].to_site;
                carton_string += ","+carton_data[i].carton_id;
                carton_string += ","+carton_data[i].intransit_type;
                carton_string += ","+carton_data[i].ticket+ "\n";
            }

            console.log(carton_string);
            
            var date_obj = new Date();
            var year = date_obj.getFullYear();
            var month = date_obj.getMonth();
            month++;
            month = (month < 10) ? "0" + month: month;
            var day = date_obj.getDate();
            day = (day < 10) ? "0" + day: day;
            var hour = date_obj.getHours();
            hour = (hour < 10) ? "0" + hour: hour;
            var min = date_obj.getMinutes();
            min = (min < 10) ? "0" + min: min;
            var sec = date_obj.getSeconds();
            sec = (sec < 10) ? "0" + sec: sec;

            var data_suffix = ""+year+month+day+hour+min+sec + ".dat";
            var trigger_suffix = ""+year+month+day+hour+min+sec + ".trg";

            file_name += data_suffix;
            trigger_name += trigger_suffix;
            console.log("INFO "+year+month+day+hour+min+sec +" Wrote data file " + file_name);
            console.log("INFO "+year+month+day+hour+min+sec +" Wrote trigger file " + trigger_name);
            
            fs.writeFile(file_name, carton_string, function (err) {
                console.log("Writing file");
                if (err){ 
                    console.log("ERROR writing data file "+err)
                };
            });
            
            fs.writeFile(trigger_name, "RT0517", function(err){
                console.log("Writing Trigger");
                if (err){ 
                    console.log("ERROR writing trigger file "+err)
                };
            })  
        });

       req.on('end', function() {
            
            res.writeHead(201, "OK", {'Content-Type': 'text/html'});
            res.end();
       });
       
    });
    server.listen(8500);

})();