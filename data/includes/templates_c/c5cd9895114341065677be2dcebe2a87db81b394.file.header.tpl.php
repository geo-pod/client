<?php /* Smarty version Smarty-3.1.14, created on 2013-07-19 08:48:49
         compiled from "..\data\includes\templates\header.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2954751e7dc9cafc146-96850564%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'c5cd9895114341065677be2dcebe2a87db81b394' => 
    array (
      0 => '..\\data\\includes\\templates\\header.tpl',
      1 => 1374223700,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2954751e7dc9cafc146-96850564',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.14',
  'unifunc' => 'content_51e7dc9cb81d23_94900403',
  'variables' => 
  array (
    'gp_title' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51e7dc9cb81d23_94900403')) {function content_51e7dc9cb81d23_94900403($_smarty_tpl) {?>    <head>
        <meta charset="utf-8" />
        <title><?php echo $_smarty_tpl->tpl_vars['gp_title']->value;?>
</title>
        <meta name="viewport" content="width=device-width">
        <meta name="robots" content="noindex"> <!-- pour que le site ne se fasse pas indexer -->
        <!-- Le favicon -->
        <link rel="shortcut icon" href="ico/geopod.ico">
        <!-- JS -->
        <!-- jQuery and plugin 
        -->
        <script src="js/jquery-2.0.0.js"></script>
        <!--
        <script src="js/jquery-ui-1.10.3/ui/jquery-ui.js"></script>
        <script src="js/jquery-ui-1.10.3/ui/jquery.ui.effect.js"></script>
        
        <script src="js/jquery-ui-1.10.3/jquery-1.9.1.js"></script>
        <script src="js/dynatree-1.2.4/src/jquery.dynatree.js" type="text/javascript"></script>
        -->
        <script src="js/jquery-ui-1.10.3/jquery-ui-1.10.3.js"></script>
        <script src="js/dynatree-1.2.4/jquery.dynatree.js" type="text/javascript"></script>
        <script src="js/jquery.dataTables.js" type="text/javascript"></script>
        <!-- proj4js -->
        <script src="js/proj4js/lib/proj4js-combined.js" type="text/javascript"></script>
        <script src="js/proj4js/lib/defs/EPSG900913.js" type="text/javascript"></script>
        <script src="js/proj4js/lib/defs/EPSG21781.js" type="text/javascript"></script>
        <!-- OpenLayers -->
        <script src="js/openlayers/OpenLayers.js"></script> <!-- ol3 http://ol3js.org/en/r3.0.0-alpha.2/build/ol.js -->
        <!-- ZeroClipboard -->
        <script src="js/ZeroClipboard/ZeroClipboard.min.js" type="text/javascript"></script>
        <!-- GeoPoD script -->
        <script src="js/app.js" type="text/javascript"></script>

        <!-- LINK GOOGLE WEBFONT-->
        <link href='http://fonts.googleapis.com/css?family=Open+Sans+Condensed:700,300' rel='stylesheet' type='text/css'>
        <!-- CSS -->
        <!-- CSS GeoPod
        <link rel="stylesheet" href="css/reset.css">
        -->
        <link rel="stylesheet" href="js/jquery-ui-1.10.3/css/smoothness/jquery-ui-1.10.3.custom.min.css">
        <link href="js/dynatree-1.2.4/skin/ui.dynatree.css" rel="stylesheet" type="text/css" id="skinSheet">
        <link rel="stylesheet" href="css/layout.css" />
        <link rel="stylesheet" href="css/jquery_ui_override.css" />
        <link rel="stylesheet" href="css/openlayers_override.css" />
        <link rel="stylesheet" href="css/jquery.dataTables.css" />
        
    </head>
<?php }} ?>