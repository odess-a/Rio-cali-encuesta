// =====================================================================
// SCRIPT DE GOOGLE APPS SCRIPT PARA CONECTAR LA ENCUESTA A GOOGLE SHEETS
// =====================================================================
// INSTRUCCIONES:
// 1. Abre Google Sheets (https://sheets.new) y crea una nueva hoja.
// 2. Nombra las columnas de la fila 1 así:
//    A1: Marca temporal | B1: Frecuencia (P1) | C1: Basuras (P2) | D1: Canecas (P3) | E1: Olores/Baño (P4) | F1: Causa Principal (P5) | G1: Comentario / Nombre
// 3. En el menú superior de Google Sheets, ve a: Extensiones -> Apps Script.
// 4. Borra lo que aparezca y pega este código completo.
// 5. Haz clic en "Implementar" (botón azul arriba a la derecha) -> "Nueva implementación".
// 6. Selecciona tipo: "Aplicación web".
// 7. En "Quién tiene acceso", selecciona: "Cualquier persona" (Anyone).
// 8. Haz clic en "Implementar", autoriza los permisos y COPIA la "URL de la aplicación web".
// 9. Pega esa URL en tu index.html en la variable GOOGLE_SHEETS_URL.
// =====================================================================

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // Obtener los datos enviados
    var data = e.parameter;
    
    // Si viene como JSON en el cuerpo
    if ((!data || Object.keys(data).length === 0) && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch(err) {}
    }

    var fechaActual = new Date();
    var fechaFormateada = Utilities.formatDate(fechaActual, "America/Bogota", "yyyy-MM-dd HH:mm:ss");

    // Agregar la fila con las respuestas
    sheet.appendRow([
      fechaFormateada,
      data.q1 || "No especificado",
      data.q2 || "No especificado",
      data.q3 || "No especificado",
      data.q4 || "No especificado",
      data.q5 || "No especificado",
      data.comentario || "Sin comentarios adicionales"
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      result: "success",
      message: "Respuesta registrada correctamente en Google Sheets"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      result: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  return ContentService.createTextOutput("El webhook de la encuesta del Río Cali está activo y listo para recibir respuestas.");
}
