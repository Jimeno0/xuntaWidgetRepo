var urlLimites="http://ideg.xunta.es/servizos/rest/services/LimitesAdministrativos/LimitesAdministrativos/MapServer";
define([
  'dojo/text!./templates/SubWidget.html',

  'dojo/_base/declare',

  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',

  'dojo/dom'
], function(
  template,

  declare,

  _WidgetBase,
  _TemplatedMixin,
  dom
) {
  return declare([_WidgetBase, _TemplatedMixin], {
    // description:
    //    Search Subwidget

    templateString: template,
    baseClass: 'sub-widget',

    // Properties to be sent into constructor

    postCreate: function() {
      // summary:
      //    Overrides method of same name in dijit._Widget.
      // tags:
      //    private
      console.log('widgets.wrapperXunta.SubWidget::postCreate', arguments);

      this.setupConnections();

      this.inherited(arguments);




// *****************************************
// busquedas.js
// *****************************************

function cargaConcellos(b) {
    $("#SelectMuni").children().remove();
    $("#SelectMuni").append('<option value="' + -1 + '">Seleccione concello</option>');
    $("#lupa_muni").hide();
    $("#lupa_muni").removeAttr("onclick");
    var d = [];
    var c = [];
    var a = esri.request({

        url: "http://mapas.xunta.es/visores/basico/json/concellos" + b + ".json",

        // url: "json/concellos" + b + ".json",
        content: {
            f: "json"
        },
        handleAs: "json",
        callbackParamName: "callback"
    });
    a.then(function(e) {
      debugger
        var g = e.features;
        $.each(g, function(i, l) {
            var m = l.attributes.codmuni;
            var k = l.attributes.nome;
            d.push(m);
            c.push(k)
        });
        var j = dojo.byId("SelectMuni");
        for (var f = 0; f < d.length; f++) {
            var h = document.createElement("option");
            h.value = d[f];
            h.text = c[f];
            j.add(h)
        }
        $("#trConcellos").show()
    })
}
function cargaParroquias(d) {
    $("#SelectParroquia").children().remove();
    $("#SelectParroquia").append('<option value="' + -1 + '">Seleccione Parroquia</option>');
    var c = [];
    var b = [];
    var a = esri.request({
        url: urlLimites + "/18/query?where=CodCONC =" + d + "&outFields=CODPARRO,PARROQUIA&orderByFields=PARROQUIA&returnGeometry=false&returnDistinctValues=true",
        content: {
            f: "json"
        },
        handleAs: "json",
        callbackParamName: "callback"
    });
    a.then(function(g) {
        var e = g.features;
        $.each(e, function(i, l) {
            var m = l.attributes.CODPARRO;
            var k = l.attributes.PARROQUIA;
            b.push(k);
            c.push(m)
        });
        var f = dojo.byId("SelectParroquia");
        for (var h = 0; h < c.length; h++) {
            var j = document.createElement("option");
            j.value = c[h];
            j.text = b[h];
            f.add(j)
        }
        $("#divParroquias").removeClass("precarga").addClass("buscador");
        $("#SelectParroquia").show()
    })
}
function cargaPoboacions(b) {
    $("#SelectPobo").children().remove();
    $("#SelectPobo").append('<option value="' + -1 + '">Seleccione Poboación</option>');
    $("#lupa_pobo").hide();
    $("#lupa_pobo").removeAttr("onclick");
    var d = [];
    var c = [];
    var a = esri.request({
        url: urlToponimia + "/9/query?where=CodPARRO=" + b + "&outFields=NOMBRE,OBJECTID&orderByFields=NOMBRE&returnGeometry=false&returnDistinctValues=true",
        content: {
            f: "json"
        },
        handleAs: "json",
        callbackParamName: "callback"
    });
    a.then(function(f) {
        var j = f.features;
        $.each(j, function(i, m) {
            var l = m.attributes.OBJECTID;
            d.push(l);
            var k = m.attributes.NOMBRE;
            c.push(k)
        });
        var e = dojo.byId("SelectPobo");
        for (var g = 0; g < c.length; g++) {
            var h = document.createElement("option");
            h.value = d[g];
            h.text = c[g];
            e.add(h)
        }
        $("#divPoboacions").removeClass("precarga").addClass("buscador");
        $("#SelectPobo").show()
    })
}
function consultaMuni(b, c) {
    var e = new esri.tasks.QueryTask(b);
    var d = new esri.tasks.Query();
    d.returnGeometry = true;
    var a = "CODCONC= " + c;
    d.where = a;
    e.execute(d, showResults);
    ShowBuscaXeral()
}
function consultaParroquia(b, e) {
    var d = new esri.tasks.QueryTask(b);
    var c = new esri.tasks.Query();
    c.returnGeometry = true;
    var a = "codPARRO = " + e;
    c.where = a;
    d.execute(c, showResults);
    ShowBuscaXeral()
}
function consultaPoboacion(b, e) {
    var d = new esri.tasks.QueryTask(b);
    var c = new esri.tasks.Query();
    c.returnGeometry = true;
    var a = "OBJECTID = " + e;
    c.where = a;
    d.execute(c, showResultsPoint);
    ShowBuscaXeral()
}
function showResults(a) {
    map.graphics.clear();
    var b = new esri.symbol.SimpleFillSymbol();
    dojo.forEach(a.features, function(d) {
        var c = new esri.Graphic(d.geometry,b);
        map.graphics.add(c);
        var e = esri.graphicsExtent(a.features);
        map.setExtent(e.getExtent().expand(1))
    })
}
function showResultsPoint(a) {
    map.graphics.clear();
    var b = new esri.symbol.SimpleMarkerSymbol();
    dojo.forEach(a.features, function(k) {
        var j = new esri.Graphic(k.geometry,b);
        var g = k.geometry.points;
        var e = g[0][0];
        var c = g[0][1];
        var i = new esri.geometry.Point(e,c,map.spatialReference);
        var f = new esri.symbol.Font("16pt",esri.symbol.Font.STYLE_NORMAL,esri.symbol.Font.VARIANT_NORMAL,esri.symbol.Font.WEIGHT_BOLD,"Arial");
        var d = new esri.symbol.TextSymbol(k.attributes.NOMBRE,f,"red");
        d.setAlign(esri.symbol.Font.ALIGN_START);
        var h = new esri.Graphic(i,d);
        map.graphics.add(h);
        map.setZoom(13);
        map.centerAt(i)
    })
}
function buscaCatastro(a) {
    $(document).ready(function() {
        var c = $(a);
        var b = c.val();
        $.ajax({
            url: "proxy/catastro_proxy.php",
            type: "GET",
            data: "RC=" + b,
            dataType: "xml",
            success: function(e) {
                var f = $(e);
                var d = f.find("xcen").text();
                var h = f.find("ycen").text();
                var g = f.find("des").text();
                if (d != "" & h != "") {
                    $("#X").val(d);
                    $("#Y").val(h);
                    gotoXY(d, h)
                } else {
                    if (g == "") {
                        g = nlsStrings.T_ERRORESPOSTACATASTRO
                    }
                    alert(g);
                    return false
                }
            },
            error: function(d) {
                alert(nlsStrings.T_ERRORESPOSTACATASTRO);
                return false
            }
        })
    })
}
function coordXY(a) {
    coord = a.split(",");
    x = coord[0];
    y = coord[1];
    gotoXY(x, y)
}
function gotoXY(c, e) {
    if (c < 291000 || c > 868605 || e < 4569700 || e > 4885600 || c == "NaN" || e == "NaN") {
        alert(nlsStrings.T_ERROCOORDENADAS);
        return false
    } else {
        map.graphics.clear();
        var b = new esri.geometry.Point(c,e,map.spatialReference);
        var d = new esri.symbol.SimpleMarkerSymbol({
            color: [255, 255, 255, 64],
            size: 16,
            angle: -30,
            xoffset: 0,
            yoffset: 0,
            type: "esriSMS",
            style: "esriSMSCircle",
            outline: {
                color: [255, 255, 0, 255],
                width: 3,
                type: "esriSLS",
                style: "esriSLSSolid"
            }
        });
        var a = new esri.Graphic(b,d);
        map.graphics.add(a);
        map.setZoom(13);
        map.centerAt(b)
    }
}
;


// ******************************************
// botones.js
// ******************************************

var idprov, idmun, idparro, idpobo;
$("#provincia1").change(function() {
    idprov = $(this).val();
    $("#trPoboacions").hide();
    $("#trParroquias").hide();
    if (idprov != -1) {
        $("#ui-accordion-acordeoBuscaXeral-panel-0").css("height", "auto");
        cargaConcellos(idprov)
    } else {
        $("#trConcellos").hide()
    }
});
$("#SelectMuni").change(function() {
    idmun = $(this).val();
    $("#trPoboacions").hide();
    if (idmun != -1) {
        $("#lupa_muni").show();
        $("#lupa_muni").removeAttr("onclick").attr("onclick", 'consultaMuni(urlLimites + "/12/query",' + idmun + ")");
        cargaParroquias(idmun);
        $("#SelectParroquia").hide();
        $("#trParroquias").show();
        $("#divParroquias").removeClass("buscador").addClass("precarga")
    } else {
        $("#trParroquias").hide();
        $("#lupa_muni").hide();
        $("#lupa_muni").removeAttr("onclick")
    }
});
$("#SelectParroquia").change(function() {
    idparro = $(this).val();
    if (idparro != -1) {
        $("#lupa_parroquia").removeAttr("onclick").attr("onclick", 'consultaParroquia(urlLimites + "/18/query",' + idparro + ")");
        $("#lupa_parroquia").show();
        cargaPoboacions(idparro);
        $("#SelectPobo").hide();
        $("#trPoboacions").show();
        $("#divPoboacions").removeClass("buscador").addClass("precarga")
    } else {
        $("#trPoboacions").hide();
        $("#lupa_parroquia").removeAttr("onclick");
        $("#lupa_parroquia").hide()
    }
});
$("#SelectPobo").change(function() {
    idpobo = $(this).val();
    if (idpobo != -1) {
        $("#lupa_pobo").removeAttr("onclick").attr("onclick", 'consultaPoboacion(urlToponimia + "/9/query",' + idpobo + ")");
        $("#lupa_pobo").show()
    } else {
        $("#lupa_pobo").removeAttr("onclick");
        $("#lupa_pobo").hide()
    }
});
$("#milupa_xy").click(function() {
    var a = $("#buscador_input_xy").val();
    coordXY(a)
});
$("#buscador_input_catastro").keydown(function(a) {
    if (this.value === "Ref. Catastral 14 caracteres") {
        this.value = "";
        if (a.which === 13) {
            $("#milupa_catastro").click()
        }
    }
    $(this).css({
        color: "#000000"
    });
    $("#borratexto_catastro").show()
});
$("#buscador_input_catastro").keypress(function(a) {
    if (a.which === 13) {
        $("#milupa_catastro").click()
    }
});
$("#borratexto_catastro").click(function() {
    $("#buscador_input_catastro").val("");
    $("#borratexto_catastro").hide();
    $(this).css({
        color: "#000000"
    })
});
$("#buscador_input_xy").keydown(function(a) {
    if (this.value === "Coord.X, Coord.Y") {
        this.value = "";
        if (a.which === 13) {
            $("#milupa_xy").click()
        }
    }
    $(this).css({
        color: "#000000"
    });
    $("#borratexto_xy").show()
});
$("#buscador_input_xy").keypress(function(a) {
    if (a.which === 13) {
        $("#milupa_xy").click()
    }
});
$("#borratexto_xy").click(function() {
    $("#buscador_input_xy").val("");
    $("#borratexto_xy").hide();
    $(this).css({
        color: "#000000"
    })
});
window.onclick = function() {
    $(".simpleGeocoder .esriGeocoder input").css("display", "none");
    $(".simpleGeocoder .esriGeocoderReset").css("display", "none");
    $(".simpleGeocoder .esriGeocoder").css("width", "30px");
    $(".simpleGeocoder .esriGeocoderContainer").css("width", "30px");
    $("#buscar").show()
}
;
$("#buscar").click(function(a) {
    $(".simpleGeocoder .esriGeocoder input").css("display", "block");
    $(".simpleGeocoder .esriGeocoder").css("width", "245px");
    $(".simpleGeocoder .esriGeocoderContainer").css("width", "245px");
    $("#buscar").hide();
    $(".simpleGeocoder .esriGeocoderReset").css("display", "block");
    $(".esriGeocoderReset esriGeocoderIcon").css("display", "block");
    a.stopPropagation()
});
$("#mapFinder").click(function(a) {
    a.stopPropagation()
});
$("#urlservicio").keydown(function(a) {
    if (this.value === "URL WMS - Rest") {
        this.value = "";
        if (a.which === 13) {
            $("#milupa1").click()
        }
    }
    $(this).css({
        color: "#000000"
    });
    $("#borratexto1").show()
});
$("#urlservicio").keypress(function(a) {
    if (a.which === 13) {
        $("#milupa1").click()
    }
});
$("#borratexto1").click(function() {
    $("#urlservicio").val("");
    $("#borratexto1").hide();
    $(this).css({
        color: "#000000"
    })
});
function pinta() {
    for (var b = 0; b < aCapas.Categorias.length; b++) {
        for (var a = 0; a < aCapas.Categorias[b].servicios.length; a++) {
            if (aCapas.Categorias[b].servicios[a].Default == "true") {
                $("#dijit_layout_ContentPane_" + b + "_button").css("font-weight", "bold")
            }
        }
    }
}
function pinta2(a, b) {
    if ($("[name='groupLayers_" + a + "']:checked").length > 0) {
        $("#dijit_layout_ContentPane_" + a + "_button").css("font-weight", "bold");
        if (b == true) {
            iconoinf = '&nbsp;&nbsp;<label style="cursor: pointer; align:right;" id="click_' + a + '" onclick="javascript:aCapasWMS(' + a + ');"><input type="radio" name="chk_titulo" id="check_' + a + '" style="display:none;" alt="informaci�n" title="informaci�n"><label><span></span></label></label>';
            $("#dijit_layout_ContentPane_" + a + "_button_title").append(iconoinf)
        }
    } else {
        $("#dijit_layout_ContentPane_" + a + "_button").css("font-weight", "normal");
        if (b == true) {
            var c = document.getElementById("click_" + a);
            if (c) {
                c.parentNode.removeChild(c)
            }
        }
    }
}
;












    },
    setupConnections: function() {
      // summary:
      //    wire events, and such
      //
      console.log('widgets.wrapperXunta.SubWidget::setupConnections', arguments);

    }
  });
});