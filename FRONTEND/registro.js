"use strict";
/// <reference path="../node_modules/@types/jquery/index.d.ts" />
//tsc --outfile ./FRONTEND/registro.js ./FRONTEND/registro.ts
$(document).ready(function () {
    $('#limpiar').click(function (event) {
        //PREGUNTAR QUE ONDA
        $("#alerta").removeClass("visible");
        $("#alerta").addClass("invisible");
    });
});
var Manejadora;
(function (Manejadora) {
    var Registro = /** @class */ (function () {
        function Registro() {
        }
        Registro.AgregarUsuario = function (e) {
            e.preventDefault();
            var correo = $("#correo").val();
            var clave = $("#clave").val();
            var nombre = $("#nombre").val();
            var apellido = $("#apellido").val();
            var perfil = $("#perfil").val();
            var foto = $("#foto")[0];
            var dato = {
                correo: correo,
                clave: clave,
                nombre: nombre,
                apellido: apellido,
                perfil: perfil
            };
            var formData = new FormData();
            formData.append("usuario", JSON.stringify(dato));
            formData.append("foto", foto.files[0]);
            $.ajax({
                method: "POST",
                url: "./BACKEND/usuarios",
                dataType: "json",
                data: formData,
                contentType: false,
                processData: false,
                async: true
            })
                .done(function (resultado) {
                console.info(resultado);
                window.location.replace("./login.html");
            })
                .fail(function (resultado) {
                console.log(resultado);
                $("#alerta").removeClass("invisible");
                $("#alerta").addClass("visible");
                $('#error_message').text(resultado.responseText);
                $('#error_message').show();
            });
        };
        return Registro;
    }());
    Manejadora.Registro = Registro;
})(Manejadora || (Manejadora = {}));
//# sourceMappingURL=registro.js.map