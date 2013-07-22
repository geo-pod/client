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
        header('Content-Type: text/plain; charset="ISO-8859-1"');
        // create curl resource
        $ch = curl_init();
        // set url
        curl_setopt($ch, CURLOPT_URL, $this->url);
        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLINFO_HEADER_OUT, true);        
        curl_setopt($ch, CURLOPT_HTTPHEADER, Array('Content-Type: text/plain; charset=ISO-8859-1'));
        // $output contains the output string
        $wms = curl_exec($ch);
        curl_close($ch);
        $wms = json_encode($wms);
        $wms = preg_replace('/\\\u([0-9a-z]{4})/', '&#x$1;', $wms);
        $xml = new SimpleXMLElement(json_decode($wms));
        // close curl resource to free up system resources
        return $xml;
    }

}

?>
