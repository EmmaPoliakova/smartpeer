
class TouchPadSmartPeer extends SmartPeer{

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

