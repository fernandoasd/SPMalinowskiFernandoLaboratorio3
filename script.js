class Persona
{
    id = 0;
    nombre = "";
    apellido = "";
    edad = 0;

    constructor (p_id, p_nombre, p_apellido, p_edad)
    {
        this.id = p_id;
        this.nombre = p_nombre;
        this.apellido = p_apellido;
        this.edad = p_edad;
    }

    toString()
    {
        return "Id: " + this.id + ", Nombre: " + this.nombre + ", Apellido: " + this.apellido + ", Edad: " + this.edad;
    }
}

class Empleado extends Persona
{
    sueldo = 0;
    vestan = 0;

    constructor (p_id, p_nombre, p_apellido, p_edad, p_sueldo, p_ventas)
    {
        super(p_id, p_nombre, p_apellido, p_edad);
        this.sueldo = p_sueldo;
        this.ventas = p_ventas;
    }

    toString()
    {
        return super.toString() + ", sueldo: " + this.sueldo + ", ventas: " + this.ventas;
    }
}

class Cliente extends Persona
{
    compras = 0;
    telefono = "";

    constructor (p_id, p_nombre, p_apellido, p_edad, p_compras, p_telefono)
    {
        super(p_id, p_nombre, p_apellido, p_edad);
        this.compras = p_compras;
        this.telefono = p_telefono;
    }


    toString()
    {
        return super.toString() + ", sueldo: " + this.compras + ", ventas: " + this.telefono;
    }
}

var columnasTabla = ["id", "nombre", "apellido", "edad", "sueldo", "ventas", "telefono", "compras"];
var cabecerasAdicionalesTabla = ["modificar", "eliminar"];
var url = "http://localhost/Labo3-Servidor-pp/PersonasEmpleadosClientes.php";


var listaObjetosParseados = [{"Error": "objeto Vacio"}];

var tableHead = $("tableHead");
var tableBody = $("tableBody");
var formDatos = $("formDatos");
var btnAgregar = $("btnAgregar");
let selectTipo = $("selectTipo");
var btnModificar = $("btnModificar");
var btnEliminar = $("btnEliminar");

var txtPromedio = $("txtPromedio");
var btnVelocidadPromedio = $("btnVelocidadPromedio");

let formAbm = $("formAbm");
let btnAceptar = $("btnAceptar");
let btnCancelar = $("btnCancelar");

let abmSubtitulo = $("abmSubtitulo");
let txtId = $("txtId");
let txtNombre = $("txtNombre");
let txtApellido = $("txtApellido");
let txtEdad = $("txtEdad");
let txtSueldo = $("txtSueldo");
let txtVentas = $("txtVentas");
let txtCompras = $("txtCompras");
let txtTelefono = $("txtTelefono");

dibujarCabeceraTabla(tableHead, columnasTabla, cabecerasAdicionalesTabla);
consultarDatosServidor(url);

formDatos.addEventListener("submit", (event) => {event.preventDefault()});

btnAgregar.addEventListener("click",(e) =>{switchForms(),dibujarAbm("","Alta")});

formAbm.addEventListener("submit", (event) => {event.preventDefault()});

selectTipo.addEventListener("change", () => {actualizarFiltroAbm()});

btnAceptar.addEventListener("click", () =>
    {
        let nuevoObjeto = validarEntradaDatos();
        if (nuevoObjeto != -1)
        {
            apiAlta(url, nuevoObjeto);
        }
    });

btnEliminar.addEventListener("click", () =>
{
    let objeto = validarEntradaDatos();
    if (objeto != -1)
    {
        apiEliminar(url, objeto);
    }
});

btnModificar.addEventListener("click", () =>
    {
        let objModificado = validarEntradaDatos();
        if (objModificado != -1)
        {
            apiModificar(url, objModificado);
        }
    });

btnCancelar.addEventListener("click", ()=>{switchForms()});

/**
 * recibe array de genericos y devuelve array de instancia de clase personalizada
 * @param {Array} arrayObjetosGenericos -array objetos genericos
 * @returns {Array} - array de tipos personalizado
 */
