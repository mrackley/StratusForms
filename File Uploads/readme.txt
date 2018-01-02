1. Create a document library to store your files
2. Within that document library create a lookup field that is a lookup to your StratusForms list
3. In your HTML for your StratusForms form, place the following HTML where you want the file upload to be on the form:

<div class="SFDontSave" id="files" data-StratusFormsType="File" data-StratusFormsFileOptions="{libraryName:'<name of document library>', lookupField:'<internal name of lookup field in document library>', displayOnly:false}"></div>

one important note: I'm using REST for the file upload, so the functionality only works in SharePoint 2013, 2016, and SharePoint Online.

example coming soon
