import { readFile, readdir, appendFile, createWriteStream } from 'fs';

async function fetchOID(){

    
    const folder = './cert/bashed-certificates';
    readdir(folder, (err, files) => {
        
            for(let i = 0; i < files.length; i++){
                readFile(`./cert/bashed-certificates/${files[i]}`, (err, data) => { 
                if (err) throw err; 
                
                const foundDNS = data.toString().match(/(?<=DNS:).*(?=)/g)!;
                const foundOID = data.toString().match(/(?<=Policy:).*(?=)/g)!;

                const DNS = 'DNS: ' + foundDNS.toString() + '\n';
                const OID = 'OID: ' + foundOID.toString() + '\n';

                const dataFolder = 'cert/';

                const permissionsFile = 'OID.txt';

                const permissionStream = createWriteStream(dataFolder + permissionsFile, { flags: 'a' });


                permissionStream.write('DNS: ' + foundDNS + ',\n');
                permissionStream.write('OID: ' + foundOID + ',\n');
                permissionStream.write('-----------' + ',\n');

                
                
            }); 
        }
    });

    

}

fetchOID();