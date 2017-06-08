/*
/*
 * StratusForms Public SharePoint Data Layer - Store HTML forms in SharePoint lists using jQuery
 * Version 1.4
 * @requires jQuery v1.4.2 or greater - jQuery 1.7+ recommended
 * @requires SPServices 
 * @requires StratusForms http://www.stratusforms.com
 *
 * Copyright (c) 2013-2017 Mark Rackley
 * Examples and coming soon.
  * This work is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. 
 * http://creativecommons.org/licenses/by-nc/3.0/
 */
/**
 * @description data layer for StratusForms engine that uses SPServices to store and retrieve data from SharePoint List
 * @type jQuery
 * @name StratusForms
 * @category Plugins/StratusForms
 * @author Mark Rackley / http://www.stratusforms.com  / info@stratusforms.com 
 */



$.fn.StratusFormsLoadDropDownList = function (element, curValue, webURL, query, listName, firstOptionText,
					fieldName, orderByField, completefunc,selValue) {

    if (query == "") {
        query = "<Query><Where><Neq><FieldRef Name='ID'/><Value Type='Integer'>0</Value></Neq></Where><OrderBy><FieldRef Name='" +
			orderByField + "'/></OrderBy></Query>";
    }

    //The Web Service method we are calling, to read list items we use 'GetListItems'
    var method = "GetListItems";
    var fieldsToRead = "<ViewFields><FieldRef Name='" + fieldName + "' /></ViewFields>";

    //Here is our SPServices Call where we pass in the variables that we set above
    $().SPServices({
        operation: method,
        async: true,  //if you set this to true, you may get faster performance, but your order may not be accurate.
        listName: listName,
        webURL: webURL,
        CAMLViewFields: fieldsToRead,
        CAMLQuery: query,
        //this basically means "do the following code when the call is complete"
        completefunc: function (xData, Status) {
            var options = "<option value='0'> " + firstOptionText + " </option>";
            //this code iterates through every row of data returned from the web service call
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                var id = $(this).attr("ows_ID");
                var value = ($(this).attr("ows_" + fieldName));
                if (value.split(";#")[1] != undefined) {
                    value = value.split(";#")[1];
                }
                if ($.trim(value) == $.trim(curValue)) {
                    options += "<option selected='selected' value='" + id + "' >" + value + "</option>";
                }
                else {
                    options += "<option value='" + id + "'>" + value + "</option>";
                }
            });
            $(element).append(options);
            if (completefunc !== null) {
                completefunc(element,selValue);
            }

        }
    });
}

$.fn.StratusFormsLoadChildDropDownList = function (element, curValue, webURL, query, parentID,
					parentField, listName, firstOptionText,
					fieldName, orderByField, completefunc) {
    if (query == "") {
        query = "<Query>" +
	                "<Where>" +
	                    "<Eq>" +
	                        "<FieldRef Name='" + parentField + "' LookupId='TRUE'/><Value Type='Lookup'>" + parentID + "</Value>" +
	                    "</Eq>" +
	                "</Where>" +
	                "<OrderBy>" +
                            "<FieldRef Name='" + orderByField + "' />" +
	                "</OrderBy>" +
	            "</Query>";
    }
    
    console.dir(query);

    //The Web Service method we are calling, to read list items we use 'GetListItems'
    var method = "GetListItems";
    var fieldsToRead = "<ViewFields>" +
                            "<FieldRef Name='" + fieldName + "' />" +
                        "</ViewFields>";
                        
    console.dir(fieldsToRead);

    //Here is our SPServices Call where we pass in the variables that we set above
    $().SPServices({
        operation: method,
        async: false,  //if you set this to true, you may get faster performance, but your order may not be accurate.
        listName: listName,
        webURL: webURL,
        CAMLViewFields: fieldsToRead,
        CAMLQuery: query,
        //this basically means "do the following code when the call is complete"
        completefunc: function (xData, Status) {
            var options = "<option value='0'> " + firstOptionText + " </option>";
            //this code iterates through every row of data returned from the web service call

            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                var id = $(this).attr("ows_ID");
                var value = ($(this).attr("ows_" + fieldName));
                if (value != undefined) {
                    if ($.trim(value) == $.trim(curValue)) {
                        options += "<option selected='selected' value='" + id + "' >" + value + "</option>";
                    }
                    else {
                        options += "<option value='" + id + "'>" + value + "</option>";
                    }
                }
            });
            $(element).append(options);
            if (completefunc !== null) {
                completefunc(this);
            }

        }
    });

}

