// EMPLEADO - TABS

function empTab(tabId, btn) {
    document.querySelectorAll(".tab-content").forEach(t => t.style.display = "none")
    document.getElementById(tabId).style.display = "block"
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("activo"))
    btn.classList.add("activo")
}

// EMPLEADO - RESERVACIONES

function renderReservaciones() {
    let tbody = document.getElementById("tabla-reservaciones")
    tbody.innerHTML = reservaciones.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.cliente}</td>
            <td>#${r.hab}</td>
            <td>${r.tipo}</td>
            <td>${r.checkin}</td>
            <td>${r.checkout}</td>
            <td><span class="badge-${r.estado == 'Activa' ? 'disponible' : 'ocupada'}">${r.estado}</span></td>
            <td>
                ${r.estado == 'Activa' ? `<button onclick="cancelarRes('${r.id}')">Cancelar</button>` : ''}
                <button onclick="checkoutRes('${r.id}')">Check-out</button>
            </td>
        </tr>
    `).join("")
}

function cancelarRes(id) {
    let res = reservaciones.find(r => r.id == id)
    if (!res) return
    res.estado = "Cancelada"
    let hab = habitaciones.find(h => h.num == res.hab)
    if (hab) hab.disponible = "Disponible"
    renderReservaciones()
    alert("Reserva " + id + " cancelada")
}

function checkoutRes(id) {
    let res = reservaciones.find(r => r.id == id)
    if (!res) return
    res.estado = "Check-out"
    let hab = habitaciones.find(h => h.num == res.hab)
    if (hab) hab.disponible = "Disponible"
    renderReservaciones()
    alert("Check-out de " + id + " realizado")
}

// EMPLEADO - HABITACIONES

function renderHabitacionesEmpleado() {
    let tbody = document.getElementById("tabla-habitaciones")
    tbody.innerHTML = habitaciones.map(h => `
        <tr>
            <td>#${h.num}</td>
            <td>${h.tipo}</td>
            <td>$${h.precio.toLocaleString()}</td>
            <td><span class="badge-${h.disponible == 'Disponible' ? 'disponible' : 'ocupada'}">${h.disponible}</span></td>
        </tr>
    `).join("")
}

function agregarHabitacion() {
    let num = document.getElementById("ar-num").value.trim()
    let tipo = document.getElementById("ar-tipo").value
    let precio = parseFloat(document.getElementById("ar-precio").value)
    let disponible = document.getElementById("ar-disponible").value

    if (!num || !precio) { alert("Completa número y precio"); return }
    if (habitaciones.find(h => h.num == num)) { alert("Ya existe esa habitación"); return }

    habitaciones.push({ num, tipo, precio, disponible })
    renderHabitacionesEmpleado()
    popularSelectHabitaciones()
    alert("Habitación #" + num + " agregada")
    document.getElementById("ar-num").value = ""
    document.getElementById("ar-precio").value = ""
}

// EMPLEADO - NUEVA RESERVA

function popularSelectHabitaciones() {
    let select = document.getElementById("mr-hab")
    select.innerHTML = habitaciones
        .filter(h => h.disponible == "Disponible")
        .map(h => `<option value="${h.num}">#${h.num} — ${h.tipo} ($${h.precio.toLocaleString()}/noche)</option>`)
        .join("")
}

function empNuevaReserva() {
    let nombre = document.getElementById("mr-nombre").value.trim()
    let tel = document.getElementById("mr-tel").value.trim()
    let email = document.getElementById("mr-email").value.trim()
    let habNum = document.getElementById("mr-hab").value
    let pago = document.getElementById("mr-pago").value
    let checkin = document.getElementById("mr-checkin").value
    let checkout = document.getElementById("mr-checkout").value

    if (!nombre || !tel || !email || !habNum || !checkin || !checkout) {
        alert("Completa todos los campos"); return
    }
    if (checkin >= checkout) { alert("La salida debe ser después de la entrada"); return }

    let id = "GH-00" + (++contadorRes)
    let hab = habitaciones.find(h => h.num == habNum)

    reservaciones.push({
        id, cliente: nombre, hab: habNum,
        tipo: hab?.tipo || "-",
        checkin, checkout, estado: "Activa", pago
    })

    if (hab) hab.disponible = "Ocupada"
    renderReservaciones()
    popularSelectHabitaciones()
    alert("Reserva " + id + " registrada para " + nombre)

    document.getElementById("mr-nombre").value = ""
    document.getElementById("mr-tel").value = ""
    document.getElementById("mr-email").value = ""
}
