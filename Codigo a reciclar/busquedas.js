function cargaConcellos(b) {
    $("#SelectMuni").children().remove();
    $("#SelectMuni").append('<option value="' + -1 + '">Seleccione concello</option>');
    $("#lupa_muni").hide();
    $("#lupa_muni").removeAttr("onclick");
    var d = [];
    var c = [];
    var a = esri.request({
        url: "json/concellos" + b + ".json",
        content: {
            f: "json"
        },
        handleAs: "json",
        callbackParamName: "callback"
    });
    a.then(function(e) {
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