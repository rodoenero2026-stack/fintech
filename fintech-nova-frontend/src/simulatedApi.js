const NOMBRE_DB = "fintech_nova_v1";

const datosIniciales = {
  admin: {
    carteraGlobal: 8500,
    usuarios: [
      { id: 1, nombre: "Alejandro R.", email: "ale@fintech.com", kyc: "Verificado", monto: 5000 },
      { id: 2, nombre: "Admin Nova", email: "admin@nova.com", kyc: "Pendiente", monto: 3500 }
    ],
    historialGlobal: []
  },
  usuarioFrein: {
    nombre: "Joan Francisco",
    estaAprobado: false,
    statusSolicitud: "ninguna",
    montoSolicitado: 0,
    montoPagado: 0,
    proximoPago: null,
    diaPago: 15,
    historial: [],
    historialPrestamos: []
  }
};

const leerDB = () => {
  const data = localStorage.getItem(NOMBRE_DB);
  try {
    return data ? JSON.parse(data) : datosIniciales;
  } catch (e) {
    return datosIniciales;
  }
};

const guardarDB = (data) => {
  localStorage.setItem(NOMBRE_DB, JSON.stringify(data));
};

// Exportaciones corregidas para evitar pantallas en blanco
export const obtenerDatosUsuario = () => {
  const db = leerDB();
  return db.usuarioFrein || datosIniciales.usuarioFrein;
};

export const obtenerDatosAdmin = () => {
  const db = leerDB();
  return db.admin || datosIniciales.admin;
};

//HECHO
export const solicitarPrestamoApi = async (datos) => {
  // 1. Recuperamos el Token y el ID del usuario que guardamos en el Login
  const token = localStorage.getItem('token');
  const idUsuario = localStorage.getItem('userId') || 1; // Ajusta según cómo guardes el ID

  try {
    const respuesta = await fetch("https://fintechnova-api.onrender.com/api/prestamos/simular", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 2. Pasamos la "llave" para que C# nos deje entrar
        'Authorization': `Bearer ${token}`
      },
      // 3. Mapeamos los nombres del front a los nombres que espera tu DTO en C#
      body: JSON.stringify({
        IdUsuario: parseInt(idUsuario),
        Monto: parseFloat(datos.monto),
        Meses: parseInt(datos.plazo || datos.meses),
        CURP: datos.curp || "",
        INE: datos.ine || "",
        ReciboLuzAgua: datos.reciboLuzAgua || "",
        ComprobanteIngresos: datos.comprobanteIngresos || "",
        EstadoCuenta: datos.estadoCuenta || ""
      })
    });

    if (respuesta.ok) {
      const resultado = await respuesta.json();
      return { success: true, data: resultado };
    } else {
      const errorTexto = await respuesta.text();
      console.error("Error del servidor:", errorTexto);
      return { success: false, error: errorTexto };
    }
  } catch (error) {
    console.error("Error de red:", error);
    return { success: false, error: "No se pudo conectar con el servidor" };
  }
};

//TODO: Implementar función para aprobar/rechazar préstamos desde el Admin
export const decidirPrestamo = (decision) => {
  const db = leerDB();
  if (decision === 'aprobar') {
    db.usuarioFrein.estaAprobado = true;
    db.usuarioFrein.statusSolicitud = "aprobado";
    db.usuarioFrein.proximoPago = "15 de Mayo, 2026";
    db.admin.carteraGlobal += Number(db.usuarioFrein.montoSolicitado);
    db.admin.historialGlobal.push({
      fecha: new Date().toLocaleDateString(),
      usuario: db.usuarioFrein.nombre,
      tipo: "Desembolso",
      monto: db.usuarioFrein.montoSolicitado
    });
  } else if (decision === 'rechazar') {
    db.usuarioFrein.statusSolicitud = "rechazado";
    db.usuarioFrein.estaAprobado = false;
  }
  guardarDB(db);
  window.dispatchEvent(new Event('storage'));
};

//TODO: Implementar función para registrar pagos desde el UserDashboard
export const registrarPagoApi = (tipo, monto) => {
  try {
    const db = leerDB();
    const montoNum = Number(monto);

    if (!db.usuarioFrein) db.usuarioFrein = { ...datosIniciales.usuarioFrein };

    const nuevoMovimiento = {
      id: Date.now(),
      concepto: tipo === 'liquidar' ? "Liquidación Total" : "Pago Mensualidad",
      fecha: new Date().toLocaleDateString(),
      monto: montoNum,
      estado: 'Completado'
    };

    if (!Array.isArray(db.usuarioFrein.historial)) db.usuarioFrein.historial = [];
    db.usuarioFrein.historial.push(nuevoMovimiento);
    db.usuarioFrein.montoPagado = (Number(db.usuarioFrein.montoPagado) || 0) + montoNum;

    if (db.admin && db.admin.historialGlobal) {
      db.admin.historialGlobal.push({
        fecha: nuevoMovimiento.fecha,
        usuario: db.usuarioFrein.nombre || "Usuario",
        tipo: `Pago (${tipo})`,
        monto: montoNum
      });
      db.admin.carteraGlobal = (Number(db.admin.carteraGlobal) || 0) - montoNum;
    }

    const montoBase = Number(db.usuarioFrein.montoSolicitado || 0);
    if (tipo === 'liquidar' || db.usuarioFrein.montoPagado >= (montoBase * 1.1)) {
      db.usuarioFrein.statusSolicitud = "ninguna";
      db.usuarioFrein.estaAprobado = false;
      db.usuarioFrein.montoSolicitado = 0;
      db.usuarioFrein.montoPagado = 0;
      db.usuarioFrein.proximoPago = null;
    }

    guardarDB(db);
    window.dispatchEvent(new Event('storage'));
    return true;
  } catch (error) {
    console.error("Error crítico en API:", error);
    return false;
  }
};