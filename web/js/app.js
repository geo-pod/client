/** ***************************************************************************
 * Variable initializer & variable declaration
 *************************************************************************** */
//OpenLayers variable

//drawLayers to delete
var map, layerToEdit, myWms, baseLayer, layerFeatureInfo = null, drawLayers, drawLayer, drawControls, layerAddress = null, listSelectedFeatures = null;
var modifyController = null, dragController = null;
var gp_controls; // = new Array();
var GP_LAT, GP_LON, GP_ZOOM, GP_MAX_BBOX, GP_ACTION;
var MC_USER, MC_SQL_API, MC_CONTROLLER, MC_WMS;
var myProxy = "proxy.php?url=";
var dispatcherUrl = "dispatcher.php";
var clip;
//Dynatree
// This structure is imposed by dynatree
var treeOverLayers;
var baseMaps = {
    title: "Cartes de base",
    isFolder: true,
    key: "carte_de_base",
    expand: true,
    hideCheckbox: true,
    unselectable: true,
    children: []
};
var overLayers = {
    title: "Couches thématiques",
    isFolder: true,
    key: "id4",
    expand: true,
    hideCheckbox: true,
    unselectable: true,
    children: []
};
/** ***************************************************************************
 * When page is ready the variables will be initilized
 *************************************************************************** */
