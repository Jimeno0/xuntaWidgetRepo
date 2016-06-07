dojo.require("esri.map");dojo.require("esri.layers.ArcGISTiledMapServiceLayer");dojo.require("esri.layers.agsdynamic");dojo.require("esri.layers.wms");dojo.require("esri.layers.WMSLayerInfo");dojo.require("esri.layers.FeatureLayer");dojo.require("esri.tasks.geometry");dojo.require("esri.tasks.query");dojo.require("esri.tasks.GeometryService");dojo.require("esri.tasks.PrintTask");dojo.require("esri.tasks.identify");dojo.require("esri.dijit.InfoWindow");dojo.require("esri.dijit.Legend");dojo.require("esri.dijit.Bookmarks");dojo.require("esri.dijit.Print");dojo.require("esri.dijit.OverviewMap");dojo.require("esri.dijit.HomeButton");dojo.require("esri.dijit.Scalebar");dojo.require("esri.dijit.Geocoder");dojo.require("esri.dijit.Measurement");dojo.require("esri.symbols.Font");dojo.require("esri.symbols.TextSymbol");dojo.require("esri.symbols.SimpleFillSymbol");dojo.require("esri.symbols.SimpleLineSymbol");dojo.require("esri.symbols.SimpleMarkerSymbol");dojo.require("esri.InfoTemplate");dojo.require("dojo.date.locale");dojo.require("dojo.string");dojo.require("dojo.request");dojo.require("dojo.window");dojo.require("dojo.promise.all");dojo.require("dojox.mobile.parser");dojo.require("dojox.mobile");dojo.require("dojox.widget.TitleGroup");dojo.require("dijit.layout.ContentPane");dojo.require("dijit.form.HorizontalSlider");dojo.require("dijit.TitlePane");dojo.require("dijit.layout.BorderContainer");dojo.require("dijit.layout.AccordionContainer");dojo.require("dojo/i18n!esri/nls/jsapi");dojo.require("js.Config");dojo.require("js.Capas");dojo.require("js.date");dojo.requireLocalization("appPath", "texts");var baseMapLayers;var fontSize;var webMapId;var isBrowser = false;var isiOS = false;var isMobileDevice = false;var isTablet = false;var map;var messages;var tempGraphicsLayerId = "tempGraphicsLayerID";var mapSharingOptions;var useWebmap;var aCapas;var layerInfos = [];var infoWindow;var printer;var printServiceTask;var geometryService;var bookmark;var storageName = "esrijsapi_mapmarks";var useLocalStorage = supports_local_storage();var helpUrl;var legendDijit;var noElementFoundAlert;var nlsStrings;var geocoder;var measurement;var startExtent;var doIdentify = true;var xlsPath;var overviewURL;var printTemplates;function init() {
  ShowProgressIndicator();nlsStrings = dojo.i18n.getLocalization("appPath", "texts");dojo.byId("headerLink2").innerHTML = nlsStrings.T_VISOR_MAPAS;dojo.byId("headerLink2").title = nlsStrings.T_VISOR_MAPAS_TITLE;dojo.byId("imgLegend").title = nlsStrings.T_VISUALIZAR_LEYENDA;dojo.byId("imgLegend").alt = nlsStrings.T_VISUALIZAR_LEYENDA;dojo.byId("imgMedidas").title = nlsStrings.T_MEDIDAS;dojo.byId("imgMedidas").alt = nlsStrings.T_MEDIDAS;dojo.byId("imgNovaCapa").title = nlsStrings.T_NOVACAPA;dojo.byId("imgNovaCapa").alt = nlsStrings.T_NOVACAPA;dojo.byId("imgBuscaXeral").title = nlsStrings.T_BUSCAXERAL;dojo.byId("imgBuscaXeral").alt = nlsStrings.T_BUSCAXERAL;dojo.byId("imgListaCapas").title = nlsStrings.T_SELECCION_CAPAS;dojo.byId("imgListaCapas").alt = nlsStrings.T_SELECCION_CAPAS;dojo.byId("imgSelectBasemap").title = nlsStrings.T_SELECCION_MAPABASE;dojo.byId("imgSelectBasemap").alt = nlsStrings.T_SELECCION_MAPABASE;dojo.byId("imgBookmarks").title = nlsStrings.T_MARCADORES;dojo.byId("imgBookmarks").alt = nlsStrings.T_MARCADORES;dojo.byId("imgPrinter").title = nlsStrings.T_IMPRIMIR;dojo.byId("imgPrinter").alt = nlsStrings.T_IMPRIMIR;dojo.byId("imgSocial").title = nlsStrings.T_SOCIAL_MEDIA;dojo.byId("imgSocial").alt = nlsStrings.T_SOCIAL_MEDIA;dojo.byId("imgHelp").title = nlsStrings.T_AYUDA;dojo.byId("imgHelp").alt = nlsStrings.T_AYUDA;dojo.byId("BuscaXeralMenu").innerHTML = nlsStrings.T_BUSCAXERAL;dojo.byId("NovoServizoMenu").innerHTML = nlsStrings.T_NOVACAPA;dojo.byId("seleccionarCapasMenu").innerHTML = nlsStrings.T_SELECCION_CAPAS;dojo.byId("vistasMenu").innerHTML = nlsStrings.T_MAPABASE;dojo.byId("marcadoresMenu").innerHTML = nlsStrings.T_MARCADORES;dojo.byId("compartirMapaMenu").innerHTML = nlsStrings.T_SOCIAL_MEDIA;dojo.byId("menuLeyenda").innerHTML = nlsStrings.T_LEYENDA;noElementFoundAlert = nlsStrings.T_NO_RESULTADO;dojo.byId("pie_1").innerHTML = nlsStrings.T_PIE_1;dojo.byId("pie_2").innerHTML = nlsStrings.T_PIE_2;dojo.byId("pie_2_link").title = nlsStrings.T_PIE_2;dojo.byId("pie_3").innerHTML = nlsStrings.T_PIE_3;dojo.byId("pie_3_link").title = nlsStrings.T_PIE_3;dojo.byId("pie_4").innerHTML = nlsStrings.T_PIE_4;dojo.byId("pie_4_link").title = nlsStrings.T_PIE_4;esri.config.defaults.io.proxyUrl = location.pathname.replace(/\/[^/]+$/, "") + "/proxy/proxy.php";esri.config.defaults.io.alwaysUseProxy = false;esri.config.defaults.io.timeout = 180000;var b = window.navigator.userAgent;if (b.indexOf("iPhone") >= 0 || b.indexOf("iPad") >= 0) {
    fontSize = 14;isTablet = true;dojo.byId("dynamicStyleSheet").href = "styles/tablet.css";
  }if (b.indexOf("Android") >= 0) {
    fontSize = 15;isMobileDevice = true;dojo.byId("dynamicStyleSheet").href = "styles/mobile.css";
  } else {
    if (b.indexOf("iPad") >= 0) {
      fontSize = 14;isTablet = true;dojo.byId("dynamicStyleSheet").href = "styles/tablet.css";
    } else {
      fontSize = 11;isBrowser = true;dojo.byId("dynamicStyleSheet").href = "styles/browser.css";
    }
  }window.onkeydown = function (d) {
    return !(d.keyCode == 9);
  };var c = new js.Capas();InitializeCapas(c);var a = new js.Config();Initialize(a);HideProgressIndicator();
}function CheckBrowser(b) {
  var a = false;if (dojo.isIE >= b.supportIEVersion || dojo.isFF >= b.supportFFVersion || dojo.isChrome >= b.supportChromeVersion || dojo.isSafari >= b.supportSafariVersion) {
    a = true;
  }return a;
}function Initialize(responseObject) {
  if (isMobileDevice) {
    dojo.byId("divAddressContainer").style.height = "0px";
  } else {
    dojo.byId("divAddressContainer").style.display = "block";
  }dojo.xhrGet({ url: "ErrorMessages.xml", handleAs: "xml", preventCache: true, load: function load(xmlResponse) {
      messages = xmlResponse;
    } });map = new esri.Map("map", { slider: true, infoWindow: infoWindow, logo: false });dojo.connect(map, "onLoad", function () {
    var zoomExtent;var extent = GetQuerystring("extent");if (extent != "") {
      zoomExtent = extent.split(",");
    } else {
      zoomExtent = responseObject.DefaultExtent.split(",");
    }startExtent = new esri.geometry.Extent(parseFloat(zoomExtent[0]), parseFloat(zoomExtent[1]), parseFloat(zoomExtent[2]), parseFloat(zoomExtent[3]), map.spatialReference);map.setExtent(startExtent);if (!useWebmap) {
      MapInitFunction();pinta();
    }var entradaX = location.href.match(/[\?\&]X=([^\&]+)/gi);var entradaY = location.href.match(/Y=([^\&]+)/gi);var entradaXY = entradaX + ";" + entradaY;entrada1 = entradaXY.match(/X/gi);entrada2 = entradaXY.match(/Y/gi);entrada = entrada1 + "," + entrada2;if (entrada.toLowerCase() == "x,y") {
      var Variables = entradaXY.toLowerCase();Variables = Variables.substr(1);Variables = Variables.split(";");for (i = 0; i < Variables.length; i++) {
        Separ = Variables[i].split("=");eval("var " + Separ[0] + '="' + Separ[1] + '"');
      }x = x.replace(",", ".");y = y.replace(",", ".");if (x != "" && y != "") {
        gotoXY(x, y);
      } else {
        return false;
      }
    }
  });dojo.connect(map, "onExtentChange", function (extent, delta, levelChange, lod) {
    var scale = esri.geometry.getScale(map).toFixed(0);dojo.byId("escalanum").innerHTML = "Escala: 1:" + scale;if (dojo.coords("divAppContainer").h > 0) {
      ShareLink(false);
    }
  });dojo.connect(dojo.byId("map"), "resize", function () {
    var resizeTimer;clearTimeout(resizeTimer);resizeTimer = setTimeout(function () {
      map.resize();map.reposition();
    }, 500);
  });geometryService = new esri.tasks.GeometryService(responseObject.GeometryService);esri.config.defaults.geometryService = geometryService;baseMapLayers = responseObject.BaseMapLayers;mapSharingOptions = responseObject.MapSharingOptions;xlsPath = nlsStrings.T_XLS_PATH;printServiceTask = responseObject.PrintServiceTask;helpUrl = responseObject.HelpURL;overviewURL = responseObject.OverviewMapLayerURL;printTemplates = responseObject.PrintTemplates;CreateBaseMapComponent();dojo.connect(dojo.byId("imgHelp"), "onclick", function () {
    var loc = "gl";if (result && result[1] == "es") {
      loc = "es";
    }window.open(responseObject.HelpURL + "?locale=" + loc);
  });
}function InitializeCapas(a) {
  aCapas = a.Capas;
}function MapInitFunction() {
  if (isMobileDevice) {
    SetHeightAddressResults();SetHeightComments();SetHeightViewDetails();SetHeightViewDirections();SetHeightCmtControls();
  }var n = new esri.layers.GraphicsLayer({ displayOnPan: isBrowser ? false : true });n.id = tempGraphicsLayerId;map.addLayer(n);dojo.connect(map, "onLayerAdd", function (z) {
    var C = [];for (var w = 0; w < aCapas.Categorias.length; w++) {
      var u = aCapas.Categorias[w];for (var v = 0; v < u.servicios.length; v++) {
        var q = u.servicios[v].LegendURL;if (u.servicios[v].id == z.id) {
          if (u.servicios[v].leyenda) {
            if (u.servicios[v].Tipo == "WMS") {
              var A = aCapas.Categorias[w].categoria;A = A.replace(/ /g, "_").replace(/"/g, "").replace(/'/g, "").replace(/\(/g, "").replace(/\)/g, "");$("#leyendaWMS").append('<table id="tblegwmsfijo' + A + '"></table>');var t = document.getElementById("tblegwmsfijo" + A).getElementsByTagName("tr").length;if (t == 0) {
                $("#tblegwmsfijo" + A).append('<tr id="trcat_' + A + '"><td colspan="2"><b>' + A + "</b></td></tr>");
              }var s = u.servicios[v].Texto;var p = s.replace(/ /g, "_");var B;if (q) {
                B = '<img id="imglayer" src="' + q + '">';
              } else {
                B = "";
              }$("#tblegwmsfijo" + A).append('<tr id="div_' + p + '"><td>' + B + "</td><td>" + s + "</td></tr>");
            } else {
              var r = { layer: z, title: u.servicios[v].Texto };C.push(r);
            }
          }
        } else {
          var D = map.getLayer(u.servicios[v].id);if (D && u.servicios[v].leyenda) {
            if (u.servicios[v].Tipo == "Tiled" || u.servicios[v].Tipo == "Dynamic") {
              var r = { layer: D, title: u.servicios[v].Texto };C.push(r);
            }
          }
        }
      }
    }if (legendDijit) {
      legendDijit.layerInfos = C;legendDijit.refresh();
    } else {
      legendDijit = new esri.dijit.Legend({ map: map, layerInfos: C }, "leyendaEsri");legendDijit.startup();
    }
  });dojo.connect(map, "onLayerRemove", function (A) {
    var C = [];for (var w = 0; w < aCapas.Categorias.length; w++) {
      var u = aCapas.Categorias[w];for (var v = 0; v < u.servicios.length; v++) {
        if (u.servicios[v].id == A.id && u.servicios[v].Tipo == "WMS") {
          var B = aCapas.Categorias[w].categoria;B = B.replace(/ /g, "_").replace(/"/g, "").replace(/'/g, "").replace(/\(/g, "").replace(/\)/g, "");var r = u.servicios[v].Texto;var p = r.replace(/ /g, "_");var z = document.getElementById("div_" + p);if (z) {
            z.parentNode.removeChild(z);
          }var t = document.getElementById("tblegwmsfijo" + B).getElementsByTagName("tr").length;if (t == 1) {
            var s = document.getElementById("tblegwmsfijo" + B);s.parentNode.removeChild(s);
          }
        } else {
          if (u.servicios[v].id != A.id) {
            var D = map.getLayer(u.servicios[v].id);if (D && u.servicios[v].leyenda) {
              if (u.servicios[v].Tipo == "Tiled" || u.servicios[v].Tipo == "Dynamic") {
                var q = { layer: D, title: u.servicios[v].Texto };C.push(q);
              }
            }
          }
        }
      }
    }legendDijit.layerInfos = C;legendDijit.refresh();
  });dojo.connect(map, "onMouseMove", showCoordinates);dojo.connect(map, "onMouseDrag", showCoordinates);dojo.connect(map, "onClick", executeIdentify);dojo.connect(map.infoWindow, "onShow", function () {
    dijit.byId("tabs").resize();
  });map.infoWindow.resize(600, 200);map.infoWindow.setContent(dijit.byId("tabs").domNode);map.infoWindow.setTitle(nlsStrings.T_RESULTADOS);dojo.connect(map.infoWindow, "onMaximize", function () {
    dijit.byId("tabs").resize();dojo.query(".contentPane", dojo.byId("map_root"))[0].style.height = "auto";
  });dojo.connect(map.infoWindow, "onRestore", function () {
    dijit.byId("tabs").resize();
  });dojo.connect(map.infoWindow, "onHide", function () {
    geometries = [];map.graphics.clear();
  });createCheckBoxes();var g = { measurement: { NLS_area: nlsStrings.T_AREA, NLS_area_acres: nlsStrings.T_ACRES, NLS_area_sq_feet: nlsStrings.T_PIES_CUADRADOS, NLS_area_sq_kilometers: nlsStrings.T_KILOMETROS_CUADRADOS, NLS_area_hectares: nlsStrings.T_HECTAREAS, NLS_area_sq_meters: nlsStrings.T_METROS_CUADRADOS, NLS_area_sq_miles: nlsStrings.T_MILLAS_CUADRADAS, NLS_area_sq_yards: nlsStrings.T_YARDAS_CUADRADAS, NLS_length_kilometers: nlsStrings.T_KILOMETROS, NLS_distance: nlsStrings.T_DISTANCIA, NLS_resultLabel: nlsStrings.T_RESULTADO_MEDICION, NLS_length_feet: nlsStrings.T_PIES, NLS_length_meters: nlsStrings.T_METROS, NLS_length_miles: nlsStrings.T_MILLAS, NLS_length_yards: nlsStrings.T_YARDAS } };dojo.mixin(esri.bundle.widgets, g);var f = { print: { NLS_print: "Imprimir", NLS_printing: nlsStrings.T_IMPRIMIENDO, NLS_printout: nlsStrings.T_IMPRESO } };dojo.mixin(esri.bundle.widgets, f);var j = { legend: { NLS_noLegend: nlsStrings.T_NO_LEYENDA } };dojo.mixin(esri.bundle.widgets, j);var o = { Geocoder: { main: { clearButtonTitle: nlsStrings.T_BORRAR_BUSCA, searchButtonTitle: nlsStrings.T_BUSCAR, geocoderMenuButtonTitle: "", geocoderMenuCloseTitle: "", geocoderMenuHeader: "", untitledGeocoder: "" } } };dojo.mixin(esri.bundle.widgets, o);var h = { overviewMap: { NLS_drag: "", NLS_noLayer: nlsStrings.T_NO_RESULTADO, NLS_noMap: nlsStrings.T_NO_RESULTADO, NLS_hide: nlsStrings.T_OCULTAR_OVERVIEW, NLS_show: nlsStrings.T_MOSTRAR_OVERVIEW, NLS_invalidSR: "", NLS_invalidType: "", NLS_maximize: "", NLS_restore: "" } };dojo.mixin(esri.bundle.widgets, h);var c = { bookmarks: { NLS_add_bookmark: nlsStrings.T_AGREGAR_MARCADOR, NLS_bookmark_edit: nlsStrings.T_EDITAR, NLS_bookmark_remove: nlsStrings.T_BORRAR, NLS_new_bookmark: nlsStrings.T_NO_NAME } };dojo.mixin(esri.bundle.widgets, c);bookmark = new esri.dijit.Bookmarks({ map: map, bookmarks: [], editable: true }, dojo.byId("bookmarks"));dojo.connect(bookmark, "onEdit", refreshBookmarks);dojo.connect(bookmark, "onRemove", refreshBookmarks);if (useLocalStorage) {
    var b = window.localStorage.getItem(storageName);
  } else {
    var b = dojo.cookie(storageName);
  }if (b && b != "null" && b.length > 4) {
    console.log("cookie: ", b, b.length);var l = dojo.fromJson(b);dojo.forEach(l, function (p) {
      bookmark.addBookmark(p);
    });
  }geocoder = new esri.dijit.Geocoder({ map: map, sourceCountry: "ESP", autoComplete: true }, "search");geocoder.startup();$("#buscar").show();dojo.connect(geocoder, "select", function (r) {
    if (r && r.feature) {
      var t = r.feature.geometry.x;var s = r.feature.geometry.y;if (t < 291000 || t > 868605 || s < 4569700 || s > 4885600 || t == "NaN" || s == "NaN") {
        e.home();return false;
      } else {
        map.graphics.clear();var q = new esri.symbol.PictureMarkerSymbol("images/pin_azul.png", 40, 40);var p = new esri.Graphic(r.feature.geometry, q);map.graphics.add(p);
      }
    }
  });var a = new esri.dijit.OverviewMap({ map: map, attachTo: "bottom-right", visible: false, baseLayer: new esri.layers.ArcGISTiledMapServiceLayer(overviewURL) });a.startup();a.show();measurement = new esri.dijit.Measurement({ map: map, defaultAreaUnit: esri.Units.SQUARE_KILOMETERS, defaultLengthUnit: esri.Units.KILOMETERS }, dojo.byId("measurementDiv"));measurement.startup();measurement.hideTool("location");measurement.setTool("area", true);measurement.setTool("area", false);var m = new esri.geometry.Extent(291000, 4569700, 868605, 4885600, new esri.SpatialReference({ wkid: 25829 }));var e = new esri.dijit.HomeButton({ map: map, extent: m }, "HomeButton");e.startup();dojo.query(".home")[0].title = nlsStrings.T_EXTENSION;var d = new esri.dijit.Scalebar({ map: map, attachTo: "bottom-left", scalebarUnit: "metric" });
}function getMapLayers() {
  var a = new Array();dojo.forEach(map.layerIds, function (d) {
    var c = map.getLayer(d);var b = c.id;b = b.replace(/ /g, "_");if (c.visible === true) {
      a.push(b);
    }
  });return a;
}function infoAddWMS(f, d, a, b) {
  X = f.layerX;Y = f.layerY;nomecapas = a.toString();nomecapas = encodeURI(nomecapas);var c = esri.request({ url: d, content: { REQUEST: "GetFeatureInfo", LAYERS: nomecapas, QUERY_LAYERS: nomecapas, FEATURE_COUNT: "10", VERSION: "1.1.1", SRS: "EPSG:25829", BBOX: map.extent.xmin + "," + map.extent.ymin + "," + map.extent.xmax + "," + map.extent.ymax, WIDTH: map.width, HEIGHT: map.height, X: X, Y: Y, INFO_FORMAT: "text/html" }, handleAs: "text" });c.then(function (e) {
    ventana(e, f, b);document.body.style.cursor = "default";map.setMapCursor("default");
  }, function (e) {
    alert(e.responseText);
  });
}function aCapasWMS(a) {
  if ($("#check_" + a).prop("checked") == false) {
    $("#check_" + a).prop("checked", true);
  } else {
    $("#check_" + a).prop("checked", false);
  }dojo.connect(map, "onClick", function (h) {
    if ($("#check_" + a).is(":checked")) {
      var l = h.mapPoint;var b = h;var n = map.extent;var m;var g;var f = [];var c = aCapas.Categorias[a];for (var d = 0; d < c.servicios.length; d++) {
        var o = map.getLayer(c.servicios[d].id);if (o && c.servicios[d].Tipo === "WMS") {
          m = c.categoria;g = c.servicios[d].servicioURL;if (c.servicios[d].identify) {
            if (g) {
              f.push(c.servicios[d].idCapa);
            }
          }
        }
      }if (f.length >= 0) {
        infoAddWMS(h, g, f, m);
      } else {
        return false;
      }
    } else {
      return false;
    }
  });
}function ventana(n, h, m) {
  map.graphics.clear();var d = h.clientX;var c = h.clientY;var b = h.mapPoint.x;var a = h.mapPoint.y;var j = new esri.geometry.Point(b, a, map.spatialReference);var g = new esri.symbol.SimpleMarkerSymbol({ color: [5, 126, 181, 255], size: 8, angle: -50, xoffset: 0, yoffset: 0, type: "esriSMS", style: "esriSMSSquare", outline: { color: [255, 255, 255, 255], width: 1, type: "esriSLS", style: "esriSLSSolid" } });var f = new esri.Graphic(j, g);var l;if (n != "") {
    n == n;
  } else {
    n = "Non existe contido";
  }if (n.search("http://www.esri.com/wms") >= 0) {
    n = $(n).filter("table");n = $(n).removeAttr("border").attr("class", "tablaesri");
  } else {
    if (n.search("sedecatastro.gob.es") >= 0) {
      n = n.replace("href", "target='_blank' href");
    } else {
      if (n.search("./estilos/estilos_mapa.css") >= 0) {
        n = n.replace("./estilos/estilos_mapa.css", "http://wms.magrama.es/sig/Agua/Demarcaciones/estilos/estilos_mapa.css");l = window.open("", "ventana", "width=400, height=300, top=" + h.screenY + ",left=" + h.screenX);l.document.write(n);return false;
      } else {
        n == n;
      }
    }
  }$(document).ready(function () {
    var e = $("#dialog");e.html(n);e.dialog("option", "position", [d - 10, c]);e.css("overflow", "auto");e.dialog("open");map.graphics.add(f);e.dialog({ title: m, autoOpen: false, width: 350, height: 200, resizable: false, hide: "fade", modal: false, draggable: true, close: function close() {
        map.graphics.clear();
      } });
  });
}var spoint;var toIdentify = [];var geometries = [];function executeIdentifyMyRest(j, h, b, f, g) {
  if (doIdentify) {
    geometries = [];map.setMapCursor("wait");var m, c, n, d, l;n = j.mapPoint;spoint = j.screenPoint;d = map.extent.getWidth() / map.width;l = 3 * d;c = new esri.geometry.Extent({ xmin: n.x - l, ymin: n.y - l, xmax: n.x + l, ymax: n.y + l, spatialReference: n.spatialReference });var o = [];toIdentify = [];var a = new esri.tasks.IdentifyTask(h);toIdentify.push(g);identifyParams = new esri.tasks.IdentifyParameters();identifyParams.tolerance = 3;identifyParams.returnGeometry = true;identifyParams.layerIds = f;identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;identifyParams.width = map.width;identifyParams.height = map.height;identifyParams.geometry = c;identifyParams.mapExtent = map.extent;o.push(a.execute(identifyParams));m = new dojo.promise.all(o);m.then(handleIdentifyResults);
  }
}function executeIdentify(h) {
  map.graphics.clear();if (doIdentify) {
    geometries = [];map.setMapCursor("wait");var m, b, n, f, l;n = h.mapPoint;spoint = h.screenPoint;f = map.extent.getWidth() / map.width;l = 3 * f;b = new esri.geometry.Extent({ xmin: n.x - l, ymin: n.y - l, xmax: n.x + l, ymax: n.y + l, spatialReference: n.spatialReference });var p = [];toIdentify = [];for (var g = 0; g < aCapas.Categorias.length; g++) {
      var d = aCapas.Categorias[g];for (var c = 0; c < d.servicios.length; c++) {
        var o = map.getLayer(d.servicios[c].id);if (o && d.servicios[c].identify) {
          if (d.servicios[c].Tipo === "WMS") {
            break;
          }var a = new esri.tasks.IdentifyTask(d.servicios[c].servicioURL);toIdentify.push(d.servicios[c]);identifyParams = new esri.tasks.IdentifyParameters();identifyParams.tolerance = 3;identifyParams.returnGeometry = true;if (d.servicios[c].idCapa !== undefined) {
            identifyParams.layerIds = [d.servicios[c].idCapa];
          }identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_VISIBLE;identifyParams.width = map.width;identifyParams.height = map.height;identifyParams.geometry = b;identifyParams.mapExtent = map.extent;p.push(a.execute(identifyParams));
        }
      }
    }m = new dojo.promise.all(p);m.then(handleIdentifyResults);
  }
}function handleIdentifyResults(d) {
  geometries = [];var o = "";var h = "";var n = dijit.byId("tabs");var a = n.getChildren();for (var e = 0; e < a.length; e++) {
    n.removeChild(a[e]);
  }dijit.byId("tabs").innerHTML = "";dojo.byId("tabs").style.height = "auto";dojo.byId("tabs").style.width = "auto";var g = 0;for (var e = 0; e < d.length; e++) {
    h = "";var f = "";var l = 0;for (var c = 0; c < d[e].length; c++) {
      if (d[e][c].layerName != f) {
        if (f != "") {
          h += "</table><br>";
        }h += "<p style='padding-left:12px'>Capa: <span style='text-decoration: underline;'>" + d[e][c].layerName + "</span></p>";h += "<table style='margin:10px; height:auto; width:auto; text-align:center; overflow:scroll;border-spacing: 3px;'>";h += "<tr style='background-color:#666; color:#fff'><th style='background-color:#fff'></th>";for (var m in d[e][c].feature.attributes) {
          if (m != "OBJECTID" && m.toLowerCase() != "shape" && m.toLowerCase() != "shape_leng" && m.toLowerCase() != "shape_area" && m.toLowerCase() != "shape_length") {
            h += "<th>" + m + "</th>";
          }
        }h += "</tr>";l = 0;
      }if (l % 2 == 0) {
        h += "<tr>";
      } else {
        h += "<tr style='background-color:#EEE'>";
      }geometries.push(d[e][c].feature.geometry);h += "<td><a href='javascript:zoomToGeometry(" + g + ")'>Zoom</a></td>";for (var m in d[e][c].feature.attributes) {
        if (m != "OBJECTID" && m.toLowerCase() != "shape" && m.toLowerCase() != "shape_leng" && m.toLowerCase() != "shape_area" && m.toLowerCase() != "shape_length") {
          h += "<td>" + d[e][c].feature.attributes[m] + "</td>";
        }
      }h += "</tr>";f = d[e][c].layerName;g++;l++;
    }if (h != "") {
      h += "</table><br>";var b = new dijit.layout.ContentPane({ title: toIdentify[e].Texto, content: h });dijit.byId("tabs").addChild(b);
    } else {
      map.infoWindow.hide();
    }
  }if (h != "" || g > 0) {
    map.infoWindow.show(spoint, map.getInfoWindowAnchor(spoint));
  }map.setMapCursor("default");
}function zoomToGeometry(b) {
  map.graphics.clear();var d = geometries[b];var c;if (d.type == "polyline") {
    c = new esri.symbol.SimpleLineSymbol();
  } else {
    if (d.type == "polygon") {
      c = new esri.symbol.SimpleFillSymbol();
    } else {
      c = new esri.symbol.SimpleMarkerSymbol();
    }
  }var a = new esri.Graphic(d, c);map.graphics.add(a);if (d.type == "point") {
    map.centerAndZoom(d, 9);
  } else {
    map.setExtent(d.getExtent().expand(1.2));
  }
}var contaprint = -1;function urlimpresion() {
  if ($("div:contains(" + nlsStrings.T_IMPRIMIENDO + ")").length > 0 || $("div:contains(" + nlsStrings.T_IMPRESO + ")").length > 0) {
    return false;
  } else {
    var h = [];h = dijit.byId("dijit_form_ComboButton_0");if (h) {
      printer.destroy();
    }contaprint++;for (var c = 0, j = map.layerIds.length; c < j; c++) {
      var e = map.getLayer(map.layerIds[c]);var d = e.url;var g = d.indexOf(ServidorCapasIDEG);if (g == -1 && e.visible) {
        printServiceTask = EsriPrintService;break;
      } else {
        printServiceTask = ServidorImpresion + "/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
      }
    }var b = esri.request({ url: printServiceTask, content: { f: "json" } });b.then(handlePrintInfo, handleError);
  }
}function handlePrintInfo(c) {
  var b = printTemplates;var a = dojo.map(b, function (e) {
    var d = new esri.tasks.PrintTemplate();d.layout = e.name;d.label = e.label;d.format = e.format;d.layoutOptions = e.options;return d;
  });printer = new esri.dijit.Print({ map: map, templates: a, url: printServiceTask }, dojo.byId("print_button"));printer.startup();
}function handleError(a) {
  console.log("Algo ha ido mal: ", a);
}function createCheckBoxes() {
  try {
    var r = dojo.byId("divAddressScrollContainer");var u = new dijit.layout.AccordionContainer({ style: "width:100%;height:90%" }, "divAddressScrollContainer");var v;for (var D = 0; D < aCapas.Categorias.length; D++) {
      var o = new dijit.layout.ContentPane({ title: aCapas.Categorias[D].categoria, doLayout: true });o.set("refreshOnShow", true);var t = document.createElement("div");var E = document.createElement("table");for (var C = 0; C < aCapas.Categorias[D].servicios.length; C++) {
        var s = aCapas.Categorias[D].servicios[C].Tipo;var d;if (s == "WMS") {
          d = true;
        } else {
          d = false;
        }var a = document.createElement("tr");var b = GetQuerystring("layers");if (b != "") {
          var f = aCapas.Categorias[D].servicios[C];f.Default = "false";var B = f.id;B = encodeURI(B.replace(/ /g, "_"));b = b.split(",");for (var w = 0; w < baseMapLayers.length; w++) {
            if (baseMapLayers[w].Key === b[0]) {
              var c = document.createElement("img");c.className = "basemapThumbnail";c.id = "imgThumbNail" + baseMapLayers[w].Key;c.setAttribute("layerId", baseMapLayers[w].Key);ChangeBaseMap(c);
            }
          }for (k = 0; k < b.length; k++) {
            if (B === b[k]) {
              f.Default = "true";
            }
          }
        }if (C % 2 == 0) {
          a.className = "evenrowcolor";
        } else {
          a.className = "oddrowcolor";
        }var G = CreateCheckBox("chk" + aCapas.Categorias[D].servicios[C].id, aCapas.Categorias[D].servicios[C].id, aCapas.Categorias[D].servicios[C].Default == "true", aCapas.Categorias[D].servicios[C], D, d);if (G == -1) {
          continue;
        }var m = document.createElement("td");m.style.width = "30px";m.align = "center";m.appendChild(G);a.appendChild(m);var l = document.createElement("td");l.style.width = "100%";l.align = "left";l.appendChild(document.createTextNode(aCapas.Categorias[D].servicios[C].Texto));a.appendChild(l);var h = document.createElement("td");var q = document.createElement("div");q.id = "slider" + D + C;q.style.width = "50px";h.appendChild(q);a.appendChild(h);var z = new dijit.form.HorizontalSlider({ name: aCapas.Categorias[D].servicios[C].id, value: aCapas.Categorias[D].servicios[C].opacity, minimum: 0, maximum: 1, intermediateChanges: true, style: "width:80px;height:12px;float:right;", onChange: function onChange(n) {
            var j = map.getLayer(this.name);if (j) {
              j.setOpacity(n);
            }dojo.byId("chk" + this.name).opacity = n;
          } }, q);z.startup();var g = document.createElement("td");var F = document.createElement("div");if (aCapas.Categorias[D].servicios[C].metadataURL != "") {
          F.id = aCapas.Categorias[D].categoria + "_" + aCapas.Categorias[D].servicios[C].Texto;F.className = "metadataImg";F.style.cursor = "pointer";F.setAttribute("onclick", "javascript:requestMetadata('" + aCapas.Categorias[D].servicios[C].metadataURL + "','" + F.id + "');");
        } else {
          F.className = "metadataImgGrey";
        }g.appendChild(F);a.appendChild(g);var e = document.createElement("td");var F = document.createElement("div");var H = document.createElement("img");var p = aCapas.Categorias[D].servicios[C].capazip;if (p && p != "") {
          F.id = aCapas.Categorias[D].categoria + "_" + aCapas.Categorias[D].servicios[C].Texto;H.src = "images/download.png";H.title = "descargar cartografia da capa";H.style.width = "14px";H.style.verticalAlign = "middle";F.style.cursor = "pointer";F.setAttribute("onclick", "javascript:window.open('" + p + "');");e.appendChild(F);F.appendChild(H);a.appendChild(e);
        } else {
          F.className = "";
        }E.appendChild(a);
      }t.appendChild(E);o.set("content", t);o.style.height = E.style.height;u.addChild(o);if (D == 0) {
        var v = o;
      }
    }u.startup();u.forward();u.back();
  } catch (A) {
    alert(A.message);
  }
}function CreateCheckBox(h, f, g, d, c, e) {
  var b = CreateLayer(d);if (!b) {
    return -1;
  }b.orden = d.orden;var a = document.createElement("input");a.type = "checkbox";a.id = h;a.checked = g;if (g) {
    AddLayerToMap(b, d.Texto);
  }a.value = f;a.name = "groupLayers_" + c;a.layer = b;a.opacity = d.opacity;a.onclick = function () {
    if (a.checked) {
      pinta2(c, e);b.setOpacity(this.opacity);AddLayerToMap(b, d.Texto);
    } else {
      pinta2(c, e);RemoverLayerFromMap(b);
    }
  };return a;
}dojo.ready(init);$(function () {
  $("#dialog").dialog({ autoOpen: false });
});$(function () {
  $("#acordeoBuscaXeral").accordion();
});
