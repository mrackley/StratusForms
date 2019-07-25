<script type="text/javascript" src="//code.jquery.com/jquery-1.11.1.min.js"></script>

<!-- References to Office UI Fabric -->
<link rel="stylesheet" href="//appsforoffice.microsoft.com/fabric/1.0/fabric.min.css">
<link rel="stylesheet" href="//appsforoffice.microsoft.com/fabric/1.0/fabric.components.min.css">

<!-- Callout div -->
<div class="ms-Callout ms-Callout--arrowLeft" id="callout" style="display:none">
     <div class="ms-Callout-main">
          <div class="ms-Callout-header">
               <p class="ms-Callout-title">Callout Left Arrow  <i class="ms-Icon ms-Icon--x" onclick="$('#callout').fadeOut();"></i></p>
          </div>
          <div class="ms-Callout-inner">
               <div class="ms-Callout-content">
                    <p class="ms-Callout-subText ms-Callout-subText--s" id="calloutContent"></p>
               </div>
          </div> 
     </div>
</div>

<!-- Responsive Grid -->
<div id='issueGrid' class="ms-Grid">
	<div class="ms-Grid-row ms-font-l ms-fontColor-blue">
		<span class="ms-Grid-col ms-u-sm1"></span>	
		<span class="ms-Grid-col ms-u-sm3">Title</span>
		<span class="ms-Grid-col ms-u-sm2">Assigned To</span>
		<span class="ms-Grid-col ms-u-sm2">Priority</span>
		<span class="ms-Grid-col ms-u-sm2">Status</span>
		<span class="ms-Grid-col ms-u-sm2">Due Date</span>
	</div>
</div>

<script type="text/javascript">

		var call = $.ajax({
    		url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('Issues')/items?$select=Id,Title,AssignedTo/Title,Status,Priority,DueDate&$expand=AssignedTo",
    		type: "GET",
    		dataType: "json",
    		headers: {
    			Accept: "application/json;odata=nometadata"
    		}
   	
    	});
    	call.done(function (data,textStatus, jqXHR){
				//add issus to issueGrid using results of REST query
				rows = '';
				for (index in data.value)
				{
					rows += '<div class="ms-Grid-row">';
					rows += '<span class="ms-Grid-col ms-u-sm1"><i class="ms-font-xl ms-fontColor-alert ms-Icon ms-Icon--infoCircle" onclick="GetInfo(this,'+data.value[index].ID+')"/></span>';
					rows += '<span class="ms-Grid-col ms-u-sm3">'+data.value[index].Title+'</span>';
					rows += '<span class="ms-Grid-col ms-u-sm2">'+data.value[index].AssignedTo.Title+'</span>';
					rows += '<span class="ms-Grid-col ms-u-sm2">'+data.value[index].Status+'</span>';
					rows += '<span class="ms-Grid-col ms-u-sm2">'+data.value[index].Priority+'</span>';
					rows += '<span class="ms-Grid-col ms-u-sm2">'+data.value[index].DueDate+'</span>';
					
					rows += '</div>';
				}
				$("#issueGrid").append(rows);

    		});
    	
    	call.fail(function (jqXHR,textStatus,errorThrown){
    		alert("Error retrieving Tasks: " + jqXHR.responseText);
    	});

function GetInfo(element,id)
{
		//get information for specific issue (Id of clicked on Isse in grid)
		var call = $.ajax({
    		url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('Issues')/items?$select=Id,Title,AssignedTo/Title,Status,Priority,DueDate&$expand=AssignedTo&$filter=(ID eq "+id+")",
    		type: "GET",
    		dataType: "json",
    		headers: {
    			Accept: "application/json;odata=nometadata"
    		}
   	
    	});
    	call.done(function (data,textStatus, jqXHR){
			
			$("#calloutContent").empty();
			//build Table with results of REST Query
			var content = '<div class="ms-Table">';
			content += '<div class="ms-Table-row"><span class="ms-Table-cell">TITLE:</span><span class="ms-Table-cell">'+data.value[0].Title+"</span></div>";
			content += '<div class="ms-Table-row"><span class="ms-Table-cell">ASSIGNED TO:</span><span class="ms-Table-cell">'+data.value[0].AssignedTo.Title+"</span></div>";
			content += '<div class="ms-Table-row"><span class="ms-Table-cell">STATUS:</span><span class="ms-Table-cell">'+data.value[0].Status+"</span></div>";
			content += '<div class="ms-Table-row"><span class="ms-Table-cell">PRIORITY:</span><span class="ms-Table-cell">'+data.value[0].Priority+"</span></div>";
			content += '<div class="ms-Table-row"><span class="ms-Table-cell">DUE DATE:</span><span class="ms-Table-cell">'+data.value[0].DueDate+"</span></div>";
			content += '</div>'
			
			$("#calloutContent").append(content);
			
			//place callout after icon to positioning
			$(element).after($("#callout"));
			
			//get position of the icon clicked on
			var pos = $(element).position();
		
		    //position the callout correctly over the icon 
			//tweaking numbers to get it correct
		    $("#callout").css({
		        position: "absolute",
		        top: pos.top - 55,
		        left: (pos.left) + 10
		    });
		    
			//show the callout
			$("#callout").fadeIn();

    	});
    	
    	call.fail(function (jqXHR,textStatus,errorThrown){
    		alert("Error retrieving Tasks: " + jqXHR.responseText);
    	});
}

</script>