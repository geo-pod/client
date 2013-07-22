<?php

require_once("../data/includes/libs/simple_html_dom.php");

class Model_Apps {

    const QUERY = "";

    private $account;
    private $key;
    private $appUrl;

    public function __construct($appUrl, $account) {
        $this->appUrl = $appUrl;
        $this->account = $account;
    }

    public function getInfoFeature($lon, $lat, $layers, $extent) {

        $url = $this->appUrl . $this->account . "?proj=900913&lon=" . $lon . "&lat=" . $lat . "&layers=" . $layers . "&extent=" . $extent . "&width=10&height=10";

        // create curl resource
        $ch = curl_init();
        // set url
        curl_setopt($ch, CURLOPT_URL, $url);
        //return the transfer as a string
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // $output contains the output string
        $content = json_decode(curl_exec($ch));
        // close curl resource to free up system resources
        curl_close($ch);

        $html = str_get_html($content->html);
        

        if (empty($html)) {
            $featureCollection = null;
        } else {
            $featureCollection = new Model_FeatureCollection();
            $geometry = $content->renderGeometryArray;
            $informations = array();
            $indexTable = 1;
            foreach ($html->find('table') as $table) {
                if ($indexTable % 2 != 0) {
                    $informations[] = $table->plaintext;
                } else {
                    $tdInfo = array();
                    foreach ($table->find('td') as $td) {
                        $tdInfo[] = $td->plaintext;
                    }
                    $informations[] = $tdInfo;
                }
                $indexTable++;
            }

            $count = count($informations) / 2;
            for ($indexArray = 0; $indexArray < $count; $indexArray++) {
                $arrayToEdit = $informations[($indexArray * 2) + 1];
                $limit = count($arrayToEdit) / 2;
                $labels = array_slice($arrayToEdit, 0, $limit);
                $values = array_slice($arrayToEdit, $limit, count($arrayToEdit) - 1);

                $properties = array(
                    'title' => $informations[($indexArray * 2)],
                    'labels' => $labels,
                    'values' => $values
                );
                $feature = new Model_Feature($geometry[$indexArray][0], $properties);
                $featureCollection->addFeature($feature);
            }
        }
        return $featureCollection;
    }
}

?>
