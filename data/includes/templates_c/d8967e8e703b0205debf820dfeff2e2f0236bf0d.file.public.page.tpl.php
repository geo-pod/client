<?php /* Smarty version Smarty-3.1.14, created on 2013-07-18 17:03:00
         compiled from "..\data\includes\templates\public.page.tpl" */ ?>
<?php /*%%SmartyHeaderCode:808851e7ddebbccef3-79201114%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'd8967e8e703b0205debf820dfeff2e2f0236bf0d' => 
    array (
      0 => '..\\data\\includes\\templates\\public.page.tpl',
      1 => 1374166974,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '808851e7ddebbccef3-79201114',
  'function' => 
  array (
  ),
  'version' => 'Smarty-3.1.14',
  'unifunc' => 'content_51e7ddebc2a554_18857470',
  'variables' => 
  array (
    'gp_logo' => 0,
    'gp_headtext' => 0,
    'toolbar' => 0,
  ),
  'has_nocache_code' => false,
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51e7ddebc2a554_18857470')) {function content_51e7ddebc2a554_18857470($_smarty_tpl) {?><div id="header">
    <div id="h_info">
        <h1 class="gp_logo" >GeoPod</h1>
        <img class="gp_client_img" src="<?php echo $_smarty_tpl->tpl_vars['gp_logo']->value;?>
" />
        <h1 class="gp_client_text"><?php echo $_smarty_tpl->tpl_vars['gp_headtext']->value;?>
</h1>
    </div>
    <div id="h_controls">
        <?php echo $_smarty_tpl->tpl_vars['toolbar']->value;?>

    </div>
</div>
<div id="permalink-content"></div>
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