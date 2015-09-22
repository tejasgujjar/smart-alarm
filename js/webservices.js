//var serviceURL =  "http://localhost:8080/IHome/remote/";
var STATUS_SUCCESS = 200;
var baseWebServiceUrl = "https://testinfiniti.cognizant.com/UconnectServer/";
//var baseWebServiceUrl = "http://localhost:8080/Uconnect/";
//var baseWebServiceUrl = "http://localhost:8080/UconnectServer/";
var INVALID_SESSION = 401;
var STATUS_NETWORK_FAILURE = 0;
$(document).ready(function()
{

});

createGeofenceRequest = function(requestString)
{
	    $.ajax({
	        type : 'POST',
	        url : baseWebServiceUrl + "geofence/createGeofence",
	        contentType : 'application/json',
	        dataType : 'json',
	        data : requestString,
	        xhrFields: {withCredentials: true},
	        /*beforeSend : function() {
	        	$.blockUI({message: '<h3>'+just_a_moment+'<div><img src="images/loading.gif" /></div></h3>',
	                css:{width:'90%',left:'4%'}});
	         },*/
	        success : function(data, status, jqXHR) {
            if(data != null && jqXHR != null && jqXHR.status == STATUS_SUCCESS)
            {
            	showPopup(
        	            {
        	                headText: create_geofence_text,
        	                innerText: create_geofence_success_message,
        	                button1: ok_button_text,
        	                popupHdlr: function()
        	                {
        	                	$("#geofence_list, #create_geofenceBtn_div").show();
        	                	$('#create_geofence_screen').hide();
    	                    	getGeofenceList();
        	                }
        	            });
            } 
	        },

	        error : function(jqXHR, status, exception) 
	        {
	           handleCreateGeoFenceError(jqXHR);
	            
	        },

	        complete : function(jqXHR, status) 
	        {
	        	//$.unblockUI();
	        }
	    });
};

function handleCreateGeoFenceError(jqXHR)
{
	showPopup(
            {
                headText: error_title,
                innerText: create_geofence_error_message,
                button1: ok_button_text,
                popupHdlr: function()
                {
                	$("#createGeofence_select").val('off').slider('refresh');
                }
            });
}
function makeLoginReq(encryptedUser, encryptedPassword)
{
	//encryptedUser=encode64(encryptedUser);
	//encryptedPassword=encode64(encryptedPassword);
    var loginObj = new loginRequest(encryptedUser, encryptedPassword);
    var requestString = '{"authenticate":' + JSON.stringify(loginObj) +'}';

    $.ajax({
        type : 'POST',
        url : baseWebServiceUrl + "auth/login",
        contentType : 'application/json',
        dataType : 'json',
        data : requestString,
        xhrFields: {withCredentials: true},
       /* beforeSend : function() {
        	$.blockUI({message: '<h3>'+just_a_moment+'<div><img src="images/loading.gif" /></div></h3>',
                css:{width:'90%',left:'4%'}});
         },*/
        success : function(data, status, jqXHR) {
                if (jqXHR != null && jqXHR.status == STATUS_SUCCESS && data.status == 'Active')
                {
                	window.location = "main.html";
                }
                else if (data.status == 'InActive')
                {
                    handleLoginError(jqXHR, data);
                } 
        },

        error : function(jqXHR, status, exception) 
        {
            handleLoginError(jqXHR);
        },

        complete : function(jqXHR, status) 
        {
        	//$.unblockUI();
        }
    });
}

function handleLoginError(jqXHR, data)
{
	/*if (jqXHR != null && 
	   (jqXHR.status == INVALID_USERNAME || jqXHR.status == INVALID_PASSWORD))
	{
		showPopup(
	            {
	                headText: error_title,
	                innerText: comm_failure_msg,
	                button1: ok_button_text
	            });
	}
	else
	{
	    showPopup(
	            {
	                headText: error_title,
	                innerText: comm_failure_msg,
	                button1: ok_button_text
	            });
	}*/
	showPopup(
            {
                headText: error_title,
                innerText: login_failed_msg,
                button1: ok_button_text,
                popupHdlr: function()
                {
                	$('#username').val("");
            		$('#password').val("");
                }
            });
}

loginRequest = function(userName, password)
{
    this.userid = userName;
    this.password = password;
};

function getNotificationsList(successCallback)
{

    $.ajax({
        type : 'GET',
        url : baseWebServiceUrl + "notifications/notificationHistory",
        contentType : 'application/json',
        dataType : 'json',
        xhrFields: {withCredentials: true},
       /* beforeSend : function() {
        	$.blockUI({message: '<h3>'+just_a_moment+'<div><img src="images/loading.gif" /></div></h3>',
                css:{width:'90%',left:'4%'}});
         },*/
        success : function(data, status, jqXHR) {
            if (data != null) 
            {
                // Reverse the list so that the latest items appear at the top
                // of the list
                //data.reverse();
            	successCallback(data);   
            }
        },

	    error : function(jqXHR, status, exception) 
	    {
	    	if (!handleSessionTimeout(jqXHR))
	        {
	            var msg = (empty_list_msg != null) ? empty_list_msg : notifications_error_msg;
	            if (jqXHR!= null && jqXHR.status == NOTIFICATION_HISTORY_ERROR)
	            {
	                showPopup(
	                        {
	                            headText: error_title,
	                            innerText: msg,
	                            button1: ok_button_text,
	                            popupHdlr: function()
	                            {
	                                successCallback(null, false);
	                            }
	                        });
	            }
	            else
	            {
	                handleOtherErrors(jqXHR, function()
                    {
	                	successCallback(null, false);
                    });
	            }
	        }
	    },
	    
	    complete : function(jqXHR, status) 
	    {
	    	//$.unblockUI();
	    }
    });
}

