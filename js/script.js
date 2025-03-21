function calcularAngulo(altura, base) {
    const radian = Math.atan2(altura, base)
    const deg = radian * (180 / Math.PI)
    return deg
}

function ponerAnguloAOjos(elemento, deg) {
    elemento.style.transform = `rotate(${deg}deg)`
}

function calcularPosicion(elemento) {
    const rect = elemento.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    return { x: centerX, y: centerY }
}

function gestionarMovimiento(event) {
    const ojos = document.querySelectorAll("#imagen span")

    ojos.forEach(e => {
        const pos = calcularPosicion(e)
        const altura = event.clientY - pos.y
        const base = event.clientX - pos.x
        const deg = calcularAngulo(altura, base)
        ponerAnguloAOjos(e, deg + 90)
    })
}

// ====== MOSCA ======= //

const CURSOR_WIDTH = 30 + 7

function actualizarCursor(event) {
    let x = event.clientX
    let y = event.clientY
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    // === Ajuste para prevenir overflow === //
    if (x + CURSOR_WIDTH > viewportWidth) {
        x = viewportWidth - CURSOR_WIDTH;
    } else if (x < 0) {
        x = 0;
    }
    if (y + CURSOR_WIDTH > viewportHeight) {
        y = viewportHeight - CURSOR_WIDTH;
    } else if (y < 0) {
        y = 0;
    }

    // Set Posicion //
    const cursor = document.getElementById("cursor")
    cursor.style.left = `${x - cursor.offsetWidth / 2}px`
    cursor.style.top = `${y - cursor.offsetHeight / 2}px`

    // Set angulo //
    const pos = calcularPosicion(event.target)
    const altura = y - pos.y
    const base = x - pos.x
    const deg = calcularAngulo(altura, base)
    cursor.style.transform = `rotate(${deg - 45}deg)`

}

window.addEventListener("mousemove", actualizarCursor)


// ==== Movimiento ==== //

let interval = null
function animateToPosition(event) {
    const imagen = document.querySelector("#imagen")
    const rect = imagen.getBoundingClientRect()
    const startx = rect.left
    const starty = rect.top
    const cursorX = event.clientX - (rect.width / 2)
    const cursorY = event.clientY - (rect.height / 2)

    const refreshPerSecond = 60

    const progressX = (cursorX - startx) / refreshPerSecond
    const progressY = (cursorY - starty) / refreshPerSecond

    let itirations = 2 // empieza por 2 porque es un parche al mismatch de js al DOM

    if (!interval) {
        interval = setInterval(() => {
            running = true
            const movimientox = Math.round(startx + (progressX * itirations))
            const movimientoy = Math.round(starty + (progressY * itirations))
            itirations++
            if (itirations <= refreshPerSecond) {
                imagen.style.top = `${movimientoy}px`
                imagen.style.left = `${movimientox}px`
            } else {
                itirations = 1
                clearTimeout(interval)
                interval = null
            }
        }, 1000 / refreshPerSecond)
    }
}


const contenedor = document.querySelector("#contenedor")
contenedor.addEventListener("mousemove", gestionarMovimiento)
contenedor.addEventListener("click", animateToPosition)