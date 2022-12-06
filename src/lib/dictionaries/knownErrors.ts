// This is a dictionary that replaces known error with usable text messages

export const knownErrors = (error: string) => {
  if (error.includes('Unique constraint failed')) {
    return 'Este campo ya existe, favor ingrese un valor distinto.';
  }
  if (error === 'admin-only') {
    return 'Esta operación solo esta habilitada para Administradores.';
  }

  return 'Hubo un error, favor intente nuevamente';
};
