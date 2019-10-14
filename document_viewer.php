<!doctype html>
<head>
    <title>Topic Explore</title>
    <link href="https://fonts.googleapis.com/css?family=Libre+Baskerville&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="top_documents.css">
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>

    <div class="nav-wrapper">
	<div class="nav">
	    <div class="links">
		<a href="index.html">Home</a>
		<a href="index.html">Team</a>
		<a href="index.html">References</a>
		<a href="index.html">Data</a>
	    </div>
	    <div class="links">
		<a href="topic.html" class="active">Topics</a>
		<a href="topic.html">Ldaplot </a>
		<a href="topic.html">Word2vec </a>
		<a href="index.html">Corpus</a>
	    </div>
	</div>
    </div>

    <div id="main"> 
	<div id="search_area">
	    Topic: 
	    <input type="text" id="topicid" value=1>
	    <button type="button" onclick="get_topic_terms(); get_topic_documents()"> Search </button>
	</div>

	<div id="topic_terms"> </div>
	<div id="top_docs"> </div>

    </div> <!-- /MAIN -->

    <div class="footer-wrapper"> 
	<div class="nav">
	    <div class="footer-format"> 
		webapp Version 0.1.0 <br>
		database Version 1.0.0 
	    </div>
	    <button onclick="topFunction()" id="top-button" title="Go to top">Top</button>
	    <div class="footer-format"> 
		<a href="index.html">Home</a>
		<a href="index.html">Github</a>
		<a href="index.html">Datalab</a>
	    </div>
	</div>
    </div>
    <script>
	function topFunction() {
	    document.body.scrollTop = 0; // For Safari
	    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	}
    </script>
</body>
