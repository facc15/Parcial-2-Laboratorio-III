<?php

use Firebase\JWT\JWT;

class MW
{
    public function VerificarSetCorreoClave($request, $response, $next)
    {
        $array = $request->getParsedBody();
        $ok = false;
        $mensajeError = "";

        if(isset($array['usuario']))
        $login = json_decode($array['usuario']);
        else if(isset($array['user']))
        $login = json_decode($array['user']);
        


        $std = new stdClass();

        $correo=isset($login->correo);
        $clave=isset($login->clave);
        
        if((!$correo) && (!$clave))
        {
            $mensajeError="el correo y clave no estan seteados!";
        }else if(!$correo)
        {
            $mensajeError="el correo no esta seteado";
        }else if(!$clave)
        {
            $mensajeError="la clave no esta seteada";
        }else
        {
            $ok=true;
        }

        if ($ok)
        {   
            $newResponse = $next($request, $response);
        }else
        {
           
            $std->mensaje = $mensajeError;
            $newResponse = $response->withJson($std, 409);
        }   
        return $newResponse;
    }

    public static function VerificarVacioCorreoClave($request, $response, $next)
    {
        $array = $request->getParsedBody();
        $ok = false;
        if(isset($array['usuario']))
        $login = $array['usuario'];
        else if(isset($array['user']))
        $login = $array['user'];

        if(isset($array['usuario']) || isset($array['user']))
        {
            $login = json_decode($login);
            $correo = $login->correo;
            $clave = $login->clave;
            
            $mensajeError = "";
    
            if($correo != "" && $clave != "")
            {
                $ok = true;
            }else if ($correo != "" && $clave == "")
            {
                $mensajeError = "Campo clave vacia!";
            }else if ($correo == "" && $clave != "")
            {
                $mensajeError = "Campo correo vacio!";
            }else
            {
                $mensajeError = "Campos vacios!";
            }

        }   

        if ($ok)
        {   
            $newResponse = $next($request, $response);
        }else
        {
            $std = new stdClass();
            $std->mensaje = $mensajeError;
            $newResponse = $response->withJson($std, 403);
        }   
        return $newResponse;
    }

    public function VerificarBDCorreoClave($request, $response, $next)
    {
        $array = $request->getParsedBody();
        if(isset($array['usuario']))
        $login = $array['usuario'];
        else if(isset($array['user']))
        $login = $array['user'];
        $login = json_decode($login);
        $correo = $login->correo;
        $clave = $login->clave;
        $esta = false;

        $user = new Usuario();
        $usuarios = [];
        $usuarios = $user->TraerTodosUsuBD();

        foreach ($usuarios as $us)
        { 
            if ($us->clave == $clave && $us->correo == $correo)
            {
                $esta = true;
                break;
            }
        }

        if (!$esta)
        {
            $std = new stdClass();
            $std->mensaje = "No existe el usuario en la base de datos!";
            $newResponse = $response->withJson($std, 403);
        }
        else
        {
            $newResponse = $next($request, $response);
        }

        return $newResponse;
    }

    public static function VerificarBDCorreo($request, $response, $next)
    {
        $array = $request->getParsedBody();
        $login = $array['usuario'];
        $login = json_decode($login);
        $correo = $login->correo;
        $esta = false;


        $user = new Usuario();
        $usuarios = [];
        $usuarios = $user->TraerTodosUsuBD();

        foreach ($usuarios as $us)
        { 
            if ($us->correo == $correo)
            {
                $esta = true;
                break;
            }
        }

        if ($esta == true)
        {
            $std = new stdClass();
            $std->mensaje = "El correo es existente!!";
            $newResponse = $response->withJson($std, 403);
        }
        else
        {
            $newResponse = $next($request, $response);
        }

        return $newResponse;
    }
 
    public static function VerificarRango($request, $response, $next)
    {
        $array = $request->getParsedBody();
        $auto = $array['auto'];
        $auto = json_decode($auto);
        $precio = $auto->precio;
        $color = $auto->color;
        $mensajeError = "";
        $esta = false;
 
            if ($precio >= 50000 && $precio <= 600000 && $color != "azul")
               $esta = true;
            else if($color != "azul" && $precio < 50000 || $precio > 600000)
              $mensajeError = "Está fuera de rango!!!!";
            else if($precio >= 50000 && $precio <= 600000 && $color == "azul")
                $mensajeError = "El color NO puede ser azul!!!";
            
        

        if (!$esta){
            $std = new stdClass();
            $std->mensaje = $mensajeError;
            $newResponse = $response->withJson($std, 409);
        }else{
            $newResponse = $next($request, $response);
        }

        return $newResponse;
    }



    public function VerificarToken($request, $response, $next)
    {
        $token = $request->getHeader('token')[0];
        //$token = $array["token"];
        $esta = false;
        $std= new stdClass();

        try{
            $deco=JWT::decode(
                $token,
                "claveSecreta",
                ['HS256']
            );
            $esta=true;
        }
        catch(Exception $e)
        {
            $std->mensaje = $e->getMessage();
        }
        
        if($esta)
        {
            $std->mensaje = "Token validado";
            $std->token = $deco;
            $retorno = $next($request, $response);
        }else
        {
            $std->token = $token;
            $retorno = $response->withJson($std, 403);
        }

        return $retorno;
    }  

    public static function VerificarPropietario($request,$response,$next)
    {
        $token = $request->getHeader('token')[0];
        $std= new stdClass();

        $deco = JWT::decode(
            $token,
            "claveSecreta",
            ['HS256']
        );

        if($deco->data->perfil == "propietario")
        {
            $newResponse = $next($request, $response);
            $std->mensaje="Permiso accedido";
            $newResponse= $response->withJson($std, 200);
        }
        else
        { 
            $std->mensaje="No tiene permisos!";
            $newResponse= $response->withJson($std, 409);
        }

        return $newResponse;
    }

    public function VerificarEncargado($request, $response, $next)
    {
        $token = $request->getHeader('token')[0];
        $std= new stdClass();

        $decodificado = JWT::decode(
            $token,
            "claveSecreta",
            ['HS256']
        );

        if($decodificado->data->perfil == "propietario" || $decodificado->data->perfil == "encargado")
        {
            $newResponse = $next($request, $response);
            $std->mensaje="Acceso valido";
            $newResponse= $response->withJson($std, 200);

        }
        else
        { 
            $std= new stdClass();
            $std->mensaje="No es de tipo encargado ni propietario";
            $newResponse= $response->withJson($std, 409);
        }
        return $newResponse;
    }
    
}