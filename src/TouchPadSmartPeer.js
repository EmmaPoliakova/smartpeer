class TouchPadSmartPeer extends SmartPeer{

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

class TouchPad{

  constructor(playerNum){
    this.playerNum = playerNum;
    this.isActive = false;
    this.state = [];
    this.finger_number = 0;
  }
 }