function handleSessionTimeout(jqXHR)
{
    if (jqXHR != null)
    {
        if (jqXHR.status == INVALID_SESSION)
        {
            showPopup(
                    {
                        headText: error_title,
                        innerText: invalid_session_msg,
                        button1: ok_button_text
                    });
            return true;
        }
        else if (jqXHR.status == STATUS_NETWORK_FAILURE)
        {
            showPopup(
                    {
                        headText: error_title,
                        innerText: network_disconnected_msg,
                        button1: ok_button_text
                    });
            return true;
        }
    }
    return false;
}

getGeofenceList = function() 
{
    
	/*var jsonData = demo_geofence_data;    		
    var data = $.parseJSON(jsonData); 
    populateGeofenceList(data);*/
	
	$.ajax({
        type : 'GET',
        url : baseWebServiceUrl + "geofence/geofences",
        contentType : 'application/json',
        dataType : 'json',
        xhrFields: {withCredentials: true},
        /*beforeSend : function() {
        	$.blockUI({message: '<h3>'+just_a_moment+'<div><img src="images/loading.gif" /></div></h3>',
                css:{width:'90%',left:'4%'}});
         },*/
        success : function(data, status, jqXHR) {
            if (data == null) 
            {
                showPopup(
                        {
                            headText: geofence_text,
                            innerText: get_drivezone_list_error_txt,
                            button1: ok_button_text
                        });
            } 
            else 
            {
                console.log(data);
                console.log(status);
                populateGeofenceList(data);
            }
        },

        error : function(jqXHR, status, exception)
        {
            if (!handleSessionTimeout(jqXHR))
            {
                if(jqXHR != null && jqXHR.status == GET_DRIVEZONE_LIST_ERROR)
                {
                    showPopup(
                            {
                                headText: geofence_text,
                                innerText: get_drivezone_list_error_txt,
                                button1: ok_button_text,
                                popupHdlr: 
                                    function(data)
                                    {
                                		populateGeofenceList(null);
                                    }
                            });
                }
                else
                {
                    populateGeofenceList(null);
                }
            }
        },

        complete : function(jqXHR, status)
        {
        	//$.unblockUI();
        }

    });
};

function logoutUser()
{
	$.ajax({
		type : 'POST',
        url : baseWebServiceUrl + "auth/logout",
        contentType : 'application/json',
        dataType : 'json',
        xhrFields: {withCredentials: true},
        /*beforeSend : function() {
        	$.blockUI({message: '<h3>'+just_a_moment+'<div><img src="images/loading.gif" /></div></h3>',
                css:{width:'90%',left:'4%'}});
         },*/
        success : function(data, status, jqXHR)
        {
            if (jqXHR != null && jqXHR.status == "Logout Succes") 
            {
            	window.location = "login.html";
            }
        },

	    error : function(jqXHR, status, exception) 
	    {
	    	window.location = "login.html";
	    },
	    
	    complete : function(jqXHR, status) 
	    {
	    	//$.unblockUI();
	    }
    });
}

activateGeoFence = function(geoFenceData, responseCallback) 
{

    var requestString = null;
    if (geoFenceData != null && geoFenceData !="")
    {
        requestString = JSON.stringify(geoFenceData);
        console.log(requestString);
    }
    
    $.ajax({
        type : 'POST',
        url : baseWebServiceUrl + "geofence/activateGeofence",
        contentType : 'application/json',
        dataType : 'json',
        data : requestString,
        xhrFields: {withCredentials: true},
        success : function(data, status, jqXHR) 
        {
            responseCallback.apply(undefined, ['SUCCESS']);
        },

        error : function(jqXHR, status, exception) 
        {
            if (!handleSessionTimeout(jqXHR))
            {
                /*if (jqXHR != null && jqXHR.status == ACTIVATE_DRIVEZONE_ERROR)
                {
                    responseCallback.apply(undefined, ['FAILURE']);
                }
                else */if (jqXHR != null && jqXHR.status == STATUS_SUCCESS)
                {
                    responseCallback.apply(undefined, ['SUCCESS']);
                }
                else
                {
                    handleOtherErrors(jqXHR, function() 
                            {
                                responseCallback.apply(undefined, ['FAILURE']);
                            });
                }
            }
        },

        complete : function(jqXHR, status) 
        {
        }
    });
};

deActivateGeoFence = function(geoFenceData, responseCallback) 
{
    var requestString = null;
    if (geoFenceData != null && geoFenceData !="")
    {
        requestString = JSON.stringify(geoFenceData);
        console.log(requestString);
    }

    $.ajax({
        type : 'DELETE',
        url : baseWebServiceUrl + "geofence/deactivateGeofence",
        contentType : 'application/json',
        dataType : 'json',
        data:requestString,
        xhrFields: {withCredentials: true},

        success : function(data, status, jqXHR) {
            responseCallback.apply(undefined, ['SUCCESS']);
        },

        error : function(jqXHR, status, exception) 
        {
            if (!handleSessionTimeout(jqXHR))
            {
            	responseCallback.apply(undefined, ['FAILURE']);
            }
        },

        complete : function(jqXHR, status) 
        {
        }
    });
};