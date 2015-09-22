$(document).ready(function(){
	/*var listHeight = window.innerHeight - 230;
	 $('#geofence_list').css({'height':listHeight,'min-height':listHeight,'overflow-y':'auto'});*/
});
var KM_UNIT_VALUE = 0;
var MILE_UNIT_VALUE = 1;
function populateGeofenceList(data){
	$('#home_section, #logout').hide();
	$('#home_geofence, #back').show();
	var items = [];
	var list = "list";
	var a_start = '<a href="#" >';
	var a_end = "</a>";
	var list_default = "<div class='list-default'></div>";
	var list_hightlight = "<div class='list-highlight'></div>";
	var list_div = "";
	var arrow_selection = "<div class='arrow-unselect'><img /></div>";
	$('#geofence_list').html("");
	if(data.length != 0 && data != null){
		$.each(data, function(i, listitem)
			{
				if(listitem['status'] == "SUCCESS" || listitem['status'] == "ON"){
					list_div = list_hightlight;
				}
				else{
					list_div = list_default;
				}
				var geofence_name_truncate = listitem['name'];
				if(listitem['name'].length > 30){
					geofence_name_truncate = listitem['name'].substr(0,30);
				}
				items.push('<li id="'+ i +'" class="'+ list +'">'+ list_div +'<div class="geofence-name">' + a_start + geofence_name_truncate + a_end + '</div>'+ arrow_selection +'</li>');
			});
		$('<ul/>', {
		    
			html: items.join('')
		}).appendTo('#geofence_list');
	}
	else
	{
        showPopup(
                {
                    headText: geofence_text,
                    innerText: drivezone_list_empty,
                    button1: ok_button_text
                });
	}
	$("#geofence_list ul li").bind('click',function(){
		$("#geofence_list, #create_geofenceBtn_div").hide();
		$("#geofence_details").show();
		var selected_drivezone = $(this).attr('id');
		/* To populate Geo Fence details */
		populateDrivezoneDetails(data, selected_drivezone);
	});
}
function populateDrivezoneDetails(driveZoneInfo, selected_drivezone)
{
	$('#back').hide();
	driveZoneStatus = "off";
    selectedDrivezone = null;
	$.each(driveZoneInfo, function(i, selecteditem)
	{
		if(i == selected_drivezone){
			selectedDrivezone = selecteditem;
			
	        drivezonePreferenceId = selecteditem['preferenceId'];
	        drivezoneServiceRequestId = selecteditem['serviceRequestId'];
	        drivezoneFenceId=selecteditem['fenceId'];

			var drivezone_list_nameHead = selecteditem['name'];
	        if(selecteditem['name'].length > 30){
				drivezone_list_nameHead = selecteditem['name'].substr(0,30);
			}
	       	$('#geofence_list_name_text').text(drivezone_list_nameHead);
			$('#geofence_name').text(selecteditem['name']);
			$('#geofence_center').text(selecteditem['address']);
			var kmphText = kmtext;
			/*if(selecteditem['unit'] == KM_UNIT_VALUE)
			{
				kmphText = kmtext;
			}
			else if(selecteditem['unit'] == MILE_UNIT_VALUE)
			{
				kmphText = miletext;
			}*/
			$('#geofence_radius_val').text(selecteditem['radius'] + kmphText);
			$('#geofence_category').text(selecteditem['category']);
			$('#geofence_startDate').val(pickDate(selecteditem['activationStartTime']));
			$('#geofence_startTime').val(pickTime(selecteditem['activationStartTime']));
			$('#geofence_endDate').val(pickDate(selecteditem['activationEndTime']));
			$('#geofence_endTime').val(pickTime(selecteditem['activationEndTime']));
			if (selecteditem['status'] == "SUCCESS" || selecteditem['status'] == "ON"){
				$("#geofence_select").val('on').slider('refresh');
				$('#geofence_startDate, #geofence_startTime, #geofence_endDate, #geofence_endTime').attr("disabled", "disabled"); 
			}
			else
			{
				$("#geofence_select").val('off').slider('refresh');
				$('#geofence_startDate, #geofence_startTime, #geofence_endDate, #geofence_endTime').removeAttr("disabled");
				var now = new Date();
				$('#geofence_startDate, #geofence_endDate').val(pickDate(now));
				$('#geofence_startTime').val(pickNewTime(now));
				now.setMinutes(now.getMinutes() + 15);
				$('#geofence_endTime').val(pickNewTime(now));
			}
			driveZoneStatus = $("#geofence_select").val();
			return false;
		}
		
	});
}

$(document).on('slidestop', '#geofence_select', function(){
	activateOrDeactivateGeoFence("geofence_select");
});