$.fn.StratusFormsLoadFormFields = function (form, id, listName, StratusFormsDataField,listFieldsArray) {
    var defer = $.Deferred();

    var query = "<Query>" +
                    "<Where>" +
                        "<Eq>" +
                            "<FieldRef Name='ID'/><Value Type='Integer'>" + id + "</Value>" +
                        "</Eq>" +
                    "</Where>" +
                "</Query>";

    //The Web Service method we are calling, to read list items we use 'GetListItems'
    var method = "GetListItems";
    var fieldsToRead = "<ViewFields>" +
                            "<FieldRef Name='" + StratusFormsDataField + "' />" +
                            "<FieldRef Name='Created' />" +
                            "<FieldRef Name='Author' />";
                            
	for(var index in listFieldsArray)
	{
		fieldsToRead += "<FieldRef Name='"+listFieldsArray[index]+"' />"
	}                         
    fieldsToRead += "</ViewFields>";

    //Here is our SPServices Call where we pass in the variables that we set above
    $().SPServices({
        operation: method,
        async: false,  //if you set this to true, you may get faster performance, but your order may not be accurate.
        listName: listName,
        CAMLViewFields: fieldsToRead,
        CAMLQuery: query,
        //this basically means "do the following code when the call is complete"
        completefunc: function (xData, Status) {
        
        	var listFields = {};

            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                var value = ($(this).attr("ows_" + StratusFormsDataField));
                var createdBy = ($(this).attr("ows_Author").split(";#")[1]);
                var created = ($(this).attr("ows_Created"));
               	for (var index in listFieldsArray)
               	{
               		listFields[listFieldsArray[index]] = ($(this).attr("ows_"+listFieldsArray[index]));
               	}

                defer.resolve(value, createdBy, created,listFields);

            });

        }
    });
    return defer.promise();
}

$.fn.StratusFormsFormReporting = function (element, listName, StratusFormsDataField, query, columnDisplay, sourceData) {

    //create table header row
    $(element).append("<thead>");
    for (var index in columnDisplay) {
        $(element).append("<th>" + columnDisplay[index] + "</th>");
    }
    $(element).append("</thead>");

    //create aoColumns parameter for dataTables
    var colArray = [];
    for (var index in sourceData) {
        var obj = { "mData": sourceData[index] };
        colArray.push(obj);
    }

    $().SPServices({
        operation: "GetListItems",
        async: true,
        listName: listName,
        CAMLViewFields: "<ViewFields><FieldRef Name='" + StratusFormsDataField + "' /></ViewFields>",
        CAMLQuery: query,
        completefunc: function (xData, Status) {
            var dataArray = new Array();
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                var reportData = $(this).attr("ows_StratusFormsData");
                var reportObject = null;
               eval("reportObject=" + reportData );                
                dataArray.push(reportObject);
            });

            $(element).dataTable({
                "bProcessing": true,
                "aaData": dataArray,
                "aoColumns": colArray
            });

        }

    });

}

$.fn.StratusFormsGetFieldValue = function (listName, id, fieldName, getText) {
    var query = "<Query>" +
	                "<Where>" +
	                    "<Eq>" +
	                        "<FieldRef Name='ID'/><Value Type='Integer'>" + id + "</Value>" +
	                    "</Eq>" +
	                "</Where>" +
	            "</Query>";

    //The Web Service method we are calling, to read list items we use 'GetListItems'
    var method = "GetListItems";
    var list = listName;
    var fieldsToRead = "<ViewFields>" +
                            "<FieldRef Name='" + fieldName + "' />" +
                        "</ViewFields>";

    var returnValue = 0;

    //Here is our SPServices Call where we pass in the variables that we set above
    $().SPServices({
        operation: method,
        async: false,  //if you set this to true, you may get faster performance, but your order may not be accurate.
        listName: list,
        CAMLViewFields: fieldsToRead,
        CAMLQuery: query,
        //this basically means "do the following code when the call is complete"
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                id = $(this).attr("ows_ID");
                value = ($(this).attr("ows_" + fieldName));
                if (value != undefined) {
                    if (getText == undefined || getText == false) {
                        returnValue = value.split(";#")[0];
                    } else {
                        returnValue = value.split(";#")[1];
                    }
                }
            });
        }
    });
    return returnValue;

}

