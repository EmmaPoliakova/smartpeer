class JoystickSmartPeer extends SmartPeer{

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