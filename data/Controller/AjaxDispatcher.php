<?php

class Controller_AjaxDispatcher {

    private static $instance;
    private $action;

    private function __construct() {
        
    }

    public static function getInstance() {
        if (!isset(self::$instance)) {
            $className = __CLASS__;
            self::$instance = new $className;
        }
        return self::$instance;
    }

    public function dispatch($parameters = null) {
        if (!isset($parameters['action']) && !is_array($parameters)) {
            return;
        }
        $this->action = $parameters['action'];

        switch ($this->action) {
            case "getLastAction":
                return $this->getLastAction();
                break;

            case "getConfig":
                if (array_key_exists("key", $parameters) && $parameters['key'] != null) {
                    return $this->getConfig($parameters['key']);
                }
                break;

            case "getWmsUrl":
                return $this->getWmsUrl();
                break;

            case "getCapabilities":
                if (array_key_exists("schema", $parameters) && $parameters['schema'] != null) {
                    return $this->getCapabilities($parameters['schema']);
                }
                break;
                
            case "useApps":
                if (array_key_exists("lon", $parameters) && array_key_exists("lat", $parameters) && array_key_exists("layers", $parameters)) {
                    return $this->getInfoFeature($parameters);
                }
                break;

            default:
                break;
        }
    }

    private function getConfig($keys) {
        $controller = new Controller_Config();
        $configs = array();
        foreach ($keys as $key => $value) {
            $configs[$value] = $controller->getConfig($value);
        }
        return json_encode($configs);
        ;
    }

    private function getLastAction() {
        return $this->action;
    }

    private function getCapabilities($schema) {
        $controller_conf = new Controller_Config();
        $param = array(
            "server" => $controller_conf->getConfig("MC_WMS"),
            "account" => $controller_conf->getConfig("MC_USER"),
            "schema" => $schema,
            "version" => "1.1.1",
        );
        $controller_gc = new Controller_GetCapabilities($param);
        return json_encode($controller_gc->getCapabilities());
    }

    private function getWmsUrl() {
        $controller = new Controller_Config();
        $url = $controller->getConfig("MC_WMS") . $controller->getConfig("MC_USER") . "/";
        return json_encode($url);
    }
    
    private function getInfoFeature($param) {
        $controller_conf = new Controller_Config();
        $param['url'] = $controller_conf->getConfig("MC_APP_INFO_FEATURE");
        $param['account'] = $controller_conf->getConfig("MC_USER");
        $apps = new Controller_Apps($param);
        return json_encode($apps->getInfoFeature());
    }
}

?>
