"use strict";
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
var Manejadora;
(function (Manejadora) {
    var Principal = /** @class */ (function () {
        function Principal() {
        }
        Principal.ArmarFormAuto = function (accion, auto) {
            $("#divResultado").html("");
            var marca = "";
            var color = "";
            var modelo = "";
            var precio = "";
            var funcion = "";
            var titulo = "";
            switch (accion) {
                case "modificar":
                    var objJson = JSON.parse(auto);
                    funcion = "Manejadora.Principal.ModificarAuto(" + objJson.id + ")";
                    titulo = "Modificar";
                    marca = objJson.marca;
                    color = objJson.color;
                    modelo = objJson.modelo;
                    precio = objJson.precio;
                    break;
                case "agregar":
                    funcion = "Manejadora.Principal.AgregarAuto(event)";
                    titulo = "Agregar";
                    break;
            }
            var form = '<br>\
                                <div class="row justify-content-center">\
                                    <div class="col-md-8">\
                                        <form style="background-color: darkcyan" class="well col-md-10">\
                                            <br>\
                                            <div class="form-group">\
                                                <div class="input-group">\
                                                    <span class="input-group-addon"><i class="fa fa-trademark"></i></span>\
                                                    <input type="text" class="form-control" id="marca" placeholder="Marca" value="' + marca + '">\
                                                </div>\
                                            </div>\
                                            <div class="form-group">\
                                                <div class="input-group">\
                                                    <span class="input-group-addon"><i class="fa fa-paint-brush"></i></span>\
                                                    <input type="text" class="form-control" id="color" placeholder="Color" value="' + color + '">\
                                                </div>\
                                            </div>\
                                            <div class="form-group">\
                                                <div class="input-group">\
                                                    <span class="input-group-addon"><i class="fa fa-car"></i></span>\
                                                    <input type="text" class="form-control" id="modelo" placeholder="Modelo" value="' + modelo + '">\
                                                </div>\
                                            </div>\
                                            <div class="form-group">\
                                                <div class="input-group">\
                                                    <span class="input-group-addon"><i class="fa fa-usd"></i></span>\
                                                    <input type="number" class="form-control" id="precio" placeholder="Precio" value="' + precio + '">\
                                                </div>\
                                            </div>\
                                            <div class="row">\
                                                <div class="col-sm-6 col-xs-12">\
                                                    <button type="submit" class="btn btn-block btn-success" id="btnModificar" onclick=' + funcion + '>' + titulo + '</button>\
                                                </div>\
                                                <div class="col-sm-6 col-xs-12">\
                                                    <button type="reset" class="btn btn-block btn-warning">Limpiar</button>\
                                                </div>\
                                            </div>\
                                            <br>\
                                        </form>\
                                    </div>\
                                </div><br>';
            $("#divAutos").html(form);
        };
        Principal.ListadoUsuarios = function () {
            $("#divResultado").html("");
            $.ajax({
                type: 'GET',
                url: "./BACKEND/",
                dataType: "json",
                data: {},
                async: true
            })
                .done(function (resultado) {
                console.log(resultado);
                var tabla = '<table class="table table-hover" style="background-color: rgb(47, 153, 47)">';
                tabla += '<br><tr><th>CORREO</th><th>NOMBRE</th><th>APELLIDO</th><th>PERFIL</th><th>FOTO</th></tr>';
                for (var _i = 0, _a = resultado.tabla; _i < _a.length; _i++) {
                    var element = _a[_i];
                    console.log(element);
                    tabla += '<tr><td>' + element.correo + '</td><td>' + element.nombre + '</td><td>' + element.apellido + '</td><td>' + element.perfil + '</td><th><img src="./BACKEND/fotos/' + element.foto + '" height=50 width=50 ></img></td></tr>';
                }
                tabla += "</table>";
                $("#divUsuarios").html(tabla);
            })
                .fail(function (resultado) {
                var alerta = Principal.ArmarAlert(resultado.responseJSON.mensaje, "danger");
                $("#divResultado").html(alerta);
            });
        };
        Principal.ListadoAutos = function () {
            $("#divResultado").html("");
            $.ajax({
                type: 'GET',
                url: "./BACKEND/autos",
                dataType: "json",
                data: {},
                async: true
            })
                .done(function (resultado) {
                var tabla = '<table class="table table-hover" style="background-color: rgb(223, 71, 71)">';
                tabla += '<br><tr><th>MARCA</th><th>COLOR</th><th>MODELO</th><th>PRECIO</th><th colspan="2">ACCIONES</th></tr>';
                var accion = "modificar";
                for (var _i = 0, _a = resultado.tabla; _i < _a.length; _i++) {
                    var element = _a[_i];
                    tabla += '<tr><td>' + element.marca + '</td><td>' + element.color + '</td><td>' + element.modelo + '</td><td>' + element.precio + '</td>';
                    tabla += '<td><button type="button" class="btn btn-danger" id="btnEliminar" onclick="Manejadora.Principal.EliminarAuto(' + element.id + ')">Eliminar</button></td>';
                    tabla += '<td><button type="button" class="btn btn-info" id="btnModificar" onclick=Manejadora.Principal.ArmarFormAuto(\'' + accion + '\',\'' + JSON.stringify(element) + '\')>Modificar</button></td>';
                }
                tabla += "</table>";
                $("#divAutos").html(tabla);
            })
                .fail(function (resultado) {
                var alerta = Principal.ArmarAlert(resultado.responseJSON.mensaje, "danger");
                $("#divResultado").html(alerta);
            });
        };
        Principal.AgregarAuto = function (e) {
            e.preventDefault();
            var marca = $("#marca").val();
            var color = $("#color").val();
            var modelo = $("#modelo").val();
            var precio = $("#precio").val();
            var dato = {
                color: color,
                marca: marca,
                precio: precio,
                modelo: modelo
            };
            $.ajax({
                type: 'POST',
                url: "./BACKEND/",
                dataType: "json",
                data: { "auto": JSON.stringify(dato) },
                async: true
            })
                .done(function (resultado) {
                var alerta = Principal.ArmarAlert(resultado.mensaje, "success");
                $("#divResultado").html(alerta);
            })
                .fail(function (resultado) {
                var alerta = Principal.ArmarAlert(resultado.responseJSON.mensaje, "danger");
                $("#divResultado").html(alerta);
            });
        };
        Principal.EliminarAuto = function (id) {
            var jwt = localStorage.getItem("jwt");
            if (confirm("¿Desea eliminar el auto?")) {
                $.ajax({
                    type: 'DELETE',
                    url: "./BACKEND/",
                    dataType: "json",
                    data: { "id": id },
                    headers: { "token": jwt },
                    async: true
                })
                    .done(function (resultado) {
                    Principal.ListadoAutos();
                })
                    .fail(function (resultado) {
                    if (resultado.responseJSON.mensaje == "Expired token") {
                        window.location.replace("./login.html");
                    }
                    else {
                        var alerta = Principal.ArmarAlert(resultado.responseJSON.mensaje, "danger");
                        $("#divResultado").html(alerta);
                    }
                });
            }
        };
        Principal.ModificarAuto = function (id) {
            var jwt = localStorage.getItem("jwt");
            var marca = $("#marca").val();
            var color = $("#color").val();
            var modelo = $("#modelo").val();
            var precio = $("#precio").val();
            var dato = {
                id: id,
                marca: marca,
                color: color,
                modelo: modelo,
                precio: precio
            };
            $.ajax({
                type: 'PUT',
                url: "./BACKEND/",
                dataType: "json",
                data: { "auto": JSON.stringify(dato) },
                headers: { "token": jwt },
                async: true
            })
                .done(function (resultado) {
                alert(resultado.mensaje);
                Principal.ListadoAutos();
            })
                .fail(function (resultado) {
                if (resultado.responseJSON.mensaje == "Expired token") {
                    window.location.replace("./login.html");
                }
                else {
                    var alerta = Principal.ArmarAlert(resultado.responseJSON.mensaje, "danger");
                    $("#divResultado").html(alerta);
                }
            });
            Principal.ListadoAutos();
        };
        Principal.ArmarAlert = function (mensaje, tipo) {
            var alerta = '<div id="alert_' + tipo + '" class="alert alert-' + tipo + ' alert-dismissable">';
            alerta += '<button type="button" class="close" data-dismiss="alert">&times;</button>';
            alerta += '<span class="d-inline-block text-truncate" style="max-width: 450px;">' + mensaje + ' </span></div>';
            return alerta;
        };
        Principal.ObtenerAutosFiltrados = function () {
            $.ajax({
                type: 'GET',
                url: "./BACKEND/autos",
                dataType: "json",
                data: {},
                async: true
            })
                .done(function (resultado) {
                var objFiltrado = resultado.tabla.filter(function (auto, index, array) { return auto.precio > 250888; });
                var tabla = '<h3>Autos filtrados</h3><br><table class="table table-hover" style="background-color: rgb(223, 71, 71)">';
                tabla += '<br><tr><th>MARCA</th><th>COLOR</th><th>MODELO</th><th>PRECIO</th></tr>';
                for (var _i = 0, objFiltrado_1 = objFiltrado; _i < objFiltrado_1.length; _i++) {
                    var element = objFiltrado_1[_i];
                    tabla += '<tr><td>' + element.marca + '</td><td>' + element.color + '</td><td>' + element.modelo + '</td><td>' + element.precio + '</td>';
                }
                tabla += "</table>";
                $("#divUsuarios").html(tabla);
            })
                .fail(function (resultado) {
                var alerta = Principal.ArmarAlert(resultado.responseJSON.mensaje, "danger");
                $("#divResultado").html(alerta);
            });
        };
        Principal.ObtenerPreciosPromedioReduce = function () {
            $.ajax({
                type: 'GET',
                url: "./BACKEND/autos",
                dataType: "json",
                data: {},
                async: true
            })
                .done(function (resultado) {
                var promedioPrecio = resultado.tabla.reduce(function (anterior, actual, index, array) {
                    return anterior + parseFloat(actual.precio);
                }, 0) / resultado.tabla.length;
                var alerta = Principal.ArmarAlert("El promedio de todos los autos es: " + promedioPrecio, "info");
                $("#divResultado").html(alerta);
            })
                .fail(function (resultado) {
                var alerta = Principal.ArmarAlert(resultado.responseJSON.mensaje, "danger");
                $("#divResultado").html(alerta);
            });
        };
        Principal.MapearEmpleados = function () {
            $.ajax({
                type: 'GET',
                url: "./BACKEND/",
                dataType: "json",
                data: {},
                async: true
            })
                .done(function (resultado) {
                var objMap = resultado.tabla.map(function (empleado, index, array) {
                    var data = { nombre: empleado.nombre, foto: empleado.foto };
                    return data;
                });
                var tabla = '<table class="table table-hover" style="background-color: rgb(47, 153, 47)">';
                tabla += '<br><tr><th>NOMBRE</th><th>FOTO</th></tr>';
                for (var _i = 0, objMap_1 = objMap; _i < objMap_1.length; _i++) {
                    var element = objMap_1[_i];
                    tabla += '<tr><td>' + element.nombre + '</td><th><img src="./BACKEND/fotos/' + element.foto + '" height=50 width=50 ></img></td></tr>';
                }
                tabla += "</table>";
                $("#divAutos").html(tabla);
            })
                .fail(function (resultado) {
                var alerta = Principal.ArmarAlert(resultado.responseJSON.mensaje, "danger");
                $("#divResultado").html(alerta);
            });
        };
        return Principal;
    }());
    Manejadora.Principal = Principal;
})(Manejadora || (Manejadora = {}));
//# sourceMappingURL=principal.js.map