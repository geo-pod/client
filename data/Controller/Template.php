<?php

// smarty
require_once(GP_ROOTPATH . GP_SMARTY_DIR . 'Smarty.class.php');

/**
 * Classe permettant de separer la parti template du code php grâce à Smarty
 * @uses Smarty
 */
class Controller_Template {

    /**
     * Un object Smarty
     * @var Smarty
     */
    public $smarty;

    /**
     * Permet l'initialisation de l'objet Template contenant un object Smarty
     */
    public function __construct() {
        // Smarty instance
        $tplDir = GP_ROOTPATH . GP_TPL_DIR;
        $tplcDir = GP_ROOTPATH . GP_TPLC_DIR;
        $this->smarty = new Smarty();
        $this->smarty->setTemplateDir($tplDir);
        $this->smarty->setCompileDir($tplcDir);
    }

    /**
     * Affichage de l'IHM
     * Code HTML du corps du site
     */
    public function display() {
        $this->smarty->display('main.tpl');
    }

    /**
     * Assigne le contenu à Smarty
     * @param string Le contenu est du code HTML
     */
    public function setPageContent($content) {
        $this->smarty->assign('content', $content);
    }

    /**
     * Assigne à Smarty l'action qu'on vient d'effectuer
     * @param string L'action récupéré
     */
    public function setPageAction($action) {
        $this->smarty->assign('action', $action);
    }
    
    public function setUsername($username) {
        $this->smarty->assign('username', $username);
    }

    public function drawPublicPage($title, $headtext, $logo) {
        $this->smarty->assign('gp_title', $title);
        $this->smarty->assign('gp_headtext', $headtext);
        $this->smarty->assign('gp_logo', $logo);
        $toolbar = $this->getToolbar();
        $this->smarty->assign('toolbar', $toolbar);
        return $this->smarty->fetch('public.page.tpl');
    }

    public function drawLoginPage($title, $headtext, $logo) {
        $this->smarty->assign('gp_title', $title);
        $this->smarty->assign('gp_headtext', $headtext);
        $this->smarty->assign('gp_logo', $logo);
        return $this->smarty->fetch('login.page.tpl');
    }
    
    public function drawPrivatePage($title, $headtext, $logo) {
        $this->smarty->assign('gp_title', $title);
        $this->smarty->assign('gp_headtext', $headtext);
        $this->smarty->assign('gp_logo', $logo);
        $toolbar = $this->getToolbar();
        $this->smarty->assign('toolbar', $toolbar);
        return $this->smarty->fetch('private.page.tpl');
    }

    public function getToolbar() {
        return $this->smarty->fetch('toolbar.tpl');
    }

}
?>

