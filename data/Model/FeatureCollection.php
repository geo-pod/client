<?php

class Model_FeatureCollection {

    var $type;
    var $features;

    public function __construct() {
        $this->type = "FeatureCollection";
        $this->features = array();
    }

    function addFeature($feature) {
        array_push($this->features, $feature);
    }

}

?>
