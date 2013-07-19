<?php

class Controller_Config {

    private $_configurations;

    public function __construct() {
        $instance = Model_Config::getInstance();
        $this->_configurations = $instance->getConfigs();
    }

    public function getConfig($key) {
        $config = null;
        if ($key != null) {
            if (array_key_exists($key, $this->_configurations)) {
                $config = $this->_configurations[$key];
            }
        }
        return $config;
    }
}

?>