function activateOrDeactivateGeoFence(sel)
{
	var selectedElement = document.getElementById(sel);
	var value = selectedElement.options[selectedElement.selectedIndex].value;
	var selectId = selectedElement.getAttribute("id");
	var tempSelectId = selectId.split('_');
	var startDate = $('#'+tempSelectId[0]+'_startDate').val();
	var startTime = $('#'+tempSelectId[0]+'_startTime').val();
	var endDate = $('#'+tempSelectId[0]+'_endDate').val();
	var endTime = $('#'+tempSelectId[0]+'_endTime').val();
	var startDuration = startDate +" "+ startTime;
	var endDuration = endDate +" "+ endTime;
	var drivezoneSreviceReqId=drivezoneServiceRequestId;
	if(value == "on"){
			if(validateDates(startDate, startTime, endDate, endTime))
			{
				var geoFenceData = new getActivateGeofenceData(drivezoneSreviceReqId,getDateString(getDateFromLocalizedString(startDuration)), getDateString(getDateFromLocalizedString(endDuration)));
				activateGeoFence(geoFenceData, activateGeoFenceHdlr);
			}
			else{
				$("#"+selectId).val('off').slider('refresh');
			}
		}
	else if(value == "off"){
		var geoFenceData = new getDeactivateGeofenceData(drivezoneSreviceReqId);
		deActivateGeoFence(geoFenceData, deactivateGeoFenceHdlr);
	}
}

function getActivateGeofenceData(serviceRequestId,activationStartTime, activationEndTime)
{	
	this.serviceRequestId = serviceRequestId;
	this.activationStartTime = activationStartTime;
	this.activationEndTime = activationEndTime;
}
function getDeactivateGeofenceData(serviceRequestId)
{	
	this.serviceRequestId = serviceRequestId;
}
function getDateString(dateVal)
{
    return convertDateToString(dateVal, true);
}

EN_DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
EN_MONTH_NAMES_SHORT  =['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; 

getDateFromLocalizedString = function(str)
{
    var retDate = null;
    if (str != null)
    {
        var day = str.split(" ")[0];
        for (var i = 0; i < shortDayNames.length; i++) 
        {
            if (shortDayNames[i] == day) 
            {
               str = str.replace(day, EN_DAY_NAMES_SHORT[i]);
               break; 
            }
        }
        var month = str.split(" ")[1];
        for (var j = 0; j < shortMonthNames.length; j++) 
        {
            if (shortMonthNames[j] == month) 
            {
               str = str.replace(month, EN_MONTH_NAMES_SHORT[j]);
               break; 
            }
        }
        retDate = new Date(str);
    }
    return retDate;
};
convertDateToString = function (dateVal, dontAddTZD)
{
    var retDateStr = null;
    if (dateVal != null)
    {
        retDateStr = dateVal.getFullYear() + '-' + 
                   ('0' + String(dateVal.getMonth() + 1)).substr(-2) + "-" +
                   ('0' + String(dateVal.getDate())).substr(-2) + "T" +
                   ('0' + String(dateVal.getHours())).substr(-2) + ":" +
                   ('0' + String(dateVal.getMinutes())).substr(-2) + ":" +
                   ('0' + String(dateVal.getSeconds())).substr(-2);
        if (dontAddTZD == undefined || !dontAddTZD)
        {
            var dateStr = String(dateVal);
            var dateStrArr = dateStr.split("GMT");
            if (dateStrArr != null && dateStrArr.length > 0)
            {
                var tzd = dateStrArr[1].split(" ");
                retDateStr += tzd[0].splice(3, 0, ":");
            }
        }
    }
    console.log("In convertDateToString, passed date is " + dateVal + " Returned string is " + retDateStr);
    return retDateStr;
};

function activateGeoFenceHdlr(data)
{
    if (data == 'SUCCESS')
    {
        showPopup(
                {
                    headText: geofence_text,
                    innerText: activate_geofence_done_txt,
                    button1: ok_button_text,
                    popupHdlr:
                        function(data)
                        {
	                    	$("#geofence_details").hide();
	                    	$("#geofence_list, #create_geofenceBtn_div").show();
	                    	getGeofenceList();
                        }
                });
    }
    else
    {
        showPopup(
                {
                    headText: geofence_text,
                    innerText: activate_geofence_error_txt,
                    button1: ok_button_text,
                    popupHdlr:
                        function(data)
                        {
                    		$("#geofence_select").val('off').slider('refresh');
                        }
                });
    }
}

function deactivateGeoFenceHdlr(data)
{
    if (data == 'SUCCESS')
    {
        showPopup(
                {
                    headText: geofence_text,
                    innerText: deactivate_geofence_done_txt,
                    button1: ok_button_text,
                    popupHdlr:
                        function(data)
                        {
	                    	$("#geofence_details").hide();
	                    	$("#geofence_list, #create_geofenceBtn_div").show();
	                    	getGeofenceList();
                        }
                });
    }
    else
    {
        showPopup(
                {
                    headText: geofence_text,
                    innerText: deactivate_geofence_error_txt,
                    button1: ok_button_text,
                    popupHdlr:
                        function(data)
                        {
                    		$("#geofence_select").val('on').slider('refresh');
                        }
                });
    }
}