<?php

header('Content-Type: application/json');

$links = [
    'https://www.gettyimages.ca/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg',
    'https://demo.phpgang.com/crop-images/demo_files/pool.jpg',
    'https://amazingcarousel.com/wp-content/uploads/amazingcarousel/4/images/lightbox/golden-wheat-field-lightbox.jpg',
    'http://diarioveaonline.com/wp-content/uploads/2018/01/adorable-image-for-desktop-wallpaper-9.jpg',
    'http://efekt-dieta.info/cdn/images/natural-image/natural-image-08.jpg',
];

$responce = [
    'link' => $links[rand(0, 4)]
];

echo json_encode( $responce );

