<?php

class Model_Feature {

    var $type;
    var $geometry;
    var $properties;

    public function __construct($geom, $properties = null) {
        if (!is_array($properties)) {
            return;
        }
        $this->type = "Feature";
        $this->geometry = $geom;
        $this->properties = $properties;
    }

}

?>
