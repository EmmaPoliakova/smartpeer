import Peer from 'peerjs'
import QRCode from 'qrcode'
import EventEmitter2 from 'eventemitter2'

export class SmartPeer extends EventEmitter2{

        /*fields:
        peerCoonection = peerjs object
        remotePeers = list of connected peers
        callbackFunction = dictionary of functions to be called on events
        */

        constructor(peerid) {
            super();
            this.peerConnection = new Peer(peerid); 
            self = this;
      
            this.peerConnection.on('open', function(id) {  //logs the browser peer id
                console.log('My peer ID is: ' + id);
                self.emit('open', "hello");
                
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
            self.emit('connection', message);

            conn.on("data", function(data){
                var message = [self.remotePeers.indexOf(conn), data]  //send data received from phone/remote peer + the player number/ index from the peer list
                self.peerOnReceiveCallback("data" ,message);
                self.emit('data', message);
            });
      
            conn.on('close',function(){  //send a number of a player who disconnected 
                var message = "Player " + self.remotePeers.indexOf(conn) + " disconnected"; 
                self.remotePeers.splice(self.remotePeers.indexOf(conn), 1);  
                              
                self.peerOnReceiveCallback("close" ,message);
                self.emit('close', message);
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


    export class TouchPadSmartPeer extends SmartPeer{

      /*fields:
      finger_number = number of finger interacting with the touch screen
      finger_position = dictionary of xy coordinates for each finger interacting with touch screen
      
      */
  
      constructor(peerid) {
          super(peerid);
          //self = this;
          this.finger_number = 0;
          this.finger_position = {}
  
          this.peerConnection.on("connection", this.touchpadOptions);
      }
      
      touchpadOptions = (conn) => {
          conn.on("data", function(data){
  
              self.finger_position = data.details;
              self.finger_number = Object.keys(self.finger_position).length;
  
              self.emit(self.finger_number, self.finger_number);
  
              //start move stop
              self.emit(data[0]);
         
          });
        }
  
  
        createQrCode = (url = "touch screen canvas url", canvasID) => {
          self.peerConnection.on("open" , function(id){
            QRCode.toCanvas(document.getElementById(canvasID), url +"?id="+self.peerConnection.id, function (error) {
              if (error) console.error(error)
              console.log('success!');
  
          })
      })
    }
  
  }

  export class JoystickSmartPeer extends SmartPeer{

    /*fields:
    state = last known joystick state
    vector = current vector calulated from the centre of the joystick and its current position
    
    */

    constructor(peerid) {
        super(peerid);
        self = this;
        this.state = {};
        this.vector= [];

        this.peerConnection.on("connection", this.joystickOptions);
    }
    
    joystickOptions = (conn) => {
        conn.on("data", function(data){

            self.state = data[1];

            //start move stop
            self.emit(data[0]);

        });
      }


      createQrCode = (url = "joystick url", canvasID) => {
        self.peerConnection.on("open" , function(id){
          QRCode.toCanvas(document.getElementById(canvasID), url +"?id="+self.peerConnection.id, function (error) {
            if (error) console.error(error)
            console.log('success!');

        })
    })
  }

}
  
  



