<?php

class Model_Config {

    private static $instance;
    private $configurations = array();

    private function __construct() {
        $ini = parse_ini_file('../data/config/config.ini');
        foreach ($ini as $key => $val) {
            $this->configurations[$key] = $val;
        }
    }

    public static function getInstance() {
        if (!isset(self::$instance)) {
            $className = __CLASS__;
            self::$instance = new $className;
        }
        return self::$instance;
    }

    public function getConfigs() {
        return $this->configurations;
    }

}

?>
