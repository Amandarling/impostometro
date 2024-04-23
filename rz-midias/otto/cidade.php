<?php

//  Initiate curl
$url = "https://impostometro.com.br/Contador/Municipios?estado=sc&municipio=brusque&ano=".date('Y', time());

$ch = curl_init();
// Will return the response, if false it print the response
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Set the url
curl_setopt($ch, CURLOPT_URL,$url);

$headers = [
    'Accept: application/json',
    'X-Requested-With: XMLHttpRequest'
];

curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
// Execute
$result=curl_exec($ch);
// Closing

echo curl_error($ch);
curl_close($ch);

// Will dump a beauty json :3
echo $result;