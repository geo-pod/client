<?php

class Model_GetCapabilities {

    private $account;
    private $schema;
    private $server;
    private $url;
    private $version;

    public function __construct($server, $account, $schema, $version) {
        $this->server = $server;
        $this->account = $account;
        $this->schema = $schema;
        $this->version = $version;

        $this->url = $server . "/" . $account . "/" . $schema . "/?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=" . $version;
    }

    public function getAccount() {
        return $this->account;
    }

    public function getSchema() {
        return $this->schema;
    }

    public function getServer() {
        return $this->server;
    }

    public function getUrl() {
        return $this->url;
    }

    public function getVersion() {
        return $this->version;
    }

    public function getCapabilities() {
        // create curl resource
        $ch = curl_init();
        // set url
        curl_setopt($ch, CURLOPT_URL, $this->url);
        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // $output contains the output string
        $wms = curl_exec($ch);
        // close curl resource to free up system resources
        curl_close($ch);
        
        $wms = mb_convert_encoding($wms, "UTF-8", mb_detect_encoding($wms));
        $xml = new SimpleXMLElement($wms);
        return $xml;
    }

}

?>
