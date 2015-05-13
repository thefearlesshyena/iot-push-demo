/* Cordova Push Notification Demo
 * index.js - this file should be in your_cordova_app_root/www/js
 * Also, you need PushNotification.js and PubNub.js in the dir too.
 * Install Cordova Push Plugin w/ CLI...
 * $ cordova plugin add https://github.com/phonegap-build/PushPlugin.git 
 */
 
var channel = '';
var t = document.getElementById('temperature');
 
var pubnub = PUBNUB.init({
        subscribe_key: 'sub-c-fb0bdcb6-f99e-11e4-b608-02ee2ddab7fe ',
        publish_key:   'pub-c-244dd819-f95d-4516-a874-8cd2c4b5442f ',
    });
 
function initialize() {
    bindEvents();
}
function bindEvents() {
    document.addEventListener('deviceready', init, false);
}
 
function init() {
    var pushNotification = window.plugins.pushNotification;
    pushNotification.register(successHandler, errorHandler, {'senderID':'1044047597679','ecb':'onNotificationGCM'});
    // Get your Sender ID at cloud.google.com/console
}
 
function successHandler(result) {
    console.log('Success: '+ result);
}
 
function errorHandler(error) {
    console.log('Error: '+ error);
}
 
function onNotificationGCM(e) {
    switch( e.event ){
        case 'registered':
            if ( e.regid.length > 0 ){
                console.log('regid = '+e.regid);
                deviceRegistered(e.regid);
            }
        break;
 
        case 'message':
            console.log(e);
            if (e.foreground){
                alert('The room temperature is set too high')
            }
        break;
 
        case 'error':
            console.log('Error: '+e.msg);
        break;
 
        default:
          console.log('An unknown event was received');
          break;
    }
}
 
// Publish the channel name and regid to PubNub
function deviceRegistered(regid) {
    channel = regid.substr(regid.length - 8).toLowerCase();
 
    var c = document.querySelector('.channel');
    c.innerHTML = 'Your Device ID: <strong>' + channel + '</strong>';
    c.classList.remove('blink'); 
 
    pubnub.publish({
        channel: channel,
        message: {
            regid: regid
        }
    });
 
    pubnub.subscribe({
        channel: channel,
        callback: function(m) {
            console.log(m);
            t.classList.remove('gears');
            if(m.setting) {
                t.textContent = m.setting + '°';
            }
        }
    });  
}
 
 
initialize();