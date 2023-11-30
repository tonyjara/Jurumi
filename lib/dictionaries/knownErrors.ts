// This is a dictionary that replaces known error with usable text messages

export const knownErrors = (error: string) => {
  if (error.includes("(`taxPayerId`,`facturaNumber`)")) {
    return "Este contribuyente ya tiene una factura con el mismo número, favor pongase en contacto con el administrador para solucionar este problema. ";
  }
  if (error.includes("Unique constraint failed")) {
    return "Este campo ya existe, favor ingrese un valor distinto.";
  }
  if (error.includes("missing data")) {
    return "Algunos datos no fueron enviados. Favor refresque la página e intente nuevamente.";
  }
  if (error.includes("New record already exists.")) {
    return "Solo pueden modificarse las últimas transacciones en una cuenta.";
  }
  if (error.includes("admin-only")) {
    return "Esta operación solo esta habilitada para Administradores.";
  }
  if (error.includes("User not money admin")) {
    return "Esta operación solo esta habilitada para miembros de Administración.";
  }
  if (error.includes("No secret or selectedOrg")) {
    return "No hay una organización seleccionada.";
  }
  if (error.includes("Only admins can create admins.")) {
    return "Solo admins puededen crear admins.";
  }
  if (error.includes("User needs to wait more before new email")) {
    return "Debes esperar unos minutos antes de intentar de nuevo.";
  }
  if (error.includes("Membership already exists")) {
    return "El usuario ya esta asociado";
  }
  if (error.includes("Alguna de las solicitudes no existe")) {
    return "Alguna de las solicitudes no existe";
  }

  console.error(error);
  return "Hubo un error, favor intente nuevamente";
};
