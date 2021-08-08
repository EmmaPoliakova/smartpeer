import Peer from 'peerjs'
import QRCode from 'qrcode'
import EventEmitter2 from 'eventemitter2'

class Joystick{

  /*fields:
   state = last known joystick state
   vector = current vector calulated from the centre of the joystick and its current position
   
   */

 constructor(playerNum){
   this.playerNum = playerNum;
   this.isActive = false;
   this.state = [];
   this.vector= [];
   this.lastPosition = {x:0, y:0}
 }
}

class TouchPad{

 constructor(playerNum){
   this.playerNum = playerNum;
   this.isActive = false;
   this.state = [];
   this.finger_number = 0;
 }
}



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
        }
      
          

      
          peerOnConnection = (conn) => {
            this.remotePeers.push(conn);  //add to current connected peers
            var message = self.remotePeers.indexOf(conn); 

            self.emit('connection', message);

            conn.on("data", function(data){
                var message = [self.remotePeers.indexOf(conn), data]  //send data received from phone/remote peer + the player number/ index from the peer list
          
                self.emit('data', message);
            });
      
            conn.on('close',function(){  //send a number of a player who disconnected 
                var message = "Player " + self.remotePeers.indexOf(conn) + " disconnected"; 
                self.remotePeers.splice(self.remotePeers.indexOf(conn), 1);  
                
                console.log(this.remotePeers);

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
          self = this;
          this.touchpadList = [];
          this.peerConnection.on("connection", this.touchpadOptions);
      }
      
      touchpadOptions = (conn) => {
          self.touchpadList[conn.peer] = new TouchPad(self.remotePeers.indexOf(conn));

          conn.on("data", function(data){

              var touchpad = self.touchpadList[conn.peer];

              //start move stop
              self.emit(data[0]);
              console.log(data[0])

              touchpad.state = data[2];
  
              self.emit(touchpad.finger_number);

              if (data[0]=="start"){
                self.touchpadList[conn.peer].isActive = true;
              }
    
              if (data[0]=="end"){
                self.touchpadList[conn.peer].isActive = false;
              }
         
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

  constructor(peerid) {
      super(peerid);
      self = this;
      this.joystickList = {};


      this.peerConnection.on("connection", this.joystickOptions);
  }
  
  joystickOptions = (conn) => {
      self.joystickList[conn.peer] = new Joystick(self.remotePeers.indexOf(conn));

      
      conn.on("data", function(data){

          self.emit(data[0]);     

          if (data[0]=="start"){
            self.joystickList[conn.peer].isActive = true;
          }

          if (data[0]=="end"){
            self.joystickList[conn.peer].isActive = false;
          }
          
          self.joystickList[conn.peer].state = data[1];
          
          var xunits = Math.cos(data[1].angle.degree*Math.PI/180) * 10;
          var yunits = Math.sin(data[1].angle.degree*Math.PI/180) * 10;

          console.log(xunits + " " + yunits)
          self.joystickList[conn.peer].lastPosition.x += xunits
          self.joystickList[conn.peer].lastPosition.y += yunits
          
        
          
          
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

  
  