$.fn.StratusFormsGetLookupFieldValue = function (listName, fieldName, fieldValue, returnField, getText) {
    var query = "<Query>" +
	                "<Where>" +
	                    "<Eq>" +
	                        "<FieldRef Name='" + fieldName + "' LookupId='TRUE'/><Value Type='Lookup'>" + fieldValue + "</Value>" +
	                    "</Eq>" +
	                "</Where>" +
	            "</Query>";

    //The Web Service method we are calling, to read list items we use 'GetListItems'
    var method = "GetListItems";
    var list = listName;
    var fieldsToRead = "<ViewFields>" +
                            "<FieldRef Name='" + returnField + "' />" +
                        "</ViewFields>";

    var returnValue = 0;

    //Here is our SPServices Call where we pass in the variables that we set above
    $().SPServices({
        operation: method,
        async: false,  //if you set this to true, you may get faster performance, but your order may not be accurate.
        listName: list,
        CAMLViewFields: fieldsToRead,
        CAMLQuery: query,
        //this basically means "do the following code when the call is complete"
        completefunc: function (xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                id = $(this).attr("ows_ID");
                value = ($(this).attr("ows_" + returnField));
                if (value != undefined) {
                    if (getText == undefined || getText == false) {
                        returnValue = value.split(";#")[0];
                    } else {
                        returnValue = value.split(";#")[1];
                    }
                }
            });
        }
    });
    return returnValue;


}

$.fn.StratusFormsSaveForm = function (listName, formID, StratusFormsValuePairs, saveCompleteFunc,StratusFormsChildListData, UploadFiles) {

    var batchCommand = "New";
    var ID = 0;
    if (formID != undefined && formID != 0) {
        batchCommand = "Update";
        ID = formID;
    }
    
    var defer = $.Deferred();

    $().SPServices({
        operation: "UpdateListItems",
        listName: listName,
        batchCmd: batchCommand,
        ID: ID,
        valuepairs: StratusFormsValuePairs,
        completefunc: function (xData, Status) {
            var errorCode = $(xData.responseXML).find("ErrorCode").text();
            if (errorCode != "0x00000000") {
                alert("An error occurred creating or updating your form. Please check your entries and try again.\n\n" + $(xData.responseXML).find("ErrorCode").text() + " - " + $(xData.responseXML).find("ErrorText").text());
                
                if ($().GetStratusFormsDebug())
				{
	                alert("listName : " +  listName);
	                alert("formId : " + formID);
	                alert("ValuePairs : " +  StratusFormsValuePairs);
	                alert("ChildListData : " + StratusFormsChildListData);
                }
          		defer.resolve();
                return;
            }
            else if (Status == "Error") {
                alert("Unable to communicate with Sharepoint Server!");
                defer.resolve();
                return;
            }
            //			alert(xData.responseXML.xml);
            var newId = $(xData.responseXML).SPFilterNode("z:row").attr("ows_ID");
            if (StratusFormsChildListData.length > 0)
            	HandleChildListData(StratusFormsChildListData,listName,newId);
            
            var FilesToUpload = UploadFiles.length;
            if (FilesToUpload == 0)
            {
	            if (saveCompleteFunc !== null) {
	                saveCompleteFunc(newId);
	            } 
				defer.resolve();	                   			
            }
            else {
	        	for (index in UploadFiles)
	        	{
	        		var file = UploadFiles[index];
	        		var call = $().StratusFormsUploadFile(file.file,file.listName,newId,file.lookupField);
	        		call.done(function(options){
	        			FilesToUpload--;
	        			if (FilesToUpload <= 0)
	        			{
				            if (saveCompleteFunc !== null) {
				                saveCompleteFunc(newId);
				            }        			
	        			}
	        		});
	        	}
        	}
        	
            
        }
    });
    
    return defer.promise();

}


