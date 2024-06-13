<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ env('APP_NAME') }}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <!-- Other head elements -->
    <script>
        window.assetBaseImagePath = "{{ Vite::asset('resources/images') }}";
    </script>
    @vite('resources/css/app.css')
    @vite('resources/js/app.js')
    <style>
</style>
</head>
<body class="bg-white text-black">
    <div id="app"></div>
</body>
</html>
