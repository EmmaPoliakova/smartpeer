# SmartPeer: Peer-to-peer for creating smartphone controllers #

SmartPeer provides an easy way of turning a smartphone into versatile controller.


## Getting started 

**Include the library**

  install NPM package:
        `npm install smartpeer`
        
  ```js
  // The usage -
  import SmartPeer from 'smartpeer';
  ```


**Create a Peer** 
```javascript
const peer = new SmartPeer('id', 'frequency'); 
// all parameters are optional:
// ID: if id isn't provided a random one will be created
// Frequency: how often should the the updates occur 
```


**Create a QRcode** \
Make a qr code for easy phone connection
```javascript
peer.createQrCode(type, url, canvas);
//select from premade controllers by specifying a type (joystick, touchscreen, nes controller) or provide a url for your own controller
//canvas element for the qr code to be displayed
```

## Events

**Register a new event**

```javascript
peer.on(flag, function);
//Flag: specify when the function should be called (connection, data, close)
//Function: pass a function to be called
```

**Types of callbacks** \
*connection* : will pass a number of player who just connected to your function \
*data* : will pass a player number and the input from the phone \
*close* : will pass a number of player who just disconnected 

## Connection 

**Display stats**
```javascript
peer.getStats(type, DomElement)
//Specify type of stats you wish to display (latency, update frequency...) and an html element to display them
```

**Access last state of a player**
```javascript
peer.state.playerNumber
//will return last known state of a given player
```

**Check active players**
```javascript
peer.state.players
//will return a dictoniary of currently connected players
```

## RemoteTouchPad


**Create a Peer** 
```javascript
const touchpad_peer = new TouchPadSmartPeer('id', 'frequency'); 
```

**Fields** 
```javascript
touchpad_peer.finger_number = 1-5;
touchpad_peer.finger_position = { 1:{x, y}, 2:{x,y}, ... , 5:{x,y}};
```

**Methods** 
```javascript
touchpad_peer.recognizeGesture();
touchpad_peer..createQRCode(default url);
```

**Callbacks** 
```javascript
touchpad_peer.on("finger_number", func(){});
touchpad_peer.on("touch_start / touch_move / touch_end", func(){});
```


## RemoteJoystick


**Create a Peer** 
```javascript
const joystick_peer = new JoystickSmartPeer('id', 'frequency'); 
```

**Fields** 
```javascript
joystick_peer.vector = [x,y]; 
joystick_peer.last_state = { position :{x, y}, angle:{degrees, radians}, direction :{x, y, angle}, force, distance};
```

**Methods** 
```javascript
touchpad_peer..createQRCode(default url);
```

**Callbacks** 
```javascript
touchpad_peer.on("touch_start / touch_move / touch_end", func(){});
```


