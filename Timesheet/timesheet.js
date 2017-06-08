
ExecuteOrDelayUntilScriptLoaded(Init,"SP.js");

	 function Init(){

	     //Initialization function. Tells SF which Query String Variable
	     //has the ID of the form, and the name of the list to read data from
	     $("#timesheetDiv").StratusFormsInitialize({
	     	queryStringVar: "formID",
	     	listName: "Timesheet",
	     	completefunc: function() { 
				SumHours();
			}

	     });
	     
	     
 		$( "#weekEnding" ).datepicker({
	            changeMonth: true,
	            changeYear: true
        });


		$("div.ms-cui-tabContainer").hide();

	 }
	 
	function SubmitForm()
	{
		//When the form is submitted store it to the specified list
		//also pasas in the x and y offset of error messages for elements
		//this allows you to change their location in reference to the form field
		$("#timesheetDiv").StratusFormsSubmit({
	     	listName: "Timesheet",
	     	errorOffsetTop: 0,
	     	errorOffsetLeft: 5,
            completefunc: function(id) { 
				alert("Save was successful. ID = " + id);
				window.location = window.location.pathname + "?formID=" + id; 
			}
	     });

	}
		
	function SumHours()
	{
	    var total=0;
		$("input.hours").each(function()
		{
			total+= ($(this).val()*1);
		});
		$("#Total").html(total);
	}
	
	function RemoveRow(cell)
	{
		SumHours();
	}
	
	