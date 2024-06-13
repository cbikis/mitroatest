<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo e(env('APP_NAME')); ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      <!-- Other head elements -->
    <script>
        window.assetBaseImagePath = "<?php echo e(Vite::asset('resources/images')); ?>";
    </script>
    <?php echo app('Illuminate\Foundation\Vite')('resources/css/app.css'); ?>
    <?php echo app('Illuminate\Foundation\Vite')('resources/js/app.js'); ?>
    <style>
</style>
</head>
<body class="bg-white text-black">
    <div id="app"></div>
</body>
</html>
<?php /**PATH C:\tools\workspace\doatap_project\resources\views/spa.blade.php ENDPATH**/ ?>