<?php
$gender = ($_POST['gender']);
$firstname = ($_POST['firstname']);
$lastname = ($_POST['lastname']);
$email = ($_POST['email']);
$dayofbirth = ($_POST['dayofbirth']);
$monthofbirth = ($_POST['monthofbirth']);
$yearofbirth = ($_POST['yearofbirth']);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>POST</title>
</head>
<body>
    <h2>Gender: <span class="text"><?=$gender?></span></h2>
    <h2>Firstname: <span class="text"><?=$firstname?></span></h2>
    <h2>Lastname: <span class="text"><?=$lastname?></span></h2>
    <h2>Email: <span class="text"><?=$email?></span></h2>
    <h2>Day of birth: <span class="text"><?=$dayofbirth?></span></h2>
    <h2>Month of birth: <span class="text"><?=$monthofbirth?></span></h2>
    <h2>Year of birth: <span class="text"><?=$yearofbirth?></span></h2>
</body>
<style>
    .text{
        color: blue;
    }
</style>
</html>