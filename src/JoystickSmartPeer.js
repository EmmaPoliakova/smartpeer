
class JoystickSmartPeer extends SmartPeer{

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