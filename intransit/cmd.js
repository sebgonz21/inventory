var spawn = require('child_process').spawn;
var debug = require('debug')('cmd');
module.exports = {

    /**
     * @param {String} command to be executed
     * @param {Array} parameters for file to be executed (Optional)
     * @param {Function} function callback used to return value
     */
    run: (command, params, returnValue) => {
        var paramString = "";
        for(var i = 0; i < params.length; i++){
            paramString += params[i] + ' ';
        }
        
        debug("Running CMD " + command + " with params " + paramString);
        var proc = spawn('cmd.exe',['/c', command + ' ' + paramString]);

        var value = '';

        proc.stdout.on('data',(data) =>{
            
            debug("Got some data for " + paramString);
            value += data.toString();
        });

        proc.stderr.on('data',(error)=>{
            
            debug('on error calling returnCMD for ' + paramString);
            return returnValue('ERROR RUNNING Command: ' + command + ' WITH PARAMETERS ' + paramString + " ERROR: "  + error,null);
           
        });

        proc.on('exit',(code)=>{
            if(code == 0){
                
                debug('good exit calling returnCMD for ' + paramString);
                return returnValue(null,value);
                
            }else{
                
                debug('bad exit calling returnCMD for ' + paramString);
                return returnValue('ERROR ON EXIT OF: ' + command + ' WITH PARAMETERS ' + paramString + ' CODE: ' + code, null);
                
            }
        });
    }

};