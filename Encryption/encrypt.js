	$(document).ready(function() {
	     
	     //Initialization function. Tells StratusForms which Query String Variable
	     //has the ID of the form, and the name of the list to read data from
	     $("#secure").StratusFormsInitialize({
	     	queryStringVar: "formID",
	     	listName: "Secure",
	     	completefunc: function() { 
			}

	     });
	     
	 });
	 

	function SubmitForm()
	{
		//When the form is submitted store it to the specified list
		//also passes in the x and y offset of error messages for elements
		//this allows you to change their location in reference to the form field
		$("#secure").StratusFormsSubmit({
	     	listName: "Secure",
	     	errorOffsetTop: 10,
	     	errorOffsetLeft: 5,
            completefunc: function(id) { 
				alert("Save was successful. ID = " + id);
				window.location = window.location.pathname + "?formID=" + id; 
			}
	     });

	}
		
	//For encryption to work you can use any encryption library you like
	//and then override the Decrypt and Encrypt functions as below so
	//that the encryption and decryption is done by your encryption library
	$.fn.StratusFormsDecrypt = function(formString,key)
	 {
	     result = CryptoJS.AES.decrypt(formString, key).toString(CryptoJS.enc.Utf8);
	 	     return result;
	 }
	 $.fn. StratusFormsEncrypt = function(formString,key)
	 {
	      result = CryptoJS.AES.encrypt(formString, key);
	 	     return result;
	 }
