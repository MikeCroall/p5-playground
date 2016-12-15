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
            }
            a {
                font-size: 2em;
                text-decoration: none;
            }
            ul {
                list-style: none;
            }
        </style>
    </head>
    <body>
        <?php

            $files = array(
                'bounce',
                'naughts_and_crosses'
            );
            
            echo "<ul>";
            foreach ($files as &$file) {
                echo "<li><a href='$file.html'>".str_replace('_', ' ', $file)."</a></li>";
            }
            echo "</ul>";
        
        ?>
    </body>
</html>
