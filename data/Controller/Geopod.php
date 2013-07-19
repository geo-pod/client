<?php

// PEAR::Auth
require_once('Auth.php');

class Controller_Geopod {

    protected $template;
    protected $config;
    protected $getCapabilities;

    /**
     * Object Auth
     * @var Auth
     */
    protected $auth;

    public function __construct() {
        $ini = parse_ini_file('../data/config/config.ini');
        foreach ($ini as $key => $val) {
            define($key, $val);
        }

        $this->template = new Controller_Template();
        $this->config = new Controller_Config();

        // Auth instance
        $dns = BV_DRIVER . "://" . BV_DB_USER . ":" . BV_DB_PWD . "@" . BV_DB_HOST . "/" . BV_DB_NAME; //"$driver://$user:$password@$host/$dbname")
        $params = array(
            "dsn" => $dns,
            "table" => "user",
            "usernamecol" => "username",
            "passwordcol" => "password",
            "cryptType" => "sha1",
            "postUsername" => "login_username",
            "postPassword" => "login_password"
        );
        $this->auth = new Auth("MDB2", $params, '', false);
        $this->auth->setSessionName("GeoPOD");
        $this->auth->start();
    }

    private function getPublicPage() {
        $title = $this->config->getConfig("GP_TITLE");
        $headtext = $this->config->getConfig("GP_LABEL");
        $logo = $this->config->getConfig("GP_LOGO");
        return $this->template->drawPublicPage($title, $headtext, $logo);
    }

    private function getLoginPage() {
        $title = $this->config->getConfig("GP_TITLE");
        $headtext = $this->config->getConfig("GP_LABEL");
        $logo = $this->config->getConfig("GP_LOGO");
        return $this->template->drawLoginPage($title, $headtext, $logo);
    }

    private function getPrivatePage() {
        $title = $this->config->getConfig("GP_TITLE");
        $headtext = $this->config->getConfig("GP_LABEL");
        $logo = $this->config->getConfig("GP_LOGO");
        return $this->template->drawPrivatePage($title, $headtext, $logo);
    }

    protected function getContent($action) {
        switch ($action) {
            case 'map-visio-priv':
                if ($this->auth->getAuth()) {
                    return $this->getPrivatePage();
                } else {
                    return $this->getLoginPage();
                }
                break;

            case 'login':
                if ($this->auth->getAuth()) {
                    $this->template->setPageAction("map-visio-priv");
                    $this->template->setUsername($this->auth->getUsername());
                    return $this->getPrivatePage();
                } else {
                    return $this->getLoginPage();
                }
                break;

            default:
            case 'map-viso':
                if ($this->auth->getAuth()) {
                    return $this->getPrivatePage();
                } else {
                    return $this->getPublicPage();
                }
                break;
        }
    }

    public function main() {
        //session_regenerate_id(true);
        // Récupération de l'action en cours, action par défaut: list
        $action = isset($_REQUEST['action']) ? $_REQUEST['action'] : 'map-viso';
        $this->template->setPageAction($action);

        $content = $this->getContent($action);

        // Procède au logout de l'utilisateur si nécessaire
        if ($action == 'logout' && $this->auth->getAuth()) {
            $this->auth->logout();
            session_destroy();
        }
        // Récupère le code HTML correspondant à l'action utilisateur choisie        
//        try {
//            $content = $this->getContent("map-viso");
//        } catch (Exception $e) {
//            $this->displayMessage('UnknownError');
//        }
        $this->template->setPageContent($content);
        // Affichage de l'IHM
        $this->template->display();
    }

}
?>

