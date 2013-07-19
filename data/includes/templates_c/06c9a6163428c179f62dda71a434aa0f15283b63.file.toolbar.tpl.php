<?php /* Smarty version Smarty-3.1.14, created on 2013-07-18 12:20:10
         compiled from "..\data\includes\templates\toolbar.tpl" */ ?>
<?php /*%%SmartyHeaderCode:841251e7dc9c9a26c9-68682651%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '06c9a6163428c179f62dda71a434aa0f15283b63' => 
    array (
      0 => '..\\data\\includes\\templates\\toolbar.tpl',
      1 => 1374149986,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '841251e7dc9c9a26c9-68682651',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.14',
  'unifunc' => 'content_51e7dc9c9fc046_76109291',
  'variables' => 
  array (
    'username' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51e7dc9c9fc046_76109291')) {function content_51e7dc9c9fc046_76109291($_smarty_tpl) {?><ul id="menu">
    <li><a href="#" class="gp-button-deactive" ><span id="zoombox"  name="zoombox" class="ui-icon control-zoombox"></span>Zoom</a></li>
    <li><a href="#" class="gp-button-active"><span id="navigation"  name="navigation" class="ui-icon control-navigation"></span>Navigation</a></li>
    <li>
        <a href="#"><span id="measuremenu" class="ui-icon control-measure" name="measuremenu"></span>Mesurer</a>
        <ul id="measure-menu-sub">
            <li><a href="#" class="gp-button-deactive"><span id="measure-line"  name="measure-line" class="ui-icon control-measure-line"></span>Ligne</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="measure-polygon"  name="measure-polygon" class="ui-icon control-measure-polygon"></span>Polygone</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="measure-box"  name="measure-box" class="ui-icon control-measure-box"></span>Rectangle</a></li>
        </ul>
    </li>
    <li><a href="#" class="gp-button-deactive"><span id="information"  name="information" class="ui-icon control-info"></span>Informations</a></li>
    <li>
        <a href="#"><span id="drawmenu" class="ui-icon control-draw" name="drawmenu"></span>Dessiner</a>
        <ul id="draw-menu-sub">
            <li><a href="#" class="gp-button-deactive"><span id="draw-line"  name="draw-line" class="ui-icon control-draw-line"></span>Ligne</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="draw-polygon"  name="draw-polygon" class="ui-icon control-draw-polygon"></span>Polygone</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="draw-box"  name="draw-box" class="ui-icon control-draw-rectangle"></span>Rectangle</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="draw-export"  name="draw-export" class="ui-icon control-export"></span>Exporter KML</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="measure-clear"  name="measure-clear" class="ui-icon control-measure-clear"></span>Sélectionner</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="measure-clear"  name="measure-clear" class="ui-icon control-measure-clear"></span>Déplacer</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="measure-clear"  name="measure-clear" class="ui-icon control-measure-clear"></span>Effacer</a></li>
        </ul>
    </li>
    <li><a href="#" class="gp-button-deactive"><span id="permalink"  name="permalink" class="ui-icon control-permalink"></span>Permalink</a></li>
    <?php if (!isset($_smarty_tpl->tpl_vars['username']->value)){?>
        <li><a href="?action=login" class="gp-button-deactive"><span id="login"  name="admin" class="ui-icon control-login"></span>Admin</a></li>
    <?php }else{ ?>
        <li><a href="?action=logout" class="gp-button-deactive"><span id="logout"  name="admin" class="ui-icon control-logout"></span>Logout</a></li>
    <?php }?>
</ul>
<?php }} ?>