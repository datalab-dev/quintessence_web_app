function get_ldapca() {

    ldapca = [];
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_ldapca.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send();

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    ldapca = JSON.parse(xmlHttp.responseText);
	}// if success
    }//response recieved
    return ldapca;
}//get_topic_terms
