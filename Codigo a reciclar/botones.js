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