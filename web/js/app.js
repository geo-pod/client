/** ***************************************************************************
 * Variable initializer & variable declaration
 *************************************************************************** */
//OpenLayers variable
var map, layerToEdit, myWms, baseLayer, layerFeatureInfo = null, drawLayers;
var gp_controls; // = new Array();
var GP_LAT, GP_LON, GP_ZOOM, GP_MAX_BBOX;
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
        controls: [],
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
            strokeColor: "#f67b17", //f67b17
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
    var drawPointLayer = new OpenLayers.Layer.Vector("Point Layer");
    var drawLineLayer = new OpenLayers.Layer.Vector("Line Layer");
    var drawPolygonLayer = new OpenLayers.Layer.Vector("Polygon Layer");
    var drawboxLayer = new OpenLayers.Layer.Vector("Box layer");
    drawLayers = [drawPointLayer, drawLineLayer, drawPolygonLayer, drawboxLayer];

    map.addLayers([drawPointLayer, drawLineLayer, drawPolygonLayer, drawboxLayer]);
    // Controls user for drawing
    var drawControls = {
        point: new OpenLayers.Control.DrawFeature(drawPointLayer,
                OpenLayers.Handler.Point),
        line: new OpenLayers.Control.DrawFeature(drawLineLayer,
                OpenLayers.Handler.Path),
        polygon: new OpenLayers.Control.DrawFeature(drawPolygonLayer,
                OpenLayers.Handler.Polygon),
        box: new OpenLayers.Control.DrawFeature(drawboxLayer,
                OpenLayers.Handler.RegularPolygon, {
            handlerOptions: {
                sides: 4,
                irregular: true
            }
        })
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
    //This method put the measure in the id: output
    function handleMeasurements(event) {
        var geometry = event.geometry;
        var units = event.units;
        var order = event.order;
        var measure = event.measure;
        var element = document.getElementById('output');
        var out = "";
        if (order === 1) {
            out += "measure: " + measure.toFixed(3) + " " + units;
        } else {
            out += "measure: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
        }
        element.innerHTML = out;
    }


    /**
     * This methode activate the control we clicked on
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
            } else {
                if (categoryKey === keyParent) {
                    control.activate();
                } else {
                    control.deactivate();
                }
            }
        });
    }

    /** *************************************************************************** -------------------------------------------------------------------------------------------
     * Vector Layers
     *************************************************************************** */
//    layerFeatureInfo = new OpenLayers.Layer.Vector("Feature Info");
//    style = {
//        fill: true,
//        fillColor: "#ff0000", // SLD: Fill
//        fillOpacity: 0.5,
//        strokeColor: "#ff0000", // SLD: Stroke
//        strokeWidth: 10
//    };
//    layerFeatureInfo.style = style;
//    map.addLayer(layerFeatureInfo);




//    layerFeatureInfo = new OpenLayers.Layer.Vector("info"); //, {
////        protocol: new OpenLayers.Protocol.HTTP({
////            url: "sqlapi.php",
////            format: new OpenLayers.Format.GeoJSON()
////        }),
////        strategies: [new OpenLayers.Strategy.Fixed()],
////        projection: new OpenLayers.Projection("EPSG:900913"),
////    });
//    layerFeatureInfo.style = style;
//    map.addLayer(layerFeatureInfo);


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
        lonlat = lonlat.transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'))

        var source = new Proj4js.Proj("EPSG:4326");
        var dest = new Proj4js.Proj("EPSG:21781");
        var p = new Proj4js.Point(lonlat.lon, lonlat.lat);
        Proj4js.transform(source, dest, p);
        var infoLonLat = "EPSG:21781: " + p.x.toFixed(2) + " | " + p.y.toFixed(2);
        OpenLayers.Util.getElement("mouse-position").innerHTML = infoLonLat;
    });
//    map.events.register("zoomend", map, function(e) {
//        console.log(map.zoom);
//    });

    console.log(map.events);
    /** ***************************************************************************
     * Loading all the public WMS from the GetCapabilities
     *************************************************************************** */
    var wms_url;
    $.getJSON(dispatcherUrl, {
        a: "getWmsUrl",
    }).done(function(data) {
        wms_url = data + "public/";
    });
    var options = JSON.stringify({
        schema: "public"
    });
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
                        wms_url,
                        {
                            layers: val.Name,
                            transparent: "true",
                            format: "image/png",
                            srs: "EPSG:900913"
                        },
                {isBaseLayer: false},
                {singleTile: false},
                {group: "test"}
                );
                map.addLayer(myWms);
                overLayers.children.push({title: val.Title, key: val.Name, select: true});
                var legendUrl = "http://eu1.mapcentia.com/wms/geopod/public/?LAYER=" + val.Name + "&SERVICE=WMS&VERSION=1.1.1&REQUEST=getlegendgraphic&FORMAT=image/png"
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
                    wms_url,
                    {
                        layers: val.Name,
                        transparent: "true",
                        format: "image/png",
                        srs: "EPSG:900913"
                    },
            {isBaseLayer: false},
            {singleTile: false},
            {group: "test"}
            );
            map.addLayer(myWms);
            overLayers.children.push({title: val.Title, key: val.Name, select: true});
        }
        addLayersTree(overLayers);
    });
