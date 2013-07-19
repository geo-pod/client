<?php

define('APPLICATION_PATH', dirname(__FILE__) . '/../data/');
set_include_path(get_include_path() . PATH_SEPARATOR . APPLICATION_PATH);

// Autoload
function gp_autoloader($class) {
    $classPath = str_replace('_', '/', $class) . '.php';
    if (file_exists(APPLICATION_PATH . $classPath)) {
        require_once $classPath;
    } else {
        throw new Exception("Wrong class name");
    }
}

spl_autoload_register('gp_autoloader');

$action = isset($_GET['a']) ? $_GET['a'] : null;
$options = isset($_GET['o']) ? json_decode($_GET['o'], true) : null;

$parameters = array(
    'action' => $action,
);

if (is_array($options)) {
    foreach ($options as $key => $value) {
        $parameters[$key] = $value;
    }
}

$instance = Controller_AjaxDispatcher::getInstance();
$call = $instance->dispatch($parameters);
echo $call;
?>
