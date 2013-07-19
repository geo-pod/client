<div id="header">
    <div id="h_info">
        <h1 class="gp_logo" >GeoPod</h1>
        <img class="gp_client_img" src="{$gp_logo}" />
        <h1 class="gp_client_text">{$gp_headtext}</h1>
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
</form>