$.fn.StratusFormsGetChild = function (parentList, parentID, childObject) {


  var query = "<Query>" +
	                "<Where>" +
	                	"<And>" +
	                    "<Eq>" +
	                        "<FieldRef Name='StratusFormsRowID'/><Value Type='Text'>" + childObject.rowID + "</Value>" +
	                    "</Eq>" +
	                    "<Eq>" +
							"<FieldRef Name='" + parentList + "' LookupId='TRUE'/><Value Type='Lookup'>" + parentID + "</Value>" +
	                    "</Eq>" +
	                	"</And>" +
	                "</Where>" +
	            "</Query>";

    //The Web Service method we are calling, to read list items we use 'GetListItems'
    var method = "GetListItems";
    var list = childObject.list;
    var fieldsToRead = "<ViewFields>" +
                            "<FieldRef Name='ID' />" +
                        "</ViewFields>";

    var returnValue = 0;

    //Here is our SPServices Call where we pass in the variables that we set above
    $().SPServices({
        operation: method,
        async: false,  //if you set this to true, you may get faster performance, but your order may not be accurate.
        listName: list,
        CAMLViewFields: fieldsToRead,
        CAMLQuery: query,
        //this basically means "do the following code when the call is complete"
        completefunc: function (xData, Status) {
        	var id = 0;
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
                id = $(this).attr("ows_ID");
            });
            $().StratusFormsSaveForm(childObject.list,id,childObject.valuePairs,null,new Array());

        }
    });

}

function HandleChildListData(StratusFormsChildListData, parentList, parentID) {

var list = StratusFormsChildListData[0].list;


  var query = "<Query>" +
	                "<Where>" +
	                    "<Eq>" +
							"<FieldRef Name='" + parentList + "' LookupId='TRUE'/><Value Type='Lookup'>" + parentID + "</Value>" +
	                    "</Eq>" +
	                "</Where>" +
	            "</Query>";

    //The Web Service method we are calling, to read list items we use 'GetListItems'
    var method = "GetListItems";
    var fieldsToRead = "<ViewFields>" +
                            "<FieldRef Name='ID' />" +
                        "</ViewFields>";

    var returnValue = 0;

    //Here is our SPServices Call where we pass in the variables that we set above
    $().SPServices({
        operation: method,
        async: false,  //if you set this to true, you may get faster performance, but your order may not be accurate.
        listName: list,
        CAMLViewFields: fieldsToRead,
        CAMLQuery: query,
        //this basically means "do the following code when the call is complete"
        completefunc: function (xData, Status) {
        	var id = 1;
			var camlQuery = "<Batch OnError='Continue' >";
			
            $(xData.responseXML).SPFilterNode("z:row").each(function () {
            
		        camlQuery += "<Method ID='"+ id +"' Cmd='Delete'>" +
				            "<Field Name='ID'>" + $(this).attr("ows_ID") + "</Field>" +
				            "</Method>";
				id++;
            });

            camlQuery += "</Batch>";
			 
			$().SPServices({
			    operation: "UpdateListItems",
			    async: false,
			    listName: list,
			    updates: camlQuery,
			    completefunc: function (xData, Status) {
			        for (var index = 0; index < StratusFormsChildListData.length; index++)
		            {
		            	var valuePairs = StratusFormsChildListData[index].valuePairs;
		            	valuePairs.push([parentList, parentID]);
		            	StratusFormsChildListData[index].valuePairs = valuePairs;
		            	
		        	    $().StratusFormsGetChild(parentList,parentID,StratusFormsChildListData[index]);
		        	    
		            }
				
				}
			});

        }
    });

}


$.fn.StratusFormsAddUserToPeoplePicker = function (options) {
    var opt = $.extend({}, {
        allowMultipleValues: true,
        maximumEntitySuggestions: 15
    }, options);
    var $this = this;

    var $this = this;


    var spPP = SPClientPeoplePicker.SPClientPeoplePickerDict[$(this).attr("id") + "_TopSpan"];

    var people = spPP.GetAllUserInfo();
    var peopleArray = new Array();

    for (var index in people) {
        peopleArray.push(people[index].Description);
        peopleArray.push(people[index].DisplayText);
    }

    peopleArray.push(opt.email);
    peopleArray.push(opt.name);
    $($this).StratusFormsPeoplePicker({ people: peopleArray });

};

