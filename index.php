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
            }
        </style>
    </head>
    <body>
        <?php

            $files = array(
                'bounce'
            );

            foreach ($files as &$file) {
                echo "<a href='$file.html'>$file</a>";
            }

        ?>
    </body>
</html>
