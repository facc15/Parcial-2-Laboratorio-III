/// <reference path="../node_modules/@types/jquery/index.d.ts" />
//tsc --outfile ./FRONTEND/registro.js ./FRONTEND/registro.ts
$(document).ready(function()
{
    $('#limpiar').click(function(event)
    {
        //PREGUNTAR QUE ONDA
        $("#alerta").removeClass("visible");
        $("#alerta").addClass("invisible");
    })
});

namespace Manejadora
{
    export class Registro
    {
        public static AgregarUsuario(e:Event) : void
        {
            e.preventDefault();
            
            let correo = $("#correo").val();
            let clave = $("#clave").val();
            let nombre = $("#nombre").val();
            let apellido = $("#apellido").val();
            let perfil = $("#perfil").val();
            let foto : any = $("#foto")[0];
            let dato : any = {
                correo : correo,
                clave : clave,
                nombre : nombre,
                apellido : apellido,
                perfil : perfil
            }
            let formData: FormData = new FormData();
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
            .done(function (resultado)
            {
                console.info(resultado);
                window.location.replace("./login.html");
            })
            .fail(function (resultado) 
            {
                console.log(resultado);
                $("#alerta").removeClass("invisible");
                $("#alerta").addClass("visible");
        
                    $('#error_message').text(resultado.responseText);
                    $('#error_message').show();
                
            });
        }
    }
}