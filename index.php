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