function instanciarClases(strObjetos)
{
    let objetosGenericos = traerObjetosGenericos(strObjetos);

    console.log(objetosGenericos instanceof Array);

    if (objetosGenericos instanceof Array)
    {
        return instancia = objetosGenericos.map((e) => 
            {
                if (e.hasOwnProperty("ventas"))
                {
                    //{"id":1, "nombre":"Marcelo", "apellido":"Luque", "edad":45, "ventas":15000, "sueldo":2000}
                    return new Empleado(e.id, e.nombre, e.apellido, e.edad, e.sueldo, e.ventas);
                }
                else if (e.hasOwnProperty("compras"))
                {
                    return new Cliente(e.id, e.nombre, e.apellido, e.edad, e.compras, e.telefono);
                }
            });
    }
    else
    {
        let e = objetosGenericos;
        if (e.hasOwnProperty("ventas"))
            {
                //{"id":1, "nombre":"Marcelo", "apellido":"Luque", "edad":45, "ventas":15000, "sueldo":2000}
                return new Empleado(e.id, e.nombre, e.apellido, e.edad, e.sueldo, e.ventas);
            }
            else if (e.hasOwnProperty("compras"))
            {
                return new Cliente(e.id, e.nombre, e.apellido, e.edad, e.compras, e.telefono);
            }
    }
    
}


idBody.onload = ()=>{ formAbm.style.display = "none"};

function consultarDatosServidor(url)
{
    bloquearPantalla(true);
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function ()
    {
        if (xhttp.readyState == 4)
        {
            if (xhttp.status == 200)
            {
                
                let datosStr = xhttp.response;
                listaObjetosParseados = instanciarClases(datosStr);
                actualizarTabla();
                console.log("*listarDatos()->Se carga lista");
                bloquearPantalla(false);
            }
            else if (xhttp.status == 404)
                 console.log("No se pudo conectar al servidor");
            else
                console.log("otro error!");
        }
    }
    xhttp.open("GET", url);
    xhttp.setRequestHeader("Content-type", "Application/json");
    xhttp.send();
}

function actualizarTabla()
{
    dibujarCuerpoTabla (tableBody, columnasTabla, cabecerasAdicionalesTabla, listaObjetosParseados);
}

function traerObjetosGenericos(cadena) { return JSON.parse(cadena) }

function $(idElemento) {return document.getElementById(idElemento)}

function bloquearPantalla(banderaBloqueo)
{
    let s = $("spinner");
    if (banderaBloqueo)
        s.style.display = "flex";
    else
        s.style.display = "none";
}



function aliminarHijos(elemento)
{
    while (elemento.firstChild)
    {
        elemento.removeChild(elemento.firstChild);
    }
}

function hacerMayusculaPrimerLetra(palabra)
{
    return  palabra[0].toUpperCase() + palabra.slice(1);
}

function dibujarCabeceraTabla(tableHead, columnasTabla, cabecerasAdicionalesTabla)
{
    aliminarHijos(tableHead);
    columnasTabla = columnasTabla.concat(cabecerasAdicionalesTabla);
    // console.log("columnas: " + columnasTabla);
    columnasTabla.forEach((atributo) =>
        {
            let nuevaTh = document.createElement("th");
            nuevaTh.setAttribute("id", `head-${atributo}`);
            nuevaTh.setAttribute("value", `${atributo}`);
            nuevaTh.style.display = "table-header";
            nuevaTh.innerHTML = `${hacerMayusculaPrimerLetra(atributo)}`;
            tableHead.appendChild(nuevaTh);
        }) 
}

function dibujarCuerpoTabla (cuerpoTabla, columnasTabla, cabecerasAdicionalesTabla, objestosInstanciados)
{
    aliminarHijos(cuerpoTabla);

    objestosInstanciados.forEach((o) =>
        {
            if (columnasTabla.length > 0)
            {
                let fila = document.createElement("tr");
                fila.setAttribute("idElemento", o.id);
                let tableDataHtml = "";
                columnasTabla.forEach((atributo) => 
                    {
                        tableDataHtml += `<td idElemento="${o.id}">${o[atributo] || "N/A"}</td>`;
                    });


                if (cabecerasAdicionalesTabla.length > 0)
                {
                    cabecerasAdicionalesTabla.forEach((columna) =>
                    {
                        if (columna == "modificar")
                        {
                            tableDataHtml += `<td idElemento="${o.id}"> 
                            <button class="btn btn-warning" onclick="modificarObjeto(${o.id})">${hacerMayusculaPrimerLetra(columna)}</button>
                            </td>`;
                        }

                        if (columna == "eliminar")
                        {
                            tableDataHtml += `<td idElemento="${o.id}"> 
                            <button class="btn btn-danger" onclick="eliminarObjeto(${o.id})">${hacerMayusculaPrimerLetra(columna)}</button>
                            </td>`;
                        }
                    });
                }
                fila.innerHTML = tableDataHtml;
                cuerpoTabla.appendChild(fila);
            }
        });
}

