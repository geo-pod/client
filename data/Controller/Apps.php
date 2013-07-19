<?php

class Controller_Apps {

    private $app;
    private $lon;
    private $lat;
    private $layers;
    private $extent;
    private $info;

    public function __construct($param = null) {
        if (!is_array($param)) {
            return;
        }
        $this->app = new Model_Apps($param["url"], $param["account"]);
        $this->lon = $param["lon"];
        $this->lat = $param["lat"];
        $this->layers = $param["layers"];
        $this->extent = $param["extent"];
    }

    public function getInfoFeature() {
        $ext = $this->extent['left'] . "," . $this->extent['bottom'] . "," . $this->extent['right'] . "," . $this->extent['top'];
        $this->info = $this->app->getInfoFeature($this->lon, $this->lat, $this->layers, $ext);
        return $this->info;
    }

}

?>
