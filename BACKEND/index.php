<?php
use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Firebase\JWT\JWT;

require_once '../vendor/autoload.php';

require_once './clases/AccesoDatos.php';
require_once './clases/usuario.php';
require_once './clases/auto.php';
require_once './clases/mw.php';

$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

$app = new \Slim\App(["settings" => $config]);


$app->post('/usuarios', \Usuario::class . ':AltaUsuario')->add(\MW::class . '::VerificarBDCorreo')->add(\MW::class . '::VerificarVacioCorreoClave')->add(\MW::class . ':VerificarSetCorreoClave');

$app->get('[/]', \Usuario::class . ':ListaUsuario');

$app->post('[/]', \Auto::class . ':AltaAuto')->add(\MW::class . '::VerificarRango');

$app->get('/autos', \Auto::class . ':ListaAuto');

$app->post('/login', \Usuario::class . ':Login')->add(\MW::class . ':VerificarBDCorreoClave')->add(\MW::class . '::VerificarVacioCorreoClave')->add(\MW::class . ':VerificarSetCorreoClave');

$app->get('/login', \Usuario::class . ':VerificarJWT');



$app->delete('[/]', \Auto::class . ':BorrarAuto')->add(\MW::class . '::VerificarPropietario')->add(\MW::class . ':VerificarToken');


$app->put('[/]', \Auto::class . ':ModificarAuto')->add(\MW::class . ':VerificarEncargado')->add(\MW::class . '::VerificarPropietario')->add(\MW::class . ':VerificarToken');

$app->run();


?>