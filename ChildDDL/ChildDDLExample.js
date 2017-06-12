<link  type="text/css" rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/themes/start/jquery-ui.css" /> 
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script> 
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js"></script> 
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery.SPServices/0.7.2/jquery.SPServices-0.7.2.min.js"></script> 

<script type="text/javascript" src="../SiteAssets/stratus-forms-1.4.js?rev=3"></script>
<script type="text/javascript" src="../SiteAssets/stratus-forms-data-SPServices-1.4.js"></script>

<link  type="text/css" rel="stylesheet" href="../SiteAssets/ChildDDL/ChildDDLExample.css" /> 

<!-- NEEDED FOR THE PEOPLE PICKER IN SHAREPOINT 2013. PEOPLE PICKER DOES NOT WORK IN SHAREPOINT 2010 -->
<script type="text/javascript" src="/_layouts/15/clientforms.js" ></script> 
<script type="text/javascript" src="/_layouts/15/clientpeoplepicker.js" ></script> 
<script type="text/javascript" src="/_layouts/15/autofill.js" ></script> 
<!----------------------------------------------------------------------------------------------------->

<div id="SFForm">
</div>

<script type="text/javascript">

	function SubmitForm()
	{
		
		$("#SFForm").StratusFormsSubmit({
	     	listName: "Timesheet",
        	completefunc: function(id) { 
  				alert("Save was successful. ID = " + id);
	  			window.location = window.location.pathname + "?formID=" + id; 
			}
    	});
	}

	ExecuteOrDelayUntilScriptLoaded(Init,"SP.js");

    function Init()
    {
		$("#SFForm").StratusFormsInitialize({
	          htmlForm: "../SiteAssets/ChildDDL/ChildDDLExample.html",
			  queryStringVar: "formID",
	          listName: "Timesheet",
	          completefunc: function()
	          {
		          	$( "#weekEnding" ).datepicker({
			            changeMonth: true,
			            changeYear: true
			        });
	          }
		});
	}

	function DoChildDDL(id)
	{
		$("#subProject").StratusFormsLoadChildDDL({
            parentID: id, //ID parent item
            parentField: "Project", //internal name of parent field on child list
            listName: "SubProjects", //child list name
            firstOptionText: "Please Select",
            fieldName: "Title", //field in child list to show in drop down
            orderByField: "Title" //which field to orderby on the child list
		});
	}

</script>
