# SmartPeer: Peer-to-peer for creating smartphone controllers #

SmartPeer provides an easy way of turning a smartphone into versatile controller.


## Getting started 

**Include the library**

  install NPM package:
        `npm install smartpeer`
        
  ```js
  // The usage -
  import Peer from 'peerjs';
  ```


**Create a Peer** 
```javascript
const peer = new smartPeer('id', 'frequency'); 
// all parameters are optional:
// ID: if id isn't provided a random one will be created
// Frequency: how often should the the updates occur 
```


**Create a QRcode** 
Make a qr code for easy phone connection
```javascript
peer.createQrCode(type, url, canvas);
//you can select one premade controllers by specifying a type (joystick, touchscreen, nes controller) or you can provide a url for your own controller
//canvas element for the qr code to be displayed
```

## Events

**Register a new event**

```javascript
peer.on(flag, function);
//Flag: specify when the function should be called (connection, data, close)
//Function: pass a function to be called
```

**Types of **
*connection* 
*data* 
*close*

