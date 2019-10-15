function get_ldapca() {

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST", "./php/get_ldapca.php", true);
    xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlHttp.send();

    xmlHttp.onreadystatechange = function ()  {
	if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
	    plot_ldapca(JSON.parse(xmlHttp.responseText));
	}// if success
    }//response recieved
}//get_topic_terms
