class Vehiculo
{
    id = 0;
    modelo = "";
    anoFabricacion = "";
    velMax = "";

    constructor (p_id, p_modelo, p_anoFabricacion, p_velMax)
    {
        this.id = p_id;
        this.modelo = p_modelo;
        this.anoFabricacion = p_anoFabricacion;
        this.velMax = p_velMax;
    }

    toString()
    {
        return "Id: " + this.id + ", modelo: " + this.modelo + ", anoFabricacion: " + this.anoFabricacion + ", velMax: " + this.velMax;
    }
}

class Auto extends Vehiculo
{
    cantidadPuertas = 0;
    asientos = 0;

    constructor (p_id, p_modelo, p_anoFabricacion, p_velMax, p_cantidadPuertas, p_asientos)
    {
        super(p_id, p_modelo, p_anoFabricacion, p_velMax);
        this.cantidadPuertas = p_cantidadPuertas;
        this.asientos = p_asientos;
    }

    toString()
    {
        return super.toString() + ", cantidadPuertas: " + this.cantidadPuertas + ", asientos: " + this.asientos;
    }
}

class Camion extends Vehiculo
{
    carga = 0;
    autonomia = "";

    constructor (p_id, p_modelo, p_anoFabricacion, p_velMax, p_carga, p_autonomia)
    {
        super(p_id, p_modelo, p_anoFabricacion, p_velMax);
        this.carga = p_carga;
        this.autonomia = p_autonomia;
    }


    toString()
    {
        return super.toString() + ", carga: " + this.carga + ", autonomia: " + this.autonomia;
    }
}

var columnasTabla = ["id", "modelo", "anoFabricacion", "velMax", "cantidadPuertas", "asientos", "carga", "autonomia"];
var cabecerasAdicionalesTabla = ["modificar", "eliminar"];
var url = "https://examenesutn.vercel.app/api/VehiculoAutoCamion";


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
        apiEliminar(url, objeto.id);
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
                if (e.hasOwnProperty("cantidadPuertas"))
                {
                    //{"id":1, "nombre":"Marcelo", "apellido":"Luque", "edad":45, "ventas":15000, "sueldo":2000}
                    //p_id, p_modelo, p_anoFabricacion, p_velMax, p_cantidadPuertas, p_asientos
                    return new Auto(e.id, e.modelo, e.anoFabricacion, e.velMax, e.cantidadPuertas, e.asientos);
                }
                else if (e.hasOwnProperty("carga"))
                {
                    //p_id, p_modelo, p_anoFabricacion, p_velMax, p_carga, p_autonomia
                    return new Camion(e.id, e.modelo, e.anoFabricacion, e.velMax, e.carga, e.autonomia);
                }
            });
    }
    else
    {
        let e = objetosGenericos;
        if (e.hasOwnProperty("cantidadPuertas"))
            {
                //{"id":1, "nombre":"Marcelo", "apellido":"Luque", "edad":45, "ventas":15000, "sueldo":2000}
                return new Auto(e.id, e.modelo, e.anoFabricacion, e.velMax, e.cantidadPuertas, e.asientos);
            }
            else if (e.hasOwnProperty("carga"))
            {
                return new Camion(e.id, e.modelo, e.anoFabricacion, e.velMax, e.carga, e.autonomia);
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
                console.log(datosStr);
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
    
    if (txtEdad.value > 0)
    {
        if(txtNombre.value != "" && txtApellido.value > 1985)
            {
                if (selectTipo.value == 1)
                    {
                        if (txtSueldo.value > 2 && txtVentas.value > 0)
                        {
                            nuevoObjeto = {id:txtId.value, modelo:txtNombre.value, anoFabricacion:txtApellido.value, velMax:txtEdad.value,
                                 cantidadPuertas:txtSueldo.value, asientos:txtVentas.value}; 
                            // nuevoObjeto = new Empleado(txtId.value, txtNombre.value, txtApellido.value, txtEdad.value, txtSueldo.value, txtVentas.value); 
                            
                            banderaOk = true;
                        }
                        else
                        {
                            window.alert("cantidadPuertas o asientos inválidos, deben ser mayor a dos!!!");
                        }
                    }
                else if (selectTipo.value == 2)
                {
                    if (txtCompras.value > 0 && txtTelefono.value > 0)
                    {
                        nuevoObjeto = {id:txtId.value, modelo:txtNombre.value, anoFabricacion:txtApellido.value, velMax:txtEdad.value,
                            carga:txtCompras.value, autonomia:txtTelefono.value}; 
                        // nuevoObjeto = new Cliente(txtId.value, txtNombre.value, txtApellido.value, txtEdad.value, txtCompras.value, txtTelefono.value); 
                        banderaOk = true;
                    }
                    else
                    {
                        window.alert("carga o autonomia inválidos, deben ser mayores a cero!!!");
                    }
                }
            }
            else
            {
                window.alert("modelo y/o anoFabricacion inválidos: \nEl modelo no puede estarvacío.\nEl año de fabricacion debe ser mayor a 1985");
            }
    } else {window.alert("La velMax debe ser mayor a 0")}
    

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
    console.log("dato: ");
    console.log(p);

    

    if (p instanceof Vehiculo)
    {
        abmSubtitulo.value = "Modificar"
        btnAceptar.style.display = "none";
        btnModificar.style.display = "inline-block";
        btnEliminar.style.display = "none";
        txtId.value = p.id;
        selectTipo.disabled = true;
        txtId.disabled = true;
        txtNombre.value = p.modelo;
        txtApellido.value = p.anoFabricacion;
        txtEdad.value = p.velMax;

        if (p instanceof Auto)
        {
            selectTipo.value = 1;
            txtSueldo.value = p.cantidadPuertas;
            txtVentas.value = p.asientos;
            txtCompras.value = "";
            txtTelefono.value = "";
        }
        else if (p instanceof Camion)
        {
            selectTipo.value = 2;
            txtCompras.value = p.carga;
            txtTelefono.value = p.autonomia;
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
        txtId.disabled = true;
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


async function apiAlta(url,objeto)
{
    try
    {
        bloquearPantalla(true);
        delete objeto.id;
        console.log(objeto);
        const respuesta = await fetch(url, {
            method: "POST",
            headers:{
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(objeto)
            })

        let json = await respuesta.json();
        if (respuesta.status = 200)
        {
            objeto.id = json.id;
            agregarAlista(objeto);
        }
    }
    catch(error)
    {
        window.alert("Error Del servidor - Status: " + respuesta.status + "Error: " + error);
    }
    finally
    {
        bloquearPantalla(false)
    }

}

function apiModificar(url, objeto)
{
    bloquearPantalla(true);
    fetch(url, {
        method: "PUT",
        headers:{
            "Content-Type": "Application/json"
        },
        body: JSON.stringify(objeto)
    })
    .then((respuesta) => 
        {
            return new Promise ((e, f) =>
            {
                if (respuesta.status == 200)
                {
                    e(respuesta.status);
                }
                else
                {
                    f(respuesta.status);
                }
            })
        })
    .then(status => {
        {
            console.log("Api modificar!!!");
            let objetoPrevio = buscarPersonaPorId(objeto.id);
            let indice = listaObjetosParseados.indexOf(objetoPrevio);
            listaObjetosParseados.splice(indice, 1);
            agregarAlista(objeto);
        }
    })
    .catch((error) => {window.alert("Error Del servidor - Status: " + error)})
    .then(() => bloquearPantalla(false));
}

function apiEliminar(url, idObjeto)
{
    objeto = {"id": `${idObjeto}`};

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
                e(respuesta);
            }
            else
                f(respuesta);
        });
    })
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





