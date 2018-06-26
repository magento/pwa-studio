---
title: Application Shell
---

The Magento PWA Studio uses application shell architecture to quickly load pages on mobile apps.

This Approach involves heavily caching the minimal amount of HTML, CSS and JS to load the basic UI of the page. Then pulling in the rest of the content through an API. 

Because the majority of the page is cached, it will load almost instantly on repeat visits. It also prevents unnecessary data usage as it removes the need to download any static content more than once.

``` html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" type="text/css" href="assets/css/shell.css">
    <title>Document</title>
</head>

<body>
    <header>
        <h1>App Shell</h1>
    </header>

    <div class="nav">
    
    </div>

    <div class="content">

    </div>

    <div class="spinner">

    </div>


    <script>
        if (process.env.SERVICE_WORKER && 'serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register(process.env.SERVICE_WORKER)
                    .then(registration => {
                        console.log('Service worker registered: ', registration);
                    })
                    .catch(error => {
                        console.log('Service worker registration failed: ', error);
                    });
            });
        }
    </script>
</body>
</html>

```

{% include content-not-available.md issue=8 %}
