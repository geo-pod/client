<?php /* Smarty version Smarty-3.1.14, created on 2013-07-18 12:22:07
         compiled from "..\data\includes\templates\login.page.tpl" */ ?>
<?php /*%%SmartyHeaderCode:2968151e7ddefb70165-51568137%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_valid = $_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    'c1e008128131927a7b26715921f142e7709cd2b4' => 
    array (
      0 => '..\\data\\includes\\templates\\login.page.tpl',
      1 => 1374137285,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '2968151e7ddefb70165-51568137',
  'function' => 
  array (
  ),
  'variables' => 
  array (
    'gp_logo' => 0,
    'gp_headtext' => 0,
  ),
  'has_nocache_code' => false,
  'version' => 'Smarty-3.1.14',
  'unifunc' => 'content_51e7ddefc33585_46008526',
),false); /*/%%SmartyHeaderCode%%*/?>
<?php if ($_valid && !is_callable('content_51e7ddefc33585_46008526')) {function content_51e7ddefc33585_46008526($_smarty_tpl) {?><div id="header">
    <div id="h_info">
        <h1 class="gp_logo" >GeoPod</h1>
        <img class="gp_client_img" src="<?php echo $_smarty_tpl->tpl_vars['gp_logo']->value;?>
" />
        <h1 class="gp_client_text"><?php echo $_smarty_tpl->tpl_vars['gp_headtext']->value;?>
</h1>
    </div>
</div>
   
<form method="post" action="?action=login">
    <div class="row">Login</div>
    <div class="row">
        <h3>Username:</h3>
        <input type="text" name="login_username" value="" />
    </div>
    <div class="row">
        <h3>Password:</h3>
        <input type="password" name="login_password" />
    </div>
    <div class="row">
        <input class="submit" type="submit" name="login" value="Connexion!"/>
    </div>
</form><?php }} ?>