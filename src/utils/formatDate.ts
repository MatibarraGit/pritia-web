export interface FormattedDate {
  fechaDB: string;
  fechaJS: string;
  fechaMostrar: string;
}

export function formatDate(date: string | Date): FormattedDate {
  let dateObj: Date;
  
  if (typeof date === 'string' && date.includes('/')) {
    // Si la fecha viene en formato DD/MM/YYYY
    const [day, month, year] = date.split('/');
    // Crear la fecha usando UTC para evitar ajustes de zona horaria
    dateObj = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)));
  } else {
    // Para otros formatos de fecha
    dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { fechaDB: '', fechaJS: '', fechaMostrar: '' };
    }
  }

  // Usar métodos UTC para obtener los componentes de la fecha
  const año = dateObj.getUTCFullYear();
  const mes = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const dia = String(dateObj.getUTCDate()).padStart(2, '0');

  const fechaDB = `${año}-${mes}-${dia}`;
  const fechaJS = `${mes}-${dia}-${año}`;
  const fechaMostrar = `${dia}/${mes}/${año}`; 

  return { fechaDB, fechaJS, fechaMostrar };
}

