// DATOS DE EMPLEADO

const empleados = [
    { nombre: "Kevin Garibay", email: "KevGaribay16.com", pass: "Kev1655", cargo: "Dueño" }
]

// HABITACIONES

let habitaciones = [
    { num: "101", tipo: "Simple", precio: 650, disponible: "Disponible" },
    { num: "102", tipo: "Simple", precio: 650, disponible: "Ocupada" },
    { num: "201", tipo: "Doble", precio: 950, disponible: "Disponible" },
    { num: "202", tipo: "Doble", precio: 950, disponible: "Disponible" },
    { num: "301", tipo: "Suite", precio: 1800, disponible: "Disponible" },
    { num: "401", tipo: "Premium", precio: 2500, disponible: "Ocupada" }
]

// RESERVACIONES

let reservaciones = [
    { id: "GH-001", cliente: "Ana Lopez", hab: "102", tipo: "Simple", checkin: "2026-03-10", checkout: "2026-03-13", estado: "Activa", pago: "Efectivo" },
    { id: "GH-002", cliente: "Carlos Ruiz", hab: "401", tipo: "Premium", checkin: "2026-03-12", checkout: "2026-03-15", estado: "Activa", pago: "Tarjeta" }
]

let contadorRes = 3
let empleadoActual = null
let habitacionSeleccionada = null

// LOGIN

function entrarComoCliente() {
    mostrarPantalla("screen-cliente")
    renderHabitaciones()
}

function mostrarLoginEmpleado() {
    document.getElementById("login-empleado").style.display = "block"
}

function doLogin() {
    let usuario = document.getElementById("login-user").value //usuario escribe los datos
    let contraseña = document.getElementById("login-pass").value

    if (usuario == "" || contraseña == "") { //verificacion que no esten vacios
        alert("Por favor llena todos los campos")
        return
    }

    let encontrado = empleados.find(e => e.email == usuario && e.pass == contraseña) //busca en el arreglo

    if (encontrado) { //si los encuentra entre
        empleadoActual = encontrado
        document.getElementById("emp-nombre").textContent = encontrado.nombre
        document.getElementById("emp-cargo").textContent = encontrado.cargo
        mostrarPantalla("screen-empleado")
        renderReservaciones()
        renderHabitacionesEmpleado()
        popularSelectHabitaciones()
    } else { //si no los encuentra no entra
        alert("Usuario o contraseña incorrectos")
    }
}

// NAVEGACIÓN

function mostrarPantalla(id) {
    document.querySelectorAll(".pantalla").forEach(p => p.style.display = "none")
    document.getElementById(id).style.display = "block"
}

function salir() {
    empleadoActual = null
    habitacionSeleccionada = null
    document.getElementById("login-user").value = ""
    document.getElementById("login-pass").value = ""
    document.getElementById("login-empleado").style.display = "none"
    mostrarPantalla("screen-login")
}

// CLIENTE - HABITACIONES

function renderHabitaciones() {
    let tipo = document.getElementById("filtro-tipo").value
    let disponibles = habitaciones.filter(h => h.disponible == "Disponible" && (tipo == "" || h.tipo == tipo))
    let contenedor = document.getElementById("lista-habitaciones")

    if (disponibles.length == 0) {
        contenedor.innerHTML = "<p>No hay habitaciones disponibles.</p>"
        return
    }

    contenedor.innerHTML = disponibles.map(h => `
        <div class="hab-card ${habitacionSeleccionada?.num == h.num ? 'seleccionada' : ''}" onclick="seleccionarHab('${h.num}')">
            <h3>#${h.num}</h3>
            <p>${h.tipo}</p>
            <p>$${h.precio.toLocaleString()}/noche</p>
            <span class="badge-disponible">Disponible</span>
        </div>
    `).join("")
}

function seleccionarHab(num) {
    habitacionSeleccionada = habitaciones.find(h => h.num == num)
    renderHabitaciones()
}

function siguientePaso1() {
    let checkin = document.getElementById("checkin").value
    let checkout = document.getElementById("checkout").value

    if (!checkin || !checkout) { alert("Selecciona las fechas"); return }
    if (!habitacionSeleccionada) { alert("Selecciona una habitación"); return }
    if (checkin >= checkout) { alert("La fecha de salida debe ser después de la entrada"); return }

    document.getElementById("s2-tipo").value = habitacionSeleccionada.tipo
    document.getElementById("s2-num").value = "#" + habitacionSeleccionada.num
    document.getElementById("s2-precio").value = "$" + habitacionSeleccionada.precio.toLocaleString()
    document.getElementById("s2-checkin").value = checkin
    document.getElementById("s2-checkout").value = checkout

    mostrarPantalla("screen-paso2")
}

function siguientePaso2() {
    let nombre = document.getElementById("s2-nombre").value.trim()
    let tel = document.getElementById("s2-tel").value.trim()
    let email = document.getElementById("s2-email").value.trim()

    if (!nombre || !tel || !email) { alert("Completa todos tus datos"); return }

    let checkin = document.getElementById("s2-checkin").value
    let checkout = document.getElementById("s2-checkout").value
    let noches = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24))
    let total = noches * habitacionSeleccionada.precio

    document.getElementById("conf-nombre").textContent = nombre
    document.getElementById("conf-hab").textContent = "#" + habitacionSeleccionada.num + " — " + habitacionSeleccionada.tipo
    document.getElementById("conf-checkin").textContent = checkin
    document.getElementById("conf-checkout").textContent = checkout
    document.getElementById("conf-noches").textContent = noches
    document.getElementById("conf-total").textContent = "$" + total.toLocaleString()

    mostrarPantalla("screen-paso3")
}

function confirmarReserva() {
    let pago = document.getElementById("tipo-pago").value
    let nombre = document.getElementById("s2-nombre").value.trim()
    let id = "GH-00" + (++contadorRes)

    reservaciones.push({
        id, cliente: nombre,
        hab: habitacionSeleccionada.num,
        tipo: habitacionSeleccionada.tipo,
        checkin: document.getElementById("s2-checkin").value,
        checkout: document.getElementById("s2-checkout").value,
        estado: "Activa", pago
    })

    let hab = habitaciones.find(h => h.num == habitacionSeleccionada.num)
    if (hab) hab.disponible = "Ocupada"

    document.getElementById("exito-id").textContent = id
    document.getElementById("exito-hab").textContent = "#" + habitacionSeleccionada.num + " — " + habitacionSeleccionada.tipo
    document.getElementById("exito-checkin").textContent = document.getElementById("s2-checkin").value
    document.getElementById("exito-checkout").textContent = document.getElementById("s2-checkout").value
    document.getElementById("exito-total").textContent = document.getElementById("conf-total").textContent
    document.getElementById("exito-pago").textContent = pago

    habitacionSeleccionada = null
    mostrarPantalla("screen-exito")
}

function nuevaReserva() {
    mostrarPantalla("screen-cliente")
    renderHabitaciones()
}
