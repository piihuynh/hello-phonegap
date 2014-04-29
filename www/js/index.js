/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var DEBUG = 1;
var REGISTRATION_EXPIRY_TIME_MS = 1000 * 3600 * 24 * 7;

if (typeof window.localStorage === 'undefined'
// || navigator.userAgent.match(/iOS|iPhone|iPad|iPod/i)
) {
	window.localStorage = {
		setItem: function(name,value,days) {
			if (typeof days == 'undefined') days = 30; // max live time
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
			document.cookie = name+"="+value+expires+"; path=/";
		},

		getItem: function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},

		removeItem: function(name) {
			this.setItem(name,"",-1);
		}
	}
}

var app = {
	log: function(msg){
		console.log(msg);
		
		if(!DEBUG) return;
		
		jQuery('#log').append(msg+'<br><hr><br>');
	},
	setItem: function(key,val){
		return window.localStorage.setItem(key,val);
	},
	getItem: function(key){
		return window.localStorage.getItem(key);
	},
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		// document.addEventListener("backbutton", this.onBackButton, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		// navigator.splashscreen.show();
		setTimeout(function() {
			navigator.splashscreen.hide();
		}, 5000);
		
		app.receivedEvent('deviceready');
    },
    onBackButton:function(msg) {
		/* if( $("#home").length > 0){
			// call this to get a new token each time. don't call it to reuse existing token.
			//pushNotification.unregister(successHandler, errorHandler);
			e.preventDefault();
			navigator.app.exitApp();
		}
		else */
		// {
			// navigator.app.backHistory();
		// }
	},
    registerDevice:function() {
		try{
			var pushNotification = window.plugins.pushNotification;
			// TODO: Enter your own GCM Sender ID in the register call for Android
			if (device.platform == 'android' || device.platform == 'Android') {
				pushNotification.register(app.successHandler, app.errorHandler,{"senderID":"974145141110","ecb":"onNotificationGCM"});
			} else {
				pushNotification.register(app.tokenHandler, app.errorHandler,{"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
			}
		}catch(err){ 
			txt="There was an error while register device.\n\n"; 
			txt+="Error description: " + err.message + "\n\n"; 
			alert(txt);
		}
	},
    tokenHandler:function(msg) {
        app.log("Token Handler " + msg);
    },
    errorHandler:function(error) {
        app.log("Error Handler  " + error);
    },
    // result contains any message sent from the plugin call
    successHandler: function(result,a,b) {
        app.log('successHandler: Success! Result = '+result);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
		app.registerDevice();
		
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
		
		if(typeof startapp !== 'undefined' && typeof jQuery !== 'undefined'){
			startapp(jQuery);
		}else{
			parentElement.innerHTML = 'ERROR!';
		}
		
		if(typeof StatusBar !== 'undefined'){
			StatusBar.overlaysWebView( false );
			StatusBar.backgroundColorByName("gray");
		}
		
    },
	storeUser: function(regId,oldRegId){
		var data = {regId:regId};
		if(typeof oldRegId !== 'undefined') data.oldRegId = oldRegId;
		$.ajax({
				// type: 'POST',
				type: 'GET',
				url: "http://tenisuzivo.com/wp-content/themes/tenisuzivo/gcm_server/register.php",
				// data: {name:'test',email:'asdf@asdf.com',regId:regId},
				data: data,
				contentType: "application/json",
				dataType: "jsonp",
				// dataType: "json",
				// jsonp: 'jsonp',
				jsonpCallback: 'myLog',
				crossDomain: true,
				success: function (data,textStatus,jqXHR) {
					// app.log('success, '+textStatus+',data:'+data+jqXHR);
					app.log('app.storeUser success - '+textStatus);
					if(typeof data.error !== 'undefined'){
						// try again
						// setTimeout(function(){
							// app.storeUser(regId,oldRegId);
						// },15000);
					}else{
						app.setItem('regId',regId);
						// app.setItem('last_saved_regid_time_ms',(new Date()).getTime());
						app.log('data.code='+data.code);
						app.log('data.message='+data.message);
						app.log('STORE USER SUCCESSFUL, '+app.getItem('regId'));
					}
				},
				error: function(jqXHR,textStatus,errorThrown){
					// app.log('app.storeUser error: '+errorThrown+' | '+textStatus+' | '+jqXHR);
					app.log('app.storeUser error: '+errorThrown+' | '+textStatus);
					// try again
					// setTimeout(function(){
						// app.storeUser(regId,oldRegId);
					// },15000);
				},
				timeout: 15000
		});
	}
};


function onNotificationGCM(e) {
	// app.log('here2');
	switch( e.event )
	{
		case 'registered':
			if ( e.regid.length > 0 )
			{
				// Your GCM push server needs to know the regID before it can push to this device
				// here is where you might want to send it the regID for later use.
				app.log('registration id = '+e.regid);
				
				// var lastSavedRegIdTimeMS = app.getItem('last_saved_regid_time_ms');
				// if ((new Date()).getTime() - lastSavedRegIdTimeMS > REGISTRATION_EXPIRY_TIME_MS && e.regid != app.getItem('regid')){
				var oldRegId = app.getItem('regId');
				app.log('oldRegId = '+oldRegId);
				if (e.regid != oldRegId){
					app.storeUser(e.regid,oldRegId);
				}
			}
		break;

		case 'message':
		  // this is the actual push notification. its format depends on the data model
		  // of the intermediary push server which must also be reflected in GCMIntentService.java
		  app.log('onNotificationGCM e= ',e);
		  app.log('onNotificationGCM e.message = '+e.message);
		  alert(e.message);
		break;

		case 'error':
		  app.log('GCM error = '+e.msg);
		break;

		default:
		  app.log('An unknown GCM event has occurred');
		  break;
	}
}

// iOS
function onNotificationAPN(event) {
	var pushNotification = window.plugins.pushNotification;
	app.log("Received a notification! " + event.alert);
	app.log("event sound " + event.sound);
	app.log("event badge " + event.badge);
	app.log("event " + event);
	if (event.alert) {
		navigator.notification.alert(event.alert);
	}
	if (event.badge) {
		app.log("Set badge on  " + pushNotification);
		pushNotification.setApplicationIconBadgeNumber(this.successHandler, event.badge);
	}
	if (event.sound) {
		var snd = new Media(event.sound);
		snd.play();
	}
}

function myLog(data){console.log(data)}
if(DEBUG) jQuery('#log').show();

// get timezone offset
/* var utc_offset = 0;
(function(){
  navigator.globalization.getDatePattern(
    function (date) {
		// alert('pattern: ' + date.pattern + '\n');
		utc_offset = date.utc_offset;
	},
    function () {app.log('Error getting pattern\n');},
    {formatLength:'short', selector:'date and time'}
  );
})();
 */
