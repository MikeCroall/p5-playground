<!-- Originally created by Mike Croall https://github.com/MikeCroall/p5-playground -->
<html>
    <head>
        <title>p5-playground</title>
        <style>
            html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #333;
                font-family: arial;
            }
            a {
                font-size: 2em;
                text-decoration: none;
                color: #888;
            }
            a:hover {
                text-decoration: underline;
            }
            ul {
                list-style: none;
                padding: 0;
            }
            li {
                padding-top: 5px;
                padding-bottom: 5px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <a href="https://github.com/MikeCroall/p5-playground"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/52760788cde945287fbb584134c4cbc2bc36f904/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f77686974655f6666666666662e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_white_ffffff.png"></a>
        <?php

            $files = array(
                'bounce',
                'noughts_and_crosses',
		'graphs'
            );

            echo "<ul>";
            foreach ($files as &$file) {
                echo "<li><a href='$file/'>".str_replace('_', ' ', $file)."</a></li>";
            }
            echo "</ul>";

        ?>
    </body>
</html>
