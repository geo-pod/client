<?php

class Controller_GetCapabilities {

    private $getCapabilities;
    private $xml;

    public function __construct($param = null) {
        if (!is_array($param)) {
            return;
        }
        $this->getCapabilities = new Model_GetCapabilities($param["server"], $param["account"], $param["schema"], $param["version"]);
    }

    public function getCapabilities() {
        $this->xml = $this->getCapabilities->getCapabilities();
        return $this->xml;
    }

}

?>