function modificarObjeto(idObjeto)
{
    console.log("Se modifica el objeto " + idObjeto);
    switchForms();
    dibujarAbm(idObjeto, "Modificación");
}

function eliminarObjeto(idObjeto)
{
    console.log("Se elimina el objeto " + idObjeto);
    switchForms();
    dibujarAbm(idObjeto, "Eliminación", true);
}

function switchForms()
{
    if (formDatos.style.display == "none")
    {
        formDatos.style.display = "inline-block";
        formAbm.style.display = "none";
        actualizarTabla();
    }
    else
    {
        formDatos.style.display = "none";
        formAbm.style.display = "inline-block";
    }
}

function generarIdUnica()
{
    let nuevaId = 1;
    for (i= 0; i<listaObjetosParseados.length; i++)
    {
        if (listaObjetosParseados[i].id == nuevaId)
        {
            nuevaId++;
        }
    }
    return nuevaId;
}

function validarEntradaDatos()
{
    let banderaOk = false;
    let nuevoObjeto;
    
    if (txtEdad.value > 15)
    {
        if(txtNombre.value != "" && txtApellido.value != "")
            {
                if (selectTipo.value == 1)
                    {
                        if (txtSueldo.value > 0 && txtVentas.value > 0)
                        {
                            nuevoObjeto = {id:txtId.value, nombre:txtNombre.value, apellido:txtApellido.value, edad:txtEdad.value,
                                 sueldo:txtSueldo.value, ventas:txtVentas.value}; 
                            // nuevoObjeto = new Empleado(txtId.value, txtNombre.value, txtApellido.value, txtEdad.value, txtSueldo.value, txtVentas.value); 
                            
                            banderaOk = true;
                        }
                        else
                        {
                            window.alert("Sueldo o Ventas inválidos");
                        }
                    }
                else if (selectTipo.value == 2)
                {
                    if (txtCompras.value > 0 && txtTelefono.value != "")
                    {
                        nuevoObjeto = {id:txtId.value, nombre:txtNombre.value, apellido:txtApellido.value, edad:txtEdad.value,
                            compras:txtCompras.value, telefono:txtTelefono.value}; 
                        // nuevoObjeto = new Cliente(txtId.value, txtNombre.value, txtApellido.value, txtEdad.value, txtCompras.value, txtTelefono.value); 
                        banderaOk = true;
                    }
                    else
                    {
                        window.alert("Compras o Teléfono inválidos");
                    }
                }
            }
            else
            {
                window.alert("Nombre y/o Apellido inválidos.");
            }
    } else {window.alert("La edad debe ser mayor a 15")}
    

    if (banderaOk)
    {
        console.log(nuevoObjeto);
        return nuevoObjeto;
    }
    else
    {
        return -1;
    }
}

function dibujarAbm(idSeleccionado, accion, banderaEliminar = false)
{
    abmSubtitulo.innerHTML = accion;
    console.log(abmSubtitulo);
    let p = buscarPersonaPorId(idSeleccionado);

    

    if (p instanceof Persona)
    {
        abmSubtitulo.value = "Modificar"
        btnAceptar.style.display = "none";
        btnModificar.style.display = "inline-block";
        btnEliminar.style.display = "none";
        txtId.value = p.id;
        selectTipo.disabled = true;
        txtId.disabled = true;
        txtNombre.value = p.nombre;
        txtApellido.value = p.apellido;
        txtEdad.value = p.edad;

        if (p instanceof Empleado)
        {
            selectTipo.value = 1;
            txtSueldo.value = p.sueldo;
            txtVentas.value = p.ventas;
            txtCompras.value = "";
            txtTelefono.value = "";
        }
        else if (p instanceof Cliente)
        {
            selectTipo.value = 2;
            txtCompras.value = p.compras;
            txtTelefono.value = p.telefono;
            txtSueldo.value = "";
            txtVentas.value = "";
        }
    }
    else
    {
        abmSubtitulo.value = "Agregar"
        selectTipo.value = 1;
        selectTipo.disabled = false;
        // txtId.value = generarIdUnica();
        txtId.disabled = false;
        btnAceptar.style.display = "inline-block";
        btnModificar.style.display = "none";
        btnEliminar.style.display = "none";
        txtId.value = "";
        txtNombre.value = "";
        txtApellido.value = "";
        txtEdad.value = "";
        txtSueldo.value = "";
        txtVentas.value = "";
        txtCompras.value = "";
        txtTelefono.value = "";
    }

    if (banderaEliminar)
        {
            btnAceptar.style.display = "none";
            btnModificar.style.display = "none";
            btnEliminar.style.display = "inline-block";
        }
    actualizarFiltroAbm();
    // aplicarEstilos();
}