$.fn.StratusFormsAddCurrentUserToPeoplePicker = function (userid) {
    var $this = this;


    var spPP = SPClientPeoplePicker.SPClientPeoplePickerDict[$(this).attr("id") + "_TopSpan"];

    var people = spPP.GetAllUserInfo();
    var peopleArray = new Array();

    for (var index in people) {
        peopleArray.push(people[index].Description);
        peopleArray.push(people[index].DisplayText);
    }

	if (userid == undefined)
    	userid = _spPageContextInfo.userId;

    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + userid + ")";

    var requestHeaders = { "accept": "application/json;odata=verbose" };

    $.ajax({
        url: requestUri,
        contentType: "application/json;odata=verbose",
        headers: requestHeaders,
        success: onSuccess,
        error: onError
    });

    function onSuccess(data, request) {
        var name = data.d.Title;
        var email = data.d.Email;

        peopleArray.push(email);
        peopleArray.push(name);
        $($this).StratusFormsPeoplePicker({ people: peopleArray });

    }

    function onError(error) {
        alert(error);
    }

};

function GetUserEmail(emailOrID,name)
{
       var defer = $.Deferred();
       
        if ($.isNumeric(emailOrID))
        {
		    var requestUri = _spPageContextInfo.webAbsoluteUrl + "/_api/web/getuserbyid(" + emailOrID + ")";
		
		    var requestHeaders = { "accept": "application/json;odata=verbose" };
		
		    $.ajax({
		        url: requestUri,
		        contentType: "application/json;odata=verbose",
		        headers: requestHeaders,
		        success: onSuccess,
		        error: onError
		    });
		
		    function onSuccess(data, request) {
		        defer.resolve(data.d.Email,name);
		    }
		
		    function onError(error) {
		        defer.resolve(null);
		    }
        }
        else
        {
	        defer.resolve(emailOrID,name);

        }
        
    	return defer.promise();
}

$.fn.StratusFormsGetPeopleFromPeoplePicker = function (element) {
    var spPP = SPClientPeoplePicker.SPClientPeoplePickerDict[$(element).attr("id") + "_TopSpan"];

    var people = spPP.GetAllUserInfo();

    return people;
}

//Converts People Pickers
$.fn.StratusFormsPeoplePicker = function (options) {
    var opt = $.extend({}, {
        allowMultipleValues: true,
        maximumEntitySuggestions: 15
    }, options);
    var $this = this;

    // Create a schema to store picker properties, and set the properties.
    var schema = {};
    schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = opt.allowMultipleValues;
    schema['MaximumEntitySuggestions'] = opt.maximumEntitySuggestions;
    schema['Width'] = ($($this).width() * 1 - 25) + "px";

    var users = new Array();
    
    var peoplePicker = $(this).attr("ID");

    if (opt.people != undefined) {
		var count = opt.people.length;
        for (var index = 0; index < opt.people.length; index += 2) {
       		var idOrEmail = opt.people[index];
       		var name = opt.people[index+1]; 	
	       var call = GetUserEmail(idOrEmail,name);
		   call.done(function(email,name){
				var user = new Object();
	            user.AutoFillDisplayText = name;
	            user.AutoFillKey = email;
	            user.Description = email;
	            user.DisplayText = name;
	            user.EntityType = "User";
	            user.IsResolved = true;
	            //				user.Key = user.get_loginName();  
	            user.Resolved = true;
	
	            users.push(user);
	            count -= 2;
	            if (count == 0)
	            {
				    // Render and initialize the picker. 
				    // Pass the ID of the DOM element that contains the picker, an array of initial
				    // PickerEntity objects to set the picker value, and a schema that defines
				    // picker properties.
				    SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePicker, users, schema);
	            }
				
			});
        }
       
    } else {
	    // Render and initialize the picker. 
	    // Pass the ID of the DOM element that contains the picker, an array of initial
	    // PickerEntity objects to set the picker value, and a schema that defines
	    // picker properties.
	    SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePicker, users, schema);
    }
};


