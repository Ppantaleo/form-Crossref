function generarDoiBatchId() {
    // Generar un doi_batch_id único de entre 4 y 100 caracteres
    var length = Math.floor(Math.random() * (97 - 4 + 1)) + 4;
    var characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var doiBatchId = "";
    for (var i = 0; i < length; i++) {
        doiBatchId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return doiBatchId;
}

function generarTimestamp() {
    // Obtener la fecha y hora actuales en el formato AAAAMMDDHHMMSS
    var now = new Date();
    var timestamp = now.getFullYear() +
        ('0' + (now.getMonth() + 1)).slice(-2) +
        ('0' + now.getDate()).slice(-2) +
        ('0' + now.getHours()).slice(-2) +
        ('0' + now.getMinutes()).slice(-2) +
        ('0' + now.getSeconds()).slice(-2);
    return timestamp;
}

function generarXML() {
    // Crear el elemento raíz <doi_batch> con los atributos especificados
    var doiBatch = document.createElement("doi_batch");
    doiBatch.setAttribute("version", "4.4.2");
    doiBatch.setAttribute("xmlns", "http://www.crossref.org/schema/4.4.2");
    doiBatch.setAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
    doiBatch.setAttribute("xsi:schemaLocation", "http://www.crossref.org/schema/4.4.2 http://data.crossref.org/schemas/crossref4.4.2.xsd");

    // Crear elementos "head" y "body"
    var head = document.createElement("head");

    // Agregar <doi_batch_id> al "head"
    var doiBatchId = document.createElement("doi_batch_id");
    doiBatchId.textContent = generarDoiBatchId(); // Generar un doi_batch_id único
    head.appendChild(doiBatchId);

    // Agregar <timestamp> al "head"
    var timestamp = document.createElement("timestamp");
    timestamp.textContent = generarTimestamp(); // Generar la marca de tiempo actual
    head.appendChild(timestamp);

    // Agregar <depositor> al "head"
    var depositor = document.createElement("depositor");

    // Agregar <depositor_name> al "depositor"
    var depositorName = document.createElement("depositor_name");
    depositorName.textContent = document.getElementById("depositante").value; // Obtener del campo correspondiente
    depositor.appendChild(depositorName);

    // Agregar <email_address> al "depositor"
    var emailAddress = document.createElement("email_address");
    emailAddress.textContent = document.getElementById("emailDepositante").value; // Obtener del campo correspondiente
    depositor.appendChild(emailAddress);

    head.appendChild(depositor);

    // Agregar <registrant> al "head"
    var registrant = document.createElement("registrant");
    registrant.textContent = document.getElementById("registrante").value; // Obtener del campo correspondiente
    head.appendChild(registrant);

    var body = document.createElement("body");

    // Agregar elementos al "head"
    // Puedes personalizar y agregar más elementos según tus necesidades

    // Agregar "head" al "doi_batch"
    doiBatch.appendChild(head);

    // Obtener valores de los nuevos campos
    var tipoContenido = document.getElementById("tipoContenido").value;

    // Agregar nuevos elementos al "body"
    var postedContent = document.createElement("posted_content");
    postedContent.setAttribute("type", tipoContenido); // Establecer el tipo de contenido

    body.appendChild(postedContent);

    // Agregar "body" al "doi_batch"
    doiBatch.appendChild(body);

    // Convertir el objeto DOI Batch a una cadena XML
    var xmlString = '<?xml version="1.0" encoding="utf-8"?>\n' + doiBatch.outerHTML;

    // Añadir saltos de línea y espacios para mejorar la legibilidad
    xmlString = xmlString.replace(/></g, '>\n<');

    // Mostrar el XML generado
    document.getElementById("xmlOutput").innerText = xmlString;

    // Almacenar el XML generado en una variable global
    window.generatedXML = xmlString;

    // Mostrar el botón de Descargar
    document.getElementById("downloadButton").style.display = "inline";
}

function descargarXML() {
    // Descargar el archivo XML
    var blob = new Blob([window.generatedXML], { type: "application/xml" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "archivo.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
