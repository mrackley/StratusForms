	$(document).ready(function() {
	     
	     //Initialization function. Tells SF which Query String Variable
	     //has the ID of the form, and the name of the list to read data from
	     $("#minimal").StratusFormsInitialize({
	     	queryStringVar: "formID",
	     	listName: "minimal",
	     	completefunc: function() { 
			}

	     });
	});
	     
	function SubmitForm()
	{
		//When the form is submitted store it to the specified list
		//also passes in the x and y offset of error messages for elements
		//this allows you to change their location in reference to the form field
		$("#minimal").StratusFormsSubmit({
	     	listName: "minimal",
	     	errorOffsetTop: 10,
	     	errorOffsetLeft: 5,
            completefunc: function(id) { 
				alert("Save was successful. ID = " + id);
				window.location = window.location.pathname + "?formID=" + id; 
			}
	     });
	}