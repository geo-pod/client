<ul id="menu">
    <li><a href="#" class="gp-button-deactive" ><span id="zoombox"  name="zoombox" class="ui-icon control-zoombox"></span>Zoom</a></li>
    <li><a href="#" class="gp-button-active"><span id="navigation"  name="navigation" class="ui-icon control-navigation"></span>Navigation</a></li>
    <li>
        <a href="#"><span id="measuremenu" name="menu" class="ui-icon control-measure" name="measuremenu"></span>Mesurer</a>
        <ul id="measure-menu-sub">
            <li><a href="#" class="gp-button-deactive"><span id="measure-line"  name="measure-line" class="ui-icon control-measure-line"></span>Ligne</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="measure-polygon"  name="measure-polygon" class="ui-icon control-measure-polygon"></span>Polygone</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="measure-box"  name="measure-box" class="ui-icon control-measure-box"></span>Rectangle</a></li>
        </ul>
    </li>
    <li>
        <a href="#"><span id="informationmenu" name="menu" class="ui-icon control-info"></span>Informations</a>
        <ul id="info-menu-sub">
            <li><a href="#" class="gp-button-deactive"><span id="information-get"  name="information-get" class="ui-icon control-information-get"></span>Interroger</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="information-clear"  name="information-clear" class="ui-icon control-information-clear"></span>Effacer</a></li>
        </ul>
    </li>
    <li>
        <a href="#"><span id="drawmenu" name="menu" class="ui-icon control-draw" name="drawmenu"></span>Dessiner</a>
        <ul id="draw-menu-sub">
            <li><a href="#" class="gp-button-deactive"><span id="draw-point"  name="draw-point" class="ui-icon control-draw-point"></span>Point</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="draw-line"  name="draw-line" class="ui-icon control-draw-line"></span>Ligne</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="draw-polygon"  name="draw-polygon" class="ui-icon control-draw-polygon"></span>Polygone</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="draw-box"  name="draw-box" class="ui-icon control-draw-rectangle"></span>Rectangle</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="draw-export"  name="draw-export" class="ui-icon control-export"></span>Exporter KML</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="draw-select"  name="draw-select" class="ui-icon control-draw-select"></span>Sélectionner</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="draw-modify"  name="draw-modify" class="ui-icon control-draw-modify"></span>Modifier</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="draw-drag"  name="draw-drag" class="ui-icon control-draw-drag"></span>Déplacer</a></li>
            <li><a href="#" class="gp-button-deactive"><span id="draw-clear"  name="draw-clear" class="ui-icon control-draw-clear"></span>Effacer</a></li>
        </ul>
    </li>
    <li><a href="#" class="gp-button-deactive"><span id="permalink"  name="permalink" class="ui-icon control-permalink"></span>Permalink</a></li>
    {if not isset($username)}
        <li><a href="?action=login" class="gp-button-deactive"><span id="login"  name="admin" class="ui-icon control-login"></span>Admin</a></li>
    {else}
        <li><a href="?action=logout" class="gp-button-deactive"><span id="logout"  name="admin" class="ui-icon control-logout"></span>Logout</a></li>
    {/if}
</ul>
<li>
<div>
    <label for="address">Search: </label>
    <input id="address" />
</div>

<form>
    <div id="downloadify" ></div>
</form>