<!DOCTYPE HTML>
<html>
{if $action == "login"}        
    {include file='login.header.tpl'}
{else}
    {include file='header.tpl'}    
{/if}
<body>
<div id="content">
    {$content}
 </div>    
{include file='footer.tpl'}
</body>
</html>