//    lgpx = new OpenLayers.Layer.Vector(
//            "Traversée des Pyrénées", {
//        protocol: new OpenLayers.Protocol.HTTP({
//            url: "vector/pyrenees.gpx",
//            format: new OpenLayers.Format.GPX()
//        }),
//        strategies: [new OpenLayers.Strategy.Fixed()],
//        projection: new OpenLayers.Projection("EPSG:4326")
//    });
//    map.addLayer(lgpx);
//    overLayers.children.push({title: "Traversée des Pyrénées", key: "Traversée des Pyrénées", select: true});
//    console.log(overLayers);
//    addLayersTree(overLayers);


    /** ***************************************************************************
     * DynaTree
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
    $("#accordion").accordion({
        heightStyle: "content",
        collapsible: true
    });

    var toolbar = $("#menu");
    $("#menu").menu({
        position: {
            my: 'left top',
            at: 'left bottom'
        }
    });

    $("#menu li.ui-menu-item").click(function(event) {
        var child = $(this).find('a');

        if ($(child).hasClass("gp-button-deactive")) {
            var tmp;
            var name = $(this).find('span').attr('name');

            if (name !== undefined) {
                $(toolbar).find("a.gp-button-active").addClass("gp-button-deactive");
                $(toolbar).find("a.gp-button-active").removeClass("gp-button-active");
                
                // Case: measure
                if (name.search("measure") >= 0) {
                    tmp = $("#measuremenu").parent('a');
                    $("#" + name).parent().addClass("gp-button-active");
                    $("#" + name).parent().removeClass("gp-button-deactive");
                    toggleControl(name);
                // Case: draw
                } else if (name.search("draw") >= 0) {
                    tmp = $("#drawmenu").parent();
                    if (name.search("clear") >= 0) {
                        clearDrawLayer();
                    } else {
                        toggleControl(name);
                    }
                    $("#" + name).parent().addClass("gp-button-active");
                    $("#" + name).parent().removeClass("gp-button-deactive");
                // Case: Information
                } else if (name === "information") {
                    //-----------------------------------------------------------------------------------------------####################################################
                    //map.events.register('click', map, getFeatureInfo);
                    console.log("a")
                    map.events.unregister('click', map, getFeatureInfo);
                // Case: permalink
                } else if (name === "permalink") {
                    $("#permalink-content").dialog({
                        title: "Informations",
                        resizable: false,
                        modal: true,
                        width: 600,
                        height: 200,
                        zIndex: 1100,
                        open: function() {
                            var loc = window.location;
                            var url = loc.protocol + "//" + loc.host + loc.pathname + "?a=permalink&z=" + map.zoom + "&lat=345.6543234&lon=34.23456543&layers=private.parks;public.rivers,public.parcels";
                            var a = $('<a>').attr('href', url);
                            if (url.length > 70) {
                                $(a).html(url.substring(0, 70) + "...");
                            } else {
                                $(a).html(url);
                            }
                            $(this).append(a);
                            $(this).css('font-size', '12px');
                        }
                    });
                } else {
                    toggleControl(name);
                    tmp = $("#" + name).parent();
                }

                $(tmp).addClass("gp-button-active");
                $(tmp).removeClass("gp-button-deactive");

            }
        }
    });
    //END
});
function addLayersTree(children) {
    treeOverLayers = $("#over-layers").dynatree({
        checkbox: true,
        selectMode: 2,
        children: overLayers,
        onClick: function(node, event) {
            //console.log(event);
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

function hideLayer(layer) {
    layer.setVisibility(false);
    layer.display(false);
}

function showLayer(layer) {
    layer.setVisibility(true);
    layer.display(true);
}
function getFeatureInfo(e) {
//Check if the layer exists
    if (layerFeatureInfo === null) {
        layerFeatureInfo = new OpenLayers.Layer.Vector("Feature Info");
        style = {
            fill: true,
            fillColor: "#ff0000", // SLD: Fill
            fillOpacity: 0.3,
            strokeColor: "#16CAF2", // SLD: Stroke
            strokeWidth: 2
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
        tree = $("#over-layers").dynatree("getTree")


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
                        {"sTitle": ""}
                    ]
                });
            }

            $("#content").append(div);
            $('#myTable').dialog({
                title: "Informations",
                resizable: false,
                modal: true,
                width: 600,
                height: 400,
                zIndex: 3000,
//            open: function(event, ui) {
//                $('#data-table').css('overflow', 'hidden');
//            }
            });
        });
    } catch (e) {
        var value = 0;
        var div = $('<div>').attr('id', 'message');
        $(div).html("Pas de données")
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



function toClipboard(me, msg) {
    ZeroClipboard.setDefaults({moviePath: 'js/ZeroClipboard/ZeroClipboard.swf'});
    clip = new ZeroClipboard();
    clip.on('load', function(client) {
        clip.reposition();
        console.log("loaded")
    });
    clip.on('mousedown', function(client, args) {
        clip.reposition();
        clip.setText(msg);
        console.log("Copied: " + msg);
    })

    clip.glue(me);
}