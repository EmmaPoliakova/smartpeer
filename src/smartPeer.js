import Peer from 'peerjs'
import QRCode from 'qrcode'

export class SmartPeer{

        /*fields:
        peerCoonection = peerjs object
        remotePeers = list of connected peers
        callbackFunction = dictionary of functions to be called on events
        */

        constructor(peerid) {
            this.peerConnection = new Peer(peerid); 
            self = this;
      
            this.peerConnection.on('open', function(id) {  //logs the browser peer id
                console.log('My peer ID is: ' + id);
                
            });
      
            this.peerConnection.on("connection", this.peerOnConnection);  //opens the data connection between 2 peers once a connection is established
            this.remotePeers = [];
            this.callbackFunctions = {};
        }
      
          registerCallback = (flag, callbackFunction) => {
           
            this.callbackFunctions[flag] = callbackFunction
            }
          
          peerOnReceiveCallback = (flag, data) => {
            if (flag in this.callbackFunctions){
              this.callbackFunctions[flag](data);
            }
          }
      
          peerOnConnection = (conn) => {
            this.remotePeers.push(conn);  //add to current connected peers
            var message = self.remotePeers.indexOf(conn); 
            self.peerOnReceiveCallback('connection', message);

            conn.on("data", function(data){
                var message = [self.remotePeers.indexOf(conn), data]  //send data received from phone/remote peer + the player number/ index from the peer list
                self.peerOnReceiveCallback("data" ,message);
            });
      
            conn.on('close',function(){  //send a number of a player who disconnected 
                var message = "Player " + self.remotePeers.indexOf(conn) + " disconnected"; 
                self.remotePeers.splice(self.remotePeers.indexOf(conn), 1);  
                              
                self.peerOnReceiveCallback("close" ,message);
            });
          }

          createQrCode = (url, canvasID) => {
            self.peerConnection.on("open" , function(id){
              QRCode.toCanvas(document.getElementById(canvasID), url +"?id="+self.peerConnection.id, function (error) {
                if (error) console.error(error)
                console.log('success!');
    
            })
        })
      }

    }



