<?php


header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if($method == "OPTIONS") {
    die();
}

sleep(3);

if($method == "GET") {
    echo '[{"id":1, "nombre":"Marcelo", "apellido":"Luque", "edad":45, "ventas":15000, "sueldo":2000},{"id":2, "nombre":"Ramiro", "apellido":"Escobar", "edad":35, "ventas": 6000, "sueldo": 1000},{"id":3, "nombre":"Facundo", "apellido":"Cairo", "edad":30, "ventas":500, "sueldo":15000},{"id":4, "nombre":"Fernando", "apellido":"Nieto", "edad":18, "compras":8000, "telefono":"152111131"},{"id":5, "nombre":"Manuel", "apellido":"Loza", "edad":20, "compras":50000, "telefono":"42040077"},{"id":666, "nombre":"Nicolas", "apellido":"Serrano", "edad":23, "compras":7000, "telefono":"1813181563"}]';
    die();
}

if($method == "DELETE") {
    $objeto = json_decode(file_get_contents('php://input'), true);

    if (isset($objeto['id'])==false || $objeto['id'] == 666 || $objeto['id'] == "666") {
        http_response_code(400);
        echo "Error No se pudo procesar";
        die();
    }
    
    echo "Exito";
    die();
}


if($method == "POST") {
    $objeto = json_decode(file_get_contents('php://input'), true);

    $estJugador=1;
    $estProfesional=1;

    if (isset($objeto['id'])==false || isset($objeto['nombre'])==false || isset($objeto['apellido'])==false || isset($objeto['edad'])==false || isset($objeto['ventas'])==false || isset($objeto['sueldo'])==false)   {
        $estJugador=0;
    }

    if (isset($objeto['id'])==false || isset($objeto['nombre'])==false || isset($objeto['apellido'])==false || isset($objeto['edad'])==false || isset($objeto['compras'])==false || isset($objeto['telefono'])==false)   {
        $estProfesional=0;
    }

    if ($estJugador==0 && $estProfesional==0){
        http_response_code(400);
        echo "Estructura Incorrecta";
        die();
    }
    
    
    if ($objeto['id']==666) {
        http_response_code(400);
        echo "Error No se pudo procesar";
        die();
    }
    
    echo "Exito";
    die();
}


if($method == "PUT") {
    $objeto = json_decode(file_get_contents('php://input'), true);
    $estJugador=1;
    $estProfesional=1;

    if (isset($objeto['nombre'])==false || isset($objeto['apellido'])==false || isset($objeto['edad'])==false || isset($objeto['ventas'])==false || isset($objeto['sueldo'])==false)  {
        $estJugador=0;
    }

    if (isset($objeto['nombre'])==false || isset($objeto['apellido'])==false || isset($objeto['edad'])==false || isset($objeto['compras'])==false || isset($objeto['telefono'])==false)  {
        $estProfesional=0;
    }
   
    if ($estJugador==0 && $estProfesional==0){
        http_response_code(400);
    //    $s=$objeto['nombre']. $objeto['apellido'].$objeto['edad'].$objeto['titulo'].$objeto['facultad'].$objeto['anoGraduacion']; 
        echo "Estructura Incorrecta";
        die();
    }

    $s = (string)time();
    echo (`{"objetos":} `);
    echo '{"id":' . $s . "}";
    die();
}

?>