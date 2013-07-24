<?php

class Model_Permalink {

    private $lon;
    private $lat;
    private $zoom;
    private $layers;
    private $layersName;
    private $key;

    public function __construct($lon, $lat, $zoom, $layers, $layersName, $key = null) {
        if (!is_array($layers)) { //and others checks....
            return;
        }
        $this->lat = $lat;
        $this->lon = $lon;
        $this->zoom = $zoom;
        $this->layers = $layers;
        $this->layersName = $layersName;
        $this->key = $key;
    }

    public function getUrl() {
        $key = $this->generateKey();
        $url = null;
        if ($key != null) {
            $url = "?action=permalink&z=" . $this->zoom . "&lat=" . $this->lat . "&lon=" . $this->lon . "&layers=" . implode(";", $this->layers) . "&lName=" . urlencode(implode(";", $this->layersName)) . "&k=" . $key;
        }
        return $url;
    }

    private function generateKey() {
        $tmp = null;
        foreach ($this->layers as $key => $value) {
            $tmp = $tmp . $key . $value . "gp2013";
        }
        foreach ($this->layersName as $key => $value) {
            $tmp = $tmp . $key . $value . "gp2013";
        }
        return md5($tmp);
    }

    public function checkUrl() {
        $isValid = false;
        if ($this->key != null) {
            $generatedKey = $this->generateKey();
            if ($this->key == $generatedKey) {
                $isValid = true;
            }
        }
        return $isValid;
    }

}

?>