$.fn.StratusFormsUploadFile =  function (file,libraryName,id,fieldName) {


  var defer = $.Deferred();
    
  
       var digest = jQuery("#__REQUESTDIGEST").val();
       var webUrl = _spPageContextInfo.webAbsoluteUrl;
  
       var reader = new FileReader();
       var arrayBuffer;
 
         reader.onload = function (e) {
             arrayBuffer = reader.result;
  
             var url = webUrl + "/_api/web/lists/getByTitle(@TargetLibrary)/RootFolder/files/add(url=@TargetFileName,overwrite='false')?$expand=ListItemAllFields&" +
                "@TargetLibrary='" + libraryName + "'" +
                "&@TargetFileName='" + file.name + "'";
  
             var call = jQuery.ajax({
            url: url,
           type: "POST",
           data: arrayBuffer,
         headers: {
                 "Accept": "application/json; odata=verbose",
                 "X-RequestDigest": digest
                 },    
	     contentType: "application/json;odata=verbose",
	     processData: false
	    });  
	    
	    call.done(function (data, textStatus, jqXHR) {
				var StratusFormsValuePairs = new Array();
				StratusFormsValuePairs.push([fieldName, id])
				var updateCall = $().StratusFormsSaveForm(libraryName, data.d.ListItemAllFields.Id, StratusFormsValuePairs, null,new Array(),new Array());
	     		updateCall.done(function (data, textStatus, jqXHR) {
		           defer.resolve(1);
	     		});
	     		updateCall.fail(function (data, textStatus, jqXHR) {
		           defer.resolve(1);
	     		});
	    });
          call.fail(function (jqXHR, textStatus, errorThrown) {
             alert("Error Uploading Document. Ensure the file doesn't already exist: " + errorThrown);
             defer.resolve(1);
          });
    
        };
        reader.readAsArrayBuffer(file);
       
//       defer.resolve(0);
       
       return defer.promise();


 };

$.fn.StratusFormsDeleteFile = function(libraryName,id)
{
    var call = jQuery.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/getByTitle('"+libraryName+"')/Items(" +
                id + ")",
            type: "POST",
            headers: {
                Accept: "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "IF-MATCH": "*",
                "X-Http-Method": "DELETE"
            }
        });
      call.done(function (data, textStatus, jqXHR) {
	    });
          call.fail(function (jqXHR, textStatus, errorThrown) {
             alert("Error Deleting File. " + errorThrown);
             defer.resolve(1);
          });        

}

$.fn.StratusFormsLoadFiles = function (libraryName, fieldName, id, ul) {
    var query = "<Query>" +
                    "<Where>" +
	                    "<Eq>" +
	                        "<FieldRef Name='" + fieldName + "' LookupId='TRUE'/><Value Type='Lookup'>" + id + "</Value>" +
//	                        "<FieldRef Name='ID'/><Value Type='Integer'>0</Value>" +
	                    "</Eq>" +
                    "</Where>" +
                "</Query>";

    //The Web Service method we are calling, to read list items we use 'GetListItems'
    var method = "GetListItems";
    var fieldsToRead = "<ViewFields>" +
                            "<FieldRef Name='FileLeafRef' />" +
                        "</ViewFields>";

    //Here is our SPServices Call where we pass in the variables that we set above
    $().SPServices({
        operation: method,
        async: false,  //if you set this to true, you may get faster performance, but your order may not be accurate.
        listName: libraryName,
        CAMLViewFields: fieldsToRead,
        CAMLQuery: query,
        //this basically means "do the following code when the call is complete"
        completefunc: function (xData, Status) {

			var files="";
            $(xData.responseXML).SPFilterNode("z:row").each(function () {

                var file  = ($(this).attr("ows_FileLeafRef").split(";#")[1]);
                var path  = ($(this).attr("ows_FileRef").split(";#")[1]);
				files += "<li libraryName='"+libraryName+"' id='"+$(this).attr("ows_ID")+"'><a href='/"+path+"'>"+file+"</a> <span class='SFRemoveFile' onclick='$().StratusFormsRemoveFile(this);'>(remove)</span><img width='75px' src='/"+path+"'></li>";

            });
            $("#"+ul).append(files);

        }
    });
}