function buscarPersonaPorId(idSeleccionado)
{
    return listaObjetosParseados.find((x)=>{return x.id == idSeleccionado});
}

function actualizarFiltroAbm()
{
    let propOcultas = [];
    let propCargadas = [];
    
    if (selectTipo.value == 1)
    {
        propCargadas = document.getElementsByClassName("propEmpleado");
        propOcultas = document.getElementsByClassName("propCliente");
        
    }
    else if (selectTipo.value == 2)
    {
        propCargadas = document.getElementsByClassName("propCliente");
        propOcultas = document.getElementsByClassName("propEmpleado");
    }

    for (let i= 0; i < propOcultas.length; i ++)
    {
        propOcultas[i].style.display = "none";
        if (propOcultas[i].type == "text")
        {
            propOcultas[i].value = "";
        }
    }

    for (var i= 0; i < propCargadas.length; i ++)
    {
        propCargadas[i].style.display = "inline-block";
    }
}

function apiAlta(url,objeto)
{
    bloquearPantalla(true);
    fetch(url, {
        method: "PUT",
        headers:{
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(objeto)
    })
    .then(response => response.json())
    .then(json => {
        objeto.id = json.id;
        agregarAlista(objeto);
    })
    .catch((respuesta) => {window.alert("Error Del servidor - Status: " + respuesta.status)})
    .then(() => bloquearPantalla(false));
}

async function apiModificar(url, objeto)
{
    let response;
    try
    {
        bloquearPantalla(true);
        response = await fetch(url,{
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(objeto)
        });

        let data = await response.json();

        if (response.status == 200)
        {
            console.log("1-Response status: " + response.status);
            console.log(data);
            let objetoPrevio = buscarPersonaPorId(objeto.id);
            let indice = listaObjetosParseados.indexOf(objetoPrevio);
            listaObjetosParseados.splice(indice, 1);
            objeto.id = data.id;
            agregarAlista(objeto);
        }
        else{
            throw new Error("Error Del servidor - Status: " + resp);
        }
    }
    catch (error)
    {
        window.alert("Error Del servidor - Status: " + response.status);
    }
    finally
    {
        bloquearPantalla(false);
    }
}

function apiEliminar(url, objeto)
{
    console.log("objeto a eliminar: ");
    console.log(objeto);

    bloquearPantalla(true);
    fetch(url,{
        method: "DELETE",
        headers: {
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(objeto)
    })
    .then((respuesta) => {
        return new Promise ((e, f) =>{
            if (respuesta.status == 200)
            {
                console.log("Status " + respuesta.status);
                e(respuesta);
            }
            else
                f(respuesta);
        });
    })
    // .then((respuesta) => respuesta.json())
    .then( (respuesta) => {
        console.log(respuesta);
        let objetoPrevio = buscarPersonaPorId(objeto.id);
        let indice = listaObjetosParseados.indexOf(objetoPrevio);
        listaObjetosParseados.splice(indice, 1);
        actualizarTabla();
        switchForms();
    })
    .catch((respuesta) => {window.alert("Error Del servidor - Status: " + respuesta.status)})
    .then(() => bloquearPantalla(false));
}

function agregarAlista(objeto)
{
    let instancia = instanciarClases(JSON.stringify(objeto));
    listaObjetosParseados.push(instancia);
    actualizarTabla();
    switchForms();
}

function aplicarEstilos()
{
    // formDatos.style.width = "50vw";
    // formDatos.style.margin = "auto";

    // formAbm.style.width = "50vw";
    // formAbm.style.margin = "auto";
}





