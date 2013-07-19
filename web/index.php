<?php
ini_set('include_path', "C:\wamp\bin\php\php5.4.3\pear". ini_get("include_path"));
error_reporting(E_ERROR | E_WARNING | E_PARSE | E_NOTICE);
define('APPLICATION_PATH', dirname(__FILE__) . '/../data/');
set_include_path(get_include_path() . PATH_SEPARATOR . APPLICATION_PATH);

// Autoload
spl_autoload_register();
function gp_autoloader($class) {
    $classPath = str_replace('_', '/', $class) . '.php';
    if (file_exists(APPLICATION_PATH . $classPath)) {
        require_once $classPath;
    }
}
spl_autoload_register('gp_autoloader');


$myGeoPod = new Controller_Geopod();
$myGeoPod->main();

//try {
//    $myGeoPod = new geopod();
//    $myGeoPod->main();
//} catch (Exception $e) {
//    echo "<pre>";
//    preint_r($e->getMessage());
//}
?>