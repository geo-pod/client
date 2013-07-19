<?php /* Smarty version Smarty-3.1.14, created on 2013-07-18 12:16:28
         compiled from "..\data\includes\templates\main.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2681051e7dc9ca6e1f1-14593590%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '89b55f105872e20ba76fab64df92925d25a3d70c' => 
    array (
      0 => '..\\data\\includes\\templates\\main.tpl',
      1 => 1374138723,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2681051e7dc9ca6e1f1-14593590',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'action' => 0,
    'content' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.14',
  'unifunc' => 'content_51e7dc9cad6912_94794591',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51e7dc9cad6912_94794591')) {function content_51e7dc9cad6912_94794591($_smarty_tpl) {?><!DOCTYPE HTML>
<html>
<?php if ($_smarty_tpl->tpl_vars['action']->value=="login"){?>        
    <?php echo $_smarty_tpl->getSubTemplate ('login.header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

<?php }else{ ?>
    <?php echo $_smarty_tpl->getSubTemplate ('header.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>
    
<?php }?>
<body>
<div id="content">
    <?php echo $_smarty_tpl->tpl_vars['content']->value;?>

 </div>    
<?php echo $_smarty_tpl->getSubTemplate ('footer.tpl', $_smarty_tpl->cache_id, $_smarty_tpl->compile_id, null, null, array(), 0);?>

</body>
</html><?php }} ?>