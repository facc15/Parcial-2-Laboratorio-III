<?php

use Firebase\JWT\JWT;

class Usuario
{
    public $correo;
    public $clave;
    public $nombre;
    public $apellido;
    public $perfil; 
    public $foto;

    
    public function AltaUsuario($request, $response, $args)
    { 
        $ArrayDeParametros = $request->getParsedBody();
        $parametro = $ArrayDeParametros['usuario'];
        $parametro = json_decode($parametro);
        $archivos = $request->getUploadedFiles(); 
        $foto=$archivos['foto']->getClientFilename();   
        $extension=explode(".",$foto);
        $extension=array_reverse($extension);
        $nombreFoto=$parametro->apellido.".".$parametro->nombre.".".$extension[0];
        $destino ="./fotos/".$nombreFoto;    
        
        $usuario = new Usuario();
        $usuario->correo = $parametro->correo;
        $usuario->clave = $parametro->clave;
        $usuario->nombre = $parametro->nombre;
        $usuario->apellido = $parametro->apellido;
        $usuario->perfil = $parametro->perfil;
        $usuario->foto = $nombreFoto;

        $std= new stdclass();
        if($usuario->AltaUsuBD($usuario))
        {
            $std->exito = true;
            $std->mensaje = "Todo Ok.";
            $archivos['foto']->moveTo($destino);
            $retorno = $response->withJson($std, 200);
        }
        else
        {
            $std->exito = false;
            $std->mensaje = "ERROR!";
            $retorno = $response->withJson($std, 418);
        }

        return $retorno;
    }

    public function ListaUsuario($request, $response, $args)
    {
        $stringJSON= Usuario::TraerTodosUsuBD(); 
        $std= new stdclass(); 

        if($stringJSON)
        {
            $std->exito = true;
            $std->mensaje = "Todo Ok.";
            $std->tabla = $stringJSON;          
            $retorno = $response->write(json_encode($std), 200);
        }
        
        else
        {
            $std->exito = false;
            $std->mensaje = "ERROR!";
            $retorno = $response->withJson($std, 424);
        }

        return $retorno;
    }

   
    public function Login($request, $response, $next)
    {
        $arrayDeParametros = $request->getParsedBody();
        if(isset($arrayDeParametros['usuario']))
        $login = $arrayDeParametros['usuario'];
        else if(isset($arrayDeParametros['user']))
        $login=$arrayDeParametros['user'];

        $login = json_decode($login);
        $correo = $login->correo;
        $clave = $login->clave;
        $std = new stdclass();
        $login = Usuario::ValidarUsu($correo, $clave);
        $bandera = false;

        try
        {
            $tiempo = time();
            $payload = array(
                'iat' => $tiempo,
                'exp' => $tiempo + (30),
                'data' => $login,
            );

            $token = JWT::encode($payload, "claveSecreta");
            $bandera = true;
        }
        catch(Exception $e)
        {
            $std->mensaje = $e->getMessage();
        }

        if($bandera == true && $login != false)
        {
            $std->exito = true;
            $std->jwt = $token;
            $retorno = $response->withJson($std, 200);
        }
        else
        {
            $std->exito=false;
            $std->jwt=null;
            $retorno = $response->withJson($std, 403);
        }

        return $retorno;
    }

    public function VerificarJWT($request, $response, $next)
    {
        $token = $request->getHeader('token')[0];
        $esta = false;
        $std= new stdClass();

        try
        {
            $deco=JWT::decode(
                $token,
                "claveSecreta",
                ['HS256']
            );
            $esta = true;
        }
        catch(Exception $e)
        {
            $std->mensaje = "El token no es valido!!! --> " . $e->getMessage();
        }

        if($esta)
        {
           $std->mensaje="El token es valido!!!!";
           $std->token=$deco;
           $retorno = $response->withJson($std, 200);
        }
        else
        {
            $std->mensaje="Error";
            $retorno = $response->withJson($std, 403);
        }

        return $retorno;
    }

    


    public static function AltaUsuBD($usuario)
    {
        $retorno = false;
        $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso();    

        $consulta =$objetoAccesoDato->RetornarConsulta ("INSERT INTO `usuarios`(`correo`, `clave`, `nombre`, `apellido`, `perfil`, `foto`)
        VALUES (:correo, :clave, :nombre, :apellido, :perfil, :foto)");
                                                        
        $consulta->bindValue(':correo', $usuario->correo, PDO::PARAM_STR);
        $consulta->bindValue(':clave', $usuario->clave, PDO::PARAM_STR);
        $consulta->bindValue(':nombre', $usuario->nombre, PDO::PARAM_STR);
        $consulta->bindValue(':apellido', $usuario->apellido, PDO::PARAM_STR);
        $consulta->bindValue(':perfil', $usuario->perfil, PDO::PARAM_STR);
        $consulta->bindValue(':foto', $usuario->foto, PDO::PARAM_STR);
        $consulta->execute();   

        if ($consulta->rowCount()>0) {
            $retorno = true;
        }
        return $retorno;
    }

    public static function TraerTodosUsuBD()
    {    
        $objetoAccesoDato = AccesoDatos::dameUnObjetoAcceso();        
        $consulta = $objetoAccesoDato->RetornarConsulta("SELECT * FROM usuarios");    
        $consulta->execute();   
        $usuarios = $consulta->fetchAll(PDO::FETCH_CLASS, "Usuario");
        return $usuarios;         
    }

    public static function ValidarUsu($correo, $clave)
    {
        $objetoAccesoDato = AccesoDatos::DameUnObjetoAcceso();
        $consulta = $objetoAccesoDato->RetornarConsulta("SELECT * FROM usuarios WHERE correo=:correo AND clave=:clave");

        $consulta->bindValue(':correo', $correo, PDO::PARAM_STR);
        $consulta->bindValue(':clave', $clave, PDO::PARAM_STR);
        $consulta->execute();

        $usuario = false;

        if ($consulta->rowCount()>0) {
            $usuario= $consulta->fetchObject('Usuario');
        }

        return $usuario;
    }
}

?>