$(document).ready(function() {
    /** ***************************************************************************
     * Initialize var with the configuration file
     *************************************************************************** */

    /**
     * This method returns the configurations from the file config/config.ini
     * @param {Array[String]} keys
     * @returns The configuration - JSON format
     */
    function getConf(keys) {
        var options = JSON.stringify({
            key: keys
        });
        return $.getJSON(dispatcherUrl, {
            a: "getConfig",
            o: options
        }).done(function(data) {
        });
    }

    GP_ACTION = url('?action');
//The keys of the configuration that we are looking for
    var keys = ["GP_LAT", "GP_LON", "GP_ZOOM", "MC_USER", "MC_SQL_API", "MC_CONTROLLER", "MC_WMS", "GP_MAX_BBOX"];
    // When the ajax call is complite the varibles will be affected
    $.when(getConf(keys)).done(function(data) {
        if (data["GP_LAT"] !== null) {
            GP_LAT = data["GP_LAT"];
        }
        if (data["GP_LON"] !== null) {
            GP_LON = data["GP_LON"];
        }
        if (data["GP_ZOOM"] !== null) {
            GP_ZOOM = data["GP_ZOOM"];
        }
        if (data["MC_USER"] !== null) {
            MC_USER = data["MC_USER"];
        }
        if (data["MC_SQL_API"] !== null) {
            MC_SQL_API = data["MC_SQL_API"];
        }
        if (data["MC_CONTROLLER"] !== null) {
            MC_CONTROLLER = data["MC_CONTROLLER"];
        }
        if (data["MC_WMS"] !== null) {
            MC_WMS = data["MC_WMS"];
        }
        if (data["GP_MAX_BBOX"] !== null) {
            var values = data["GP_MAX_BBOX"].split(",");
            GP_MAX_BBOX = new OpenLayers.Bounds(values).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
            ;
        }
// When the initialisation is done we can allow the execution of the main code
        $(document).trigger("initdone");
    });
});
// After the initialisation this block will be executed
$(document).bind("initdone", function() {
    /** ***************************************************************************
     * Define OpenLayers style
     *************************************************************************** */
    OpenLayers.ImgPath = "js/openlayers/img/dark/";
    /** ***************************************************************************
     * OpenLayer Map - The map will be created
     *************************************************************************** */
    map = new OpenLayers.Map({
        div: "map",
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: "m",
        //resolutions: [650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5],
        //restrictedExtent: GP_MAX_BBOX,
        controls: []
                //fractionalZoom: false,
                //autoUpdateSize: true,
//        minResolution: 'auto',
//        maxResolution: 'auto',
//        minResolution: 0.02197265625,
//        maxResolution: 0.3515625
                //maxResolution: 0.02197265625

//        scales: [55367980.3125, 27683990.15625, 13841995.078125,
//            6920997.5390625],
    });
    //map.numZoomLevels = null;
    //map.setOptions({restrictedExtent: GP_MAX_BBOX});
    /** ***************************************************************************
     * Styles - Here the styles are defined
     *************************************************************************** */
    // This style is used for the measurations
    var sketchSymbolizers = {
        "Point": {
            pointRadius: 4,
            graphicName: "square",
            fillColor: "white",
            fillOpacity: 1,
            strokeWidth: 1,
            strokeOpacity: 1,
            strokeColor: "#333333"
        },
        "Line": {
            strokeWidth: 1,
            strokeOpacity: 1,
            strokeColor: "#f67b17" //f67b17
                    //strokeDashstyle: "dash"
        },
        "Polygon": {
            strokeWidth: 2,
            strokeOpacity: 1,
            strokeColor: "#f67b17", //
            fillColor: "#fbfca0",
            fillOpacity: 0.3
        }
    };
    var style = new OpenLayers.Style();
    style.addRules([
        new OpenLayers.Rule({symbolizer: sketchSymbolizers})
    ]);
    var styleMap = new OpenLayers.StyleMap({"default": style});
    /** ***************************************************************************
     * BaseLayers - OSM and an ortophote will be added
     *************************************************************************** */

//    var blank = new OpenLayers.Layer.Image("No base layer", 'img/white.png', GP_MAX_BBOX, new OpenLayers.Size(1, 1));
//    blank.isBaseLayer = true;
//    map.addLayer(blank);

    baseEmpty = new OpenLayers.Layer.Vector("Pas de carte de fond");
    baseMaps.children.push({title: baseEmpty.name, key: baseEmpty.id, select: true});
    map.addLayer(baseEmpty);
    // OSM
    baseLayer = new OpenLayers.Layer.OSM(); //"OSM", "", {isBaseLayer:true, zoomOffset: 8});//, resolutions: [650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5]});
    baseMaps.children.push({title: baseLayer.name, key: baseLayer.id});
    map.addLayer(baseLayer);
    hideLayer(baseLayer);
    
    // The center of the map is loaded from the config file
    var lonLat = new OpenLayers.LonLat(GP_LON, GP_LAT).transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            new OpenLayers.Projection("EPSG:900913") // to Spherical Mercator Projection
            );
    map.setCenter(lonLat, GP_ZOOM);
    /** ***************************************************************************
     * Controls
     *************************************************************************** */
    drawLayer = new OpenLayers.Layer.Vector("Draw Layer");
    drawLayer.events.on({
        'featureselected': function(feature) {
            listSelectedFeatures = this.selectedFeatures;
        },
        'featureunselected': function(feature) {
            listSelectedFeatures = null;
        }
    });


    //drawLayers = [drawPointLayer, drawLineLayer, drawPolygonLayer, drawboxLayer];
    //drawLayers = [drawLayer];

//    $.each(drawLayers, function(key, layer) {
//        layer.events.on({
//            'featureselected': function(feature) {
//                var newLayer = this;
//                listSelectedFeatures = this.selectedFeatures;
//            },
//            'featureunselected': function(feature) {
//                listSelectedFeatures = null;
//            }
//        });
//    });
    map.addLayers([drawLayer]);
//    var size = new OpenLayers.Size(21, 25);
//    var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
//    var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png', size, offset);
    // Controls user for drawing
    drawControls = {
        point: new OpenLayers.Control.DrawFeature(drawLayer,
                OpenLayers.Handler.Point),
        line: new OpenLayers.Control.DrawFeature(drawLayer,
                OpenLayers.Handler.Path),
        polygon: new OpenLayers.Control.DrawFeature(drawLayer,
                OpenLayers.Handler.Polygon),
        box: new OpenLayers.Control.DrawFeature(drawLayer,
                OpenLayers.Handler.RegularPolygon, {
            handlerOptions: {
                sides: 4,
                irregular: true
            }
        }),
        select: new OpenLayers.Control.SelectFeature(
                drawLayer,
                {
                    clickout: true, toggle: false,
                    multiple: false, hover: false,
                    toggleKey: "ctrlKey", // ctrl key removes from selection
                    multipleKey: "shiftKey" // shift key adds to selection
                }
        ),
        modify: new OpenLayers.Control.ModifyFeature(drawLayer),
        drag: new OpenLayers.Control.DragFeature(drawLayer)
    };

    //Controls used for measuring
    var measureControls = {
        line: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Path, {
            geodesic: true,
            displayUnits: 'm',
            persist: true,
            handlerOptions: {
                layerOptions: {
                    styleMap: styleMap
                }
            }
        }),
        polygon: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Polygon, {
            geodesic: true,
            displayUnits: 'm',
            persist: true,
            handlerOptions: {
                layerOptions: {
                    styleMap: styleMap
                }
            }
        }),
        box: new OpenLayers.Control.Measure(
                OpenLayers.Handler.RegularPolygon, {
            geodesic: true,
            displayUnits: 'm',
            persist: true,
            handlerOptions: {
                sides: 4,
                irregular: true,
                layerOptions: {
                    styleMap: styleMap
                }
            }
        })
    };
    //This object contains all the controlles
    gp_controls = {
        draw: drawControls,
        measure: measureControls,
        navigation: new OpenLayers.Control.Navigation(),
        attribution: new OpenLayers.Control.Attribution(),
        panzoombar: new OpenLayers.Control.PanZoomBar(),
        overviewmap: new OpenLayers.Control.OverviewMap(),
        scaleline: new OpenLayers.Control.ScaleLine(),
        zoombox: new OpenLayers.Control.ZoomBox()
    };
    //All the controllers will be added to the map
    $.each(gp_controls, function(key, control) {
        if (key === "measure") {
            $.each(control, function(key, control) {
//These events call the method handleMeasurements in order to show the measures
                control.events.on({
                    "measure": handleMeasurements,
                    "measurepartial": handleMeasurements
                });
                map.addControl(control);
            });
        } else if (key === "draw") {
            $.each(control, function(key, control) {
                map.addControl(control);
            });
        } else {
            map.addControl(control);
        }
    });
    /** ***************************************************************************
     * Events
     *************************************************************************** */
    // Event: mousemove
    // The mouse position (xy) is recuperate, then converted to longitude and latitude
    // transformed to the swiss projection system and finally placed into the element mouse-position
    // The library Proj4js is required
    map.events.register("mousemove", map, function(e) {
        var pixel = new OpenLayers.Pixel(e.xy.x, e.xy.y);
        var lonlat = map.getLonLatFromPixel(pixel);
        lonlat = lonlat.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
        var source = new Proj4js.Proj("EPSG:4326");
        var dest = new Proj4js.Proj("EPSG:21781");
        var p = new Proj4js.Point(lonlat.lon, lonlat.lat);
        Proj4js.transform(source, dest, p);
        var infoLonLat = "EPSG:21781: " + p.x.toFixed(2) + " | " + p.y.toFixed(2);
        OpenLayers.Util.getElement("mouse-position").innerHTML = infoLonLat;
    });
    /** ***************************************************************************
     * Loading all the public WMS from the GetCapabilities
     *************************************************************************** */
    var options = JSON.stringify({
        schema: "public"
    });
    addOverLayers(options);
    /** ***************************************************************************
     * DynaTree - Base Layers
     *************************************************************************** */
    // --- Initialize base map tree
    $("#base-maps").dynatree({
        checkbox: false,
        // Override class name for checkbox icon:
        classNames: {checkbox: "dynatree-radio"},
        selectMode: 1,
        children: baseMaps,
        onClick: function(node, event) {
            if (node.getLevel() > 1) {

                var baseLayerToVisualize = map.getLayer(node.data.key);
                node.toggleSelect();
                $.each(baseMaps.children, function(key, val) {
                    if (baseLayerToVisualize.id !== val.key) {
                        hideLayer(map.getLayer(val.key));
                    } else {
                        showLayer(baseLayerToVisualize);
                    }
                });
            }
        },
        cookieId: "dynatree-Cb1",
        idPrefix: "dynatree-Cb1-"
    });
    /** ***************************************************************************
     * Button actions
     *************************************************************************** */
    //Accordion - Layerswitcher and Legend
    $("#accordion").accordion({
        heightStyle: "content",
        collapsible: true
    });
    //Generate the toolbar
    var toolbar = $("#menu");
    $("#menu").menu({
        position: {
            my: 'left top',
            at: 'left bottom'
        }
    });
    $("#address").autocomplete({
        source: function(request, response) {

            var values = request.term.toLowerCase().split(" ");
            var where = new Array();
            $.each(values, function(key, val) {
                where.push("lower(voie) like '%" + val + "%'");
            });
            var query = "select objectid, localite, voie, nom, no_entree, the_geom from public.adresse_point where " + where.join(" AND ") + " order by no_entree, voie limit 10";
            var url = MC_SQL_API + MC_USER + '?q=' + query + '&jsonp_callback=mydata';
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                jsonpCallback: 'mydata',
                contentType: "application/json",
                dataType: 'jsonp',
                success: function(data) {

                    response($.map(data.features, function(item) {
                        var obj;
                        var street;
                        street = item.properties.voie.split(",");
                        if ($(street).size() > 1) {
                            obj = {
                                label: street[1] + " " + street[0] + ", " + item.properties.no_entree,
                                value: street[1] + " " + street[0] + ", " + item.properties.no_entree,
                                feature: item
                            };
                        } else {
                            obj = {
                                label: street[0] + ", " + item.properties.no_entree,
                                value: street[0] + ", " + item.properties.no_entree,
                                feature: item
                            };
                        }
                        return obj;
                    }));
                }
            });
        },
        minLength: 2,
        select: function(event, ui) {
            addAddress(ui.item.feature);
        }
    });
    // Toolbar actions
    $("#menu li.ui-menu-item").click(function(event) {
        var lastAction = $(toolbar).find("li a.gp-button-active span").last().attr('name'); //.attr('name');
        var child = $(this).find('a');
        var isMenu = false;
        if ($(this).find('a span[name=menu]').attr('name') === "menu") {
            isMenu = true;
        }
        var elementName = $(this).find('span').attr('name');
        if ($(child).hasClass("gp-button-deactive") && !isMenu) {
            controlManager(elementName, lastAction);
        }
    });
    /** ***************************************************************************
     * Functions
     *************************************************************************** */

    /**
     * Hide the layer
     * @param {type} layer
     * @returns {undefined}
     */
    function hideLayer(layer) {
        layer.setVisibility(false);
        layer.display(false);
    }
    /**
     * Show the layer
     * @param {type} layer
     * @returns {undefined}      */
    function showLayer(layer) {
        layer.setVisibility(true);
        layer.display(true);
    }

    /**
     * Read the getCapabilities, add all the public layers and get the legend
     * @param {type} options
     * @returns {undefined}
     */
    function addOverLayers(options) {
        if (GP_ACTION === "permalink") {
            //Check if permalink is valid
            var lonlat = new OpenLayers.LonLat(url('?lon'), url('?lat'));
            var zoom = url('?z');
            // http://phpjs.org/functions/urldecode/
            var layersName = decodeURIComponent((url('?lName') + '').replace(/\+/g, '%20'));
            
            var options = JSON.stringify({
                lon: url('?lon'),
                lat: url('?lat'),
                zoom: url('?z'),
                layers: url('?layers'),
                lName: layersName,
                key: url('?k')
            });
            $.getJSON(dispatcherUrl, {
                a: "checkPermalink",
                o: options
            }, function(isValid) {
                if (isValid) {
                    var layers = url('?layers').split(";");
                    var layersName = decodeURIComponent((url('?lName') + '').replace(/\+/g, '%20')).split(";");
                    $.each(layers, function(key, val) {
                        var schema = val.split('.');
                        var li = $("<li>" + val + "</li>");
                        $("#list").append(li);
                        myWms = new OpenLayers.Layer.WMS(
                                val,
                                MC_WMS + "/" + MC_USER + "/" + schema[0] + "/",
                                {
                                    layers: val,
                                    transparent: "true",
                                    format: "image/png",
                                    srs: "EPSG:900913"
                                },
                        {isBaseLayer: false},
                        {singleTile: false}
                        );
                        map.addLayer(myWms);
                        overLayers.children.push({title: decodeURIComponent(layersName[key]), key: val, select: true});
                        var legendUrl = MC_WMS + "/" + MC_USER + "/" + schema[0] + "/?LAYER=" + val + "&SERVICE=WMS&VERSION=1.1.1&REQUEST=getlegendgraphic&FORMAT=image/png";
                        var img = $("<img>");
                        $(img).attr("src", legendUrl);
                        $("#legend").append($("<li>").append(img));
                    });
                    addOverLayersTree(overLayers);

                    console.log(lonlat)
                    console.log(zoom);
                    map.setCenter(lonlat, zoom);
                }
            });
        } else {
            $.getJSON(dispatcherUrl, {
                a: "getCapabilities",
                o: options
            }, function(data) {
                var val;
                var index = 1;
                if (data.Capability.Layer.Layer instanceof Array) {

                    $.each(data.Capability.Layer.Layer, function(key, val) {
                        var li = $("<li>" + val.Name + "</li>");
                        $("#list").append(li);
                        myWms = new OpenLayers.Layer.WMS(
                                val.Name,
                                MC_WMS + "/" + MC_USER + "/public/",
                                {
                                    layers: val.Name,
                                    transparent: "true",
                                    format: "image/png",
                                    srs: "EPSG:900913"
                                },
                        {isBaseLayer: false},
                        {singleTile: false}
                        );
                        map.addLayer(myWms);
                        overLayers.children.push({title: val.Title, key: val.Name, select: true});
                        var legendUrl = MC_WMS + "/" + MC_USER + "/public/?LAYER=" + val.Name + "&SERVICE=WMS&VERSION=1.1.1&REQUEST=getlegendgraphic&FORMAT=image/png";
                        var img = $("<img>");
                        $(img).attr("src", legendUrl);
                        $("#legend").append($("<li>").append(img));
                    });
                } else {
                    val = data.Capability.Layer.Layer;
                    var li = $("<li>" + val.Name + "</li>");
                    $("#list").append(li);
                    myWms = new OpenLayers.Layer.WMS(
                            val.Name,
                            MC_WMS + "/" + MC_USER + "/public/",
                            {
                                layers: val.Name,
                                transparent: "true",
                                format: "image/png",
                                srs: "EPSG:900913"
                            },
                    {isBaseLayer: false},
                    {singleTile: false}
                    );
                    map.addLayer(myWms);
                    overLayers.children.push({title: val.Title, key: val.Name, select: true});
                    var legendUrl = MC_WMS + "/" + MC_USER + "/public/?LAYER=" + val.Name + "&SERVICE=WMS&VERSION=1.1.1&REQUEST=getlegendgraphic&FORMAT=image/png";
                    var img = $("<img>");
                    $(img).attr("src", legendUrl);
                    $("#legend").append($("<li>").append(img));
                }
                addOverLayersTree(overLayers);
            });
        }
    }

    /**
     * DynaTree - Add the overlayers to the list
     * @param {type} children
     * @returns {undefined}
     */
    function addOverLayersTree(children) {
        treeOverLayers = $("#over-layers").dynatree({
            checkbox: true,
            selectMode: 2,
            children: overLayers,
            onClick: function(node, event) {
                var sel = node.bSelected;
                var name = node.data.key;
                layerToEdit = map.getLayersByName(name);
                if (layerToEdit.length === 1) {
                    if (event.target.className === "dynatree-checkbox") {
                        if (!sel) {
                            showLayer(layerToEdit[0]);
                        } else {
                            hideLayer(layerToEdit[0]);
                        }
                    }
                }
            },
            onDblClick: function(node, event) {
                var sel = node.bSelected;
                var name = node.data.key;
                layerToEdit = map.getLayersByName(name);
                if (layerToEdit.length === 1) {
                    if (event.target.className === "dynatree-title") {
                        node.toggleSelect();
                        if (!sel) {
                            showLayer(layerToEdit[0]);
                        } else {
                            hideLayer(layerToEdit[0]);
                        }
                    }
                }
            },
            cookieId: "dynatree-Cb1",
            idPrefix: "dynatree-Cb1-"
        });
    }

    /**
     * This method put the measure in the dom id: 'output'
     * @param {type} event
     * @returns {undefined}
     */
    function handleMeasurements(event) {
        var geometry = event.geometry;
        var units = event.units;
        var order = event.order;
        var measure = event.measure;
        var element = document.getElementById('output');
        var out = "";
        if (order === 1) {
            out += "Mesure : " + measure.toFixed(3) + " " + units;
        } else {
            out += "Mesure : " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
        }
        element.innerHTML = out;
    }

    /**
     * This methode activate the focused control and deactive the others
     * @param {type} elementName
     * @returns {undefined}
     */
    function toggleControl(elementName) {
        var elements = elementName.split("-");
        var categoryKey = elements[0];
        var toolKey = "";
        if (elements.length > 1) {
            toolKey = elements[1];
        }
        $.each(gp_controls, function(keyParent, control) {
            if (keyParent === "measure") {
                $.each(control, function(keyChild, control) {
                    if (categoryKey === keyParent && toolKey === keyChild) {
                        control.activate();
                    } else {
                        control.deactivate();
                    }
                });
            } else if (keyParent === "draw") {
                $.each(control, function(keyChild, control) {
                    if (categoryKey === keyParent && toolKey === keyChild) {
                        control.activate();
                    } else {
                        control.deactivate();
                    }
                });
            } else if (categoryKey === "disableall") {
                control.deactivate();
            } else {
                if (categoryKey === keyParent) {
                    control.activate();
                } else {
                    control.deactivate();
                }
            }
        });
    }

    /**
     * Return the layers information for a specific mouse position
     * @param {type} e
     * @returns {undefined}
     */
    function getFeatureInfo(e) {
        //Check if the layer exists
        if (layerFeatureInfo === null) {
            layerFeatureInfo = new OpenLayers.Layer.Vector("Feature Info");
            style = {
                fill: true,
                fillColor: "#ff0000", // SLD: Fill
                fillOpacity: 0.3,
                strokeColor: "#16CAF2" // SLD: Stroke             strokeWidth: 2
            };
            layerFeatureInfo.style = style;
            map.addLayer(layerFeatureInfo);
        }
        //Get the mouse position
        px = new OpenLayers.Pixel(e.xy.x, e.xy.y);
        var lonlat = map.getLonLatFromPixel(px);
        //lonlat = lonlat.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'));
        var tree;
        try {
            tree = $("#over-layers").dynatree("getTree");
            var selectedNodes = tree.getSelectedNodes();
            var layers = new Array();
            var selKeys = $.map(selectedNodes, function(selNode) {
                if (selNode.data.key !== "public.bonvlimit") {
                    layers.push(selNode.data.key);
                }
            });
            var options = JSON.stringify({
                lon: lonlat.lon,
                lat: lonlat.lat,
                layers: layers.join(";"),
                extent: map.getExtent()
            });
            $.getJSON(dispatcherUrl, {
                a: "useApps",
                o: options
            }).done(function(data) {
                // First, clear all features
                layerFeatureInfo.removeAllFeatures();
                // create WKT parser    
                var wkt = new OpenLayers.Format.WKT();
                var feature;
                //Table
                var tableArray = new Array();
                var div = $('<div>').attr('id', 'myTable');
                if (data === null) {
                    $(div).append("<h3>Pas de données</h3>");
                } else {
                    $.each(data.features, function(key, val) {
                        feature = wkt.read(val.geometry);
                        var obj = {
                            properties: val.properties
                        };
                        $.extend(feature, obj);
                        layerFeatureInfo.addFeatures(feature);
                        var size = $(val.properties.labels).size();
                        var arrayTmp = new Array();
                        for (var i = 0; i < size; i++) {
                            var value = val.properties.values[i];
                            if (!isNaN(parseFloat(value)) && isFinite(value)) {
                                value = parseFloat(value).toFixed(3);
                            }
                            arrayTmp.push([val.properties.labels[i], value]);
                        }
                        tableArray.push(arrayTmp);
                    });
                    layerFeatureInfo.redraw();
                    var size = $(data.features).size();
                    for (var i = 0; i < size; i++) {
                        var title = data.features[i].properties.title;
                        var val = tableArray[i];
                        if (title === "Batiments") {
                            //GET OWNER
                        }
                        var tableId = "data-table-" + i;
                        $(div).append("<h3>" + title + "</h3>");
                        $(div).append($("<table>").attr("id", tableId));
                        $(div).find("#" + tableId).dataTable({
                            bJQueryUI: true,
                            bScrollCollapse: true,
                            bPaginate: false,
                            bFilter: false,
                            bSort: true,
                            bInfo: false,
                            bScrollAutoCss: true,
                            aaData: val,
                            aoColumns: [
                                {"sTitle": ""},
                                {"sTitle": ""}]
                        });
                    }
                }
                $("#content").append(div);
                $('#myTable').dialog({
                    title: "Informations",
                    resizable: false,
                    modal: true,
                    width: 600,
                    height: 400,
                    zIndex: 3000
                            //            open: function(event, ui) {
                            //                $('#data-table').css('overflow', 'hidden');
//            }
                });
            });
        } catch (e) {
            var value = 0;
            var div = $('<div>').attr('id', 'message');
            $(div).html("Pas de données");
            $("#content").append(div);
            var timer = setInterval(function() {
                value++;
                if (value > 200) {
                    $('#message').remove();
                    clearInterval(timer);
                }
            }, 10);
        }
    }


    /**
     * 
     * @param {type} address
     * @returns {undefined}
     */
    function addAddress(address) {
        // Check if the geometry is correct
        if ($(address.geometry.coordinates).size() > 2) {
            var coords = new Array();
            for (var i = 0; i < 2; i++) {
                coords.push(address.geometry.coordinates[i]);
            }
            address.geometry.coordinates = coords;
        }
        //Check if the layer exists
        if (layerAddress === null) {
            layerAddress = new OpenLayers.Layer.Vector("Address Info");
//            style = {
//                fill: true,
//                fillColor: "#00ff00", // SLD: Fill
//                fillOpacity: 0.8,
//                strokeColor: "#16CAF2", // SLD: Stroke             strokeWidth: 2
//                strokeWidth: 10
//            };
//            layerAddress.style = style;
//            layerAddress.setVisibility(true);
            map.addLayer(layerAddress);
        }
        layerAddress.removeAllFeatures();
        var geoJson = new OpenLayers.Format.GeoJSON();
        var feature = geoJson.read(address, "Feature");
        layerAddress.addFeatures(feature);
        layerAddress.redraw();
        var lonlat = new OpenLayers.LonLat(feature.geometry.x, feature.geometry.y);
        map.setCenter(lonlat, 18);
    }

    /**
     * Copy to the clipboard a message
     * @param {type} me
     * @param {type} msg
     * @returns {undefined}
     */
    function toClipboard(me, msg) {
        ZeroClipboard.setDefaults({moviePath: 'js/ZeroClipboard/ZeroClipboard.swf'});
        clip = new ZeroClipboard();
        clip.on('load', function(client) {
            clip.reposition();
            console.log("loaded");
        });
        clip.on('mousedown', function(client, args) {
            clip.reposition();
            clip.setText(msg);
            console.log("Copied: " + msg);
        });
        clip.glue(me);
    }

    function removeSelectedFeature() {
        if (listSelectedFeatures !== null) {

            if (listSelectedFeatures instanceof Array) {
                console.log("1")
                var vectorLayer;
                $.each(listSelectedFeatures, function(key, feature) {
                    vectorLayer = map.getLayer(feature.layer.id);
                    vectorLayer.removeFeatures(feature);
                    vectorLayer.redraw();
                });
            }
        }
    }

    function controlManager(thisElementName, lastAction) {
        var tmp;
        var name = thisElementName;
        if (lastAction === "information-get") {
            map.events.unregister('click', map, getFeatureInfo);
        }
        if (name !== undefined) {
            if (name !== "draw-clear") {
                $(toolbar).find("a.gp-button-active").addClass("gp-button-deactive");
                $(toolbar).find("a.gp-button-active").removeClass("gp-button-active");
            }

            // Case: measure
            if (name.search("measure") >= 0) {
                tmp = $("#measuremenu").parent('a');
                $("#" + name).parent().addClass("gp-button-active");
                $("#" + name).parent().removeClass("gp-button-deactive");
                toggleControl(name);
                $(tmp).addClass("gp-button-active");
                $(tmp).removeClass("gp-button-deactive");
                // Case: draw
            } else if (name.search("draw") >= 0) {
                tmp = $("#drawmenu").parent();
                if (name.search("clear") >= 0) {
                    removeSelectedFeature();
                } else if (name.search("modify") >= 0) {
                    if (listSelectedFeatures !== null) {
                        gp_controls.draw.modify.selectFeature(listSelectedFeatures[0]);
                    }
                    toggleControl(name);
                    $("#" + name).parent().addClass("gp-button-active");
                    $("#" + name).parent().removeClass("gp-button-deactive");
                    $(tmp).addClass("gp-button-active");
                    $(tmp).removeClass("gp-button-deactive");
                } else if (name.search("drag") >= 0) {
                    toggleControl(name);
                    $("#" + name).parent().addClass("gp-button-active");
                    $("#" + name).parent().removeClass("gp-button-deactive");
                    $(tmp).addClass("gp-button-active");
                    $(tmp).removeClass("gp-button-deactive");
                } else if (name.search("export") >= 0) {
                    var kml = GetKMLFromFeatures(drawLayer.features);
                    if ($("#kmldialog").length) {
                        console.log('esisto')
                        updateKml(kml);
                    } else {
                        console.log('nn esisto')
                        generateDialog(kml);
                    }
                    $("#kmldialog").dialog("open");
                    exportKml();
                } else {
                    toggleControl(name);
                    $("#" + name).parent().addClass("gp-button-active");
                    $("#" + name).parent().removeClass("gp-button-deactive");
                    $(tmp).addClass("gp-button-active");
                    $(tmp).removeClass("gp-button-deactive");
                }

                // Case: Information
            } else if (name.search("information") >= 0) {
                tmp = $("#informationmenu").parent();
                if (name.search("get") >= 0) {
                    map.events.register('click', map, getFeatureInfo);
                } else {
                    map.events.unregister('click', map, getFeatureInfo);
                    layerFeatureInfo.removeAllFeatures();
                }
                $("#" + name).parent().addClass("gp-button-active");
                $("#" + name).parent().removeClass("gp-button-deactive");
                toggleControl("disableall");
                $(tmp).addClass("gp-button-active");
                $(tmp).removeClass("gp-button-deactive");
                // Case: permalink
            } else if (name === "permalink") {
                $("#permalink-content").dialog({
                    title: "Permalink",
                    resizable: false,
                    modal: true,
                    width: 600,
                    height: 200,
                    zIndex: 1100,
                    open: function() {
                        var url, a;
                        var element = $(this);
                        var loc = window.location;
                        var layers = new Array();
                        var layersName = new Array();
                        var nodes = $("#over-layers").dynatree("getSelectedNodes");
                        $.each(nodes, function(key, node) {
                            layers.push(node.data.key);
                            layersName.push(node.data.title)
                        });

                        var lonlat = map.getExtent().getCenterLonLat();

                        var options = JSON.stringify({
                            lon: lonlat.lon,
                            lat: lonlat.lat,
                            zoom: map.zoom,
                            layers: layers.join(";"),
                            lName: layersName.join(";") 
                        });
                        $.getJSON(dispatcherUrl, {
                            a: "getPermalink",
                            o: options
                        }).done(function(data) {
                            url = loc.protocol + "//" + loc.host + loc.pathname + data;
                            a = $('<a>').attr('href', url);
                            if (url.length > 70) {
                                $(a).html(url.substring(0, 70) + "...");
                            } else {
                                $(a).html(url);
                            }
                            $(element).append(a);
                            $(element).css('font-size', '12px');
                        });
                    },
                    close: function() {
                        $(this).empty();
                    }
                });
                $(tmp).addClass("gp-button-active");
                $(tmp).removeClass("gp-button-deactive");
                //Print
            } else if (name === "print") {

                //Else...
            } else {
                toggleControl(name);
                tmp = $("#" + name).parent();
                $(tmp).addClass("gp-button-active");
                $(tmp).removeClass("gp-button-deactive");
            }
        }
    }

    function GetKMLFromFeatures(features) {
        var format = new OpenLayers.Format.KML({
            'maxDepth': 10,
            'extractStyles': true,
            'internalProjection': map.baseLayer.projection,
            'externalProjection': new OpenLayers.Projection("EPSG:4326")
        });

        return format.write(features);
    }

    function exportKml() {
        //$("#downloadify").downloadify({
        Downloadify.create('kmldownload', {
            filename: function() {
                var d = new Date();
                var today = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
                return 'geopod_kml_' + today + '.txt';

            },
            data: function() {
                return GetKMLFromFeatures(drawLayer.features);
            },
            onComplete: function() {
                alert('Your File Has Been Saved!');
            },
            onCancel: function() {
                alert('You have cancelled the saving of this file.');
            },
            onError: function() {
                alert('You must put something in the File Contents or there will be nothing to save!');
            },
            swf: 'js/Downloadify/media/downloadify.swf',
            downloadImage: 'js/Downloadify/images/download_2.png',
            width: 100,
            height: 30,
            transparent: true,
            append: false
        });
    }

    function updateKml(data) {
        $('#kmltext').html(data);
    }
    function generateDialog(data) {
        var div = $('<div>').attr('id', 'kmldialog');
        var textarea = $('<textarea>').attr('id', 'kmltext').html(data);
        var buttonDonwload = $('<p>').attr({
            id: 'kmldownload',
        });
        $(div).append(textarea);
        $(div).append(buttonDonwload);

        $(div).dialog({
            title: "Exporter en format KML",
            autoOpen: false,
            height: 300,
            width: 500,
            modal: true

        });
    }
    //END
});
