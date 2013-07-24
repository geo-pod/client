<?php

class Controller_Permalink {

    private $permalink;

    public function __construct($param) {
        $layers = explode(";", $param['layers']);
        $layersName = explode(";", $param['lName']);

        if (array_key_exists("key", $param)) {
            $this->permalink = new Model_Permalink($param['lon'], $param['lat'], $param['zoom'], $layers, $layersName, $param['key']);
        } else {
            $this->permalink = new Model_Permalink($param['lon'], $param['lat'], $param['zoom'], $layers, $layersName);
        }
    }

    public function getPermalink() {
        return $this->permalink->getUrl();
    }

    public function checkPermalink() {
        return $this->permalink->checkUrl();
    }

}

?>
