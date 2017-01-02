TIMESHEET EXAMPLE READ ME

THIS EXAMPLE DEMONSTRATES THE FOLLOWING FEATURES:

Date field
PeoplePicker
Repeating Content
Promoting Repeated Content to a child list
Dropdown field lookup from another list
Promoting a lookup field

----------------------------------------------------------

This work is licensed under a Creative Commons Attribution-NonCommercial 3.0 Unported License. 

Do you want to use this product for a personal, internal, or non-profit project? 
Then you can use it for free under the Creative Commons Attribution-NonCommercial 3.0 License. 
http://creativecommons.org/licenses/by-nc/3.0/

All samples are provided as-is with no warranty.

For paid support please contact info@stratusforms.com

-------------------------------------------------------------

Timesheet Form Example Basic Usage:

1) Create a list called "Timesheet" with the following field:
	fieldName: StratusFormsData
	fieldType: multi-line plain text
	
	fieldName: Employee
	fieldType: Person or Group
	
	fieldname: Week
	fieldType: Date and Time
2) Create a list called "Projects" and and some entries to the list
3) Create a list called "Time" (this is the child list for promoting repeated content.)
	fieldnamne: Timesheet
	fieldType: Lookup to the ID field of the Timesheet list

	fieldname: StratusFormsRowID
	fieldType: Single line of text

	fieldname: monday
	fieldType: number

	fieldname: Project
	fieldType: Lookup to Title field in Projects list
	
4) Upload the examples to a SiteAssets library with the same folder structre
5) Create a page in SharePoint
6) Add a Content Editor Web Part to the page
7) Link the Content Editor Web Part to SiteAssets/Timesheet/timesheet.html
8) Ta Da!

For more information visit our web site at www.stratusforms.com
Send an email to info@stratsuforms.com to request access to our Slack Team for support and updatesFor more information visit our web site at www.stratusforms.com or join the discussion on IT Unity at http://www.itunity.com/community/stratusforms