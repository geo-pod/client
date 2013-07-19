<?php /* Smarty version Smarty-3.1.14, created on 2013-07-18 12:16:28
         compiled from "..\data\includes\templates\private.page.tpl" */ ?>
<?php /*%%SmartyHeaderCode:1379751e7dc9ca2eb62-99089603%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'd3c8622cf796ef9fed73bff1a6b82d9a4a86c6f7' => 
    array (
      0 => '..\\data\\includes\\templates\\private.page.tpl',
      1 => 1374147534,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '1379751e7dc9ca2eb62-99089603',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'gp_logo' => 0,
    'gp_headtext' => 0,
    'toolbar' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.14',
  'unifunc' => 'content_51e7dc9ca49984_87773824',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51e7dc9ca49984_87773824')) {function content_51e7dc9ca49984_87773824($_smarty_tpl) {?><div id="header">
    <div id="h_info">
        <h1 class="gp_logo" >GeoPod Private</h1>
        <img class="gp_client_img" src="<?php echo $_smarty_tpl->tpl_vars['gp_logo']->value;?>
" />
        <h1 class="gp_client_text"><?php echo $_smarty_tpl->tpl_vars['gp_headtext']->value;?>
</h1>
    </div>
    <div id="h_controls">
        <?php echo $_smarty_tpl->tpl_vars['toolbar']->value;?>

    </div>
</div>
<div id="map"></div>

<div id="layercontrol" class="">
    <div id="accordion">
        <h3>Couches</h3>
        <div>
            <div id="layerslist">
            </div>
            <div id="base-maps"></div>
            <div id="over-layers"></div>
        </div>
        <h3>Legende</h3>
        <div id="legend"></div>
    </div>
</div><?php }} ?>