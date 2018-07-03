---
title: Application Shell
contributors:
    - gavin2point0
---

Magento PWA Studio uses an application shell architecture to shorten the time it takes to load a branded experience in the UI instead of a blank page.

This approach involves heavily caching the minimal amount of HTML, CSS and JS to load the basic UI of the page before fetching the rest through an API. 

App shell rendering is instantaneous on repeat visits because the majority of the page is in the cache.
It also prevents unnecessary data usage because it removes the need to download static content more than once.

The following is a simple example of an application shell:

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
