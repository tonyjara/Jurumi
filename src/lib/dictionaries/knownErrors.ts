// This is a dictionary that replaces known error with usable text messages

export const knownErrors = (error: string) => {
  if (error.includes('Unique constraint failed')) {
    return 'Este campo ya existe, favor ingrese un valor distinto.';
  }
  if (error.includes('New record already exists.')) {
    return 'Solo pueden modificarse las últimas transacciones en una cuenta.';
  }
  if (error === 'admin-only') {
    return 'Esta operación solo esta habilitada para Administradores.';
  }
  if (error === 'User not money admin') {
    return 'Esta operación solo esta habilitada para miembros de Administración.';
  }

  return 'Hubo un error, favor intente nuevamente';
};
