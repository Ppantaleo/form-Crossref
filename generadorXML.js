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
    try {
        // Crear el elemento raíz <doi_batch> con los atributos especificados
        var doiBatch = document.createElementNS("http://www.crossref.org/schema/4.4.2", "doi_batch");
        doiBatch.setAttribute("version", "4.4.2");
        doiBatch.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
        doiBatch.setAttributeNS("http://www.w3.org/2001/XMLSchema-instance", "xsi:schemaLocation", "http://www.crossref.org/schema/4.4.2 http://data.crossref.org/schemas/crossref4.4.2.xsd");

        // Crear elementos "head" y "body" con el espacio de nombres correcto
        var head = document.createElementNS("http://www.crossref.org/schema/4.4.2", "head");
        var body = document.createElementNS("http://www.crossref.org/schema/4.4.2", "body");

        // Agregar <doi_batch_id> al "head"
        var doiBatchId = document.createElementNS("http://www.crossref.org/schema/4.4.2", "doi_batch_id");
        doiBatchId.textContent = generarDoiBatchId(); // Generar un doi_batch_id único
        head.appendChild(doiBatchId);

        // Agregar <timestamp> al "head"
        var timestamp = document.createElementNS("http://www.crossref.org/schema/4.4.2", "timestamp");
        timestamp.textContent = generarTimestamp(); // Generar la marca de tiempo actual
        head.appendChild(timestamp);

        // Agregar <depositor> al "head"
        var depositor = document.createElementNS("http://www.crossref.org/schema/4.4.2", "depositor");

        // Agregar <depositor_name> al "depositor"
        var depositorName = document.createElementNS("http://www.crossref.org/schema/4.4.2", "depositor_name");
        depositorName.textContent = document.getElementById("depositante").value; // Obtener del campo correspondiente
        depositor.appendChild(depositorName);

        // Agregar <email_address> al "depositor"
        var emailAddress = document.createElementNS("http://www.crossref.org/schema/4.4.2", "email_address");
        emailAddress.textContent = document.getElementById("emailDepositante").value; // Obtener del campo correspondiente
        depositor.appendChild(emailAddress);

        head.appendChild(depositor);

        // Agregar <registrant> al "head"
        var registrant = document.createElementNS("http://www.crossref.org/schema/4.4.2", "registrant");
        registrant.textContent = document.getElementById("registrante").value; // Obtener del campo correspondiente
        head.appendChild(registrant);

        // Agregar "head" y "body" al "doi_batch"
        doiBatch.appendChild(head);
        doiBatch.appendChild(body);

        // Obtener valores de los nuevos campos
        var tipoContenido = document.getElementById("tipoContenido").value;

        // Agregar nuevos elementos al "body"
        var postedContent = document.createElementNS("http://www.crossref.org/schema/4.4.2", "posted_content");
        postedContent.setAttribute("type", tipoContenido); // Establecer el tipo de contenido

        // Agregar <contributors> al "posted_content"
        var contributors = document.createElementNS("http://www.crossref.org/schema/4.4.2", "contributors");

        // Obtener autores dinámicamente
        var autoresContainer = document.getElementById("autoresContainer");
        var autorElements = autoresContainer.getElementsByClassName("autor");

        for (var i = 0; i < autorElements.length; i++) {
            var autor = autorElements[i];
            var personName = document.createElementNS("http://www.crossref.org/schema/4.4.2", "person_name");

            // Obtener valores del autor
            var nombre = autor.querySelector(".nombre").value;
            var apellido = autor.querySelector(".apellido").value;
            var sequence = autor.querySelector(".sequence").value;
            var contributorRole = autor.querySelector(".contributorRole").value;
            var afiliacion = autor.querySelector(".afiliacion").value;
            var orcid = autor.querySelector(".orcid").value;

            personName.setAttribute("sequence", sequence);
            personName.setAttribute("contributor_role", contributorRole);

            var givenName = document.createElementNS("http://www.crossref.org/schema/4.4.2", "given_name");
            givenName.textContent = nombre;
            personName.appendChild(givenName);

            var surname = document.createElementNS("http://www.crossref.org/schema/4.4.2", "surname");
            surname.textContent = apellido;
            personName.appendChild(surname);

            var affiliation = document.createElementNS("http://www.crossref.org/schema/4.4.2", "affiliation");
            affiliation.textContent = afiliacion;
            personName.appendChild(affiliation);

            var orcidElement = document.createElementNS("http://www.crossref.org/schema/4.4.2", "ORCID");
            orcidElement.textContent = orcid;
            personName.appendChild(orcidElement);

            contributors.appendChild(personName);
        }

        postedContent.appendChild(contributors);

        // Agregar <titles> y <title> al "posted_content"
        var titles = document.createElementNS("http://www.crossref.org/schema/4.4.2", "titles");
        var title = document.createElementNS("http://www.crossref.org/schema/4.4.2", "title");
        title.textContent = document.getElementById("tituloContenido").value; // Obtener del campo correspondiente
        titles.appendChild(title);
        postedContent.appendChild(titles);

        // Obtener valores de las fechas
        var postedDateValue = document.getElementById("postedDate").value;
        var acceptanceDateValue = document.getElementById("acceptanceDate").value;

       // Agregar <posted_date> al "posted_content"
        var postedDate = document.createElementNS("http://www.crossref.org/schema/4.4.2", "posted_date");
        var postedDateComponents = postedDateValue.split('-');
        var postedDateMonth = document.createElementNS("http://www.crossref.org/schema/4.4.2", "month");
        postedDateMonth.textContent = postedDateComponents[1];
        var postedDateDay = document.createElementNS("http://www.crossref.org/schema/4.4.2", "day");
        postedDateDay.textContent = postedDateComponents[2];
        var postedDateYear = document.createElementNS("http://www.crossref.org/schema/4.4.2", "year");
        postedDateYear.textContent = postedDateComponents[0];
        postedDate.appendChild(postedDateMonth);
        postedDate.appendChild(postedDateDay);
        postedDate.appendChild(postedDateYear);
        postedContent.appendChild(postedDate);

        // Obtener el valor del campo acceptanceDate desde el formulario
        var acceptanceDateValue = document.getElementById("acceptanceDate").value;

        // Verificar si hay un valor antes de agregar <acceptance_date> al "posted_content"
        if (acceptanceDateValue) {
            var acceptanceDate = document.createElementNS("http://www.crossref.org/schema/4.4.2", "acceptance_date");
            var acceptanceDateComponents = acceptanceDateValue.split('-');
            var acceptanceDateMonth = document.createElementNS("http://www.crossref.org/schema/4.4.2", "month");
            acceptanceDateMonth.textContent = acceptanceDateComponents[1];
            var acceptanceDateDay = document.createElementNS("http://www.crossref.org/schema/4.4.2", "day");
            acceptanceDateDay.textContent = acceptanceDateComponents[2];
            var acceptanceDateYear = document.createElementNS("http://www.crossref.org/schema/4.4.2", "year");
            acceptanceDateYear.textContent = acceptanceDateComponents[0];
            acceptanceDate.appendChild(acceptanceDateMonth);
            acceptanceDate.appendChild(acceptanceDateDay);
            acceptanceDate.appendChild(acceptanceDateYear);
            postedContent.appendChild(acceptanceDate);
        }

        // Obtener valores de los campos del formulario
        var doiValue = document.getElementById("doi").value;
        var resourceValue = document.getElementById("resource").value;

        // Verificar si se proporcionó un DOI y una Resource
        if (doiValue && resourceValue) {
            // Crear elementos para doi_data
            var doiData = document.createElementNS("http://www.crossref.org/schema/4.4.2", "doi_data");

            // Crear elemento para doi
            var doiElement = document.createElementNS("http://www.crossref.org/schema/4.4.2", "doi");
            doiElement.textContent = doiValue;
            doiData.appendChild(doiElement);

            // Crear elemento para resource
            var resourceElement = document.createElementNS("http://www.crossref.org/schema/4.4.2", "resource");
            resourceElement.textContent = resourceValue;
            doiData.appendChild(resourceElement);

            // Agregar doi_data al cuerpo del XML
            postedContent.appendChild(doiData);
        }

        body.appendChild(postedContent);

        // Agregar "body" al "doi_batch"
        doiBatch.appendChild(body);

        // Convertir el objeto DOI Batch a una cadena XML
        var xmlString = '<?xml version="1.0" encoding="utf-8"?>\n' + new XMLSerializer().serializeToString(doiBatch);

        // Añadir saltos de línea y espacios para mejorar la legibilidad
        xmlString = xmlString.replace(/></g, '>\n<');

        // Mostrar el XML generado
        document.getElementById("xmlOutput").innerText = xmlString;

        // Almacenar el XML generado en una variable global
        window.generatedXML = xmlString;

        // Mostrar el botón de Descargar
        document.getElementById("downloadButton").style.display = "inline";
    } catch (error) {
        console.error("Error al generar XML:", error);
    }
}

// Función para agregar las opciones para Contributor Role al primer autor al cargar la página
function agregarOpcionesContributorRole() {
    var primerAutor = document.querySelector("#autoresContainer .autor");
    var selectContributorRole = primerAutor.querySelector(".contributorRole");

    var roles = [
        "author",
        "editor",
        "chair",
        "reviewer",
        "review-assistant",
        "stats-reviewer",
        "reviewer-external",
        "reader",
        "translator"
    ];

    roles.forEach(function (role) {
        var option = document.createElement("option");
        option.value = role;
        option.textContent = role.charAt(0).toUpperCase() + role.slice(1); // Capitalizar la primera letra
        selectContributorRole.appendChild(option);
    });
}

// Agregar evento al cargar la página
document.addEventListener('DOMContentLoaded', agregarOpcionesContributorRole);


// Función para agregar un nuevo autor
function agregarAutor() {
    var autoresContainer = document.getElementById("autoresContainer");

    // Crear nuevo div para el nuevo autor
    var nuevoAutor = document.createElement("div");
    nuevoAutor.classList.add("autor");

    // Crear campos para el nuevo autor
    var labelNombre = document.createElement("label");
    labelNombre.textContent = "Nombre:";
    var inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.classList.add("nombre");
    inputNombre.required = true;

    var labelApellido = document.createElement("label"); // Nuevo campo Apellido
    labelApellido.textContent = "Apellido:";
    var inputApellido = document.createElement("input");
    inputApellido.type = "text";
    inputApellido.classList.add("apellido");
    inputApellido.required = true;

    var labelSequence = document.createElement("label");
    labelSequence.textContent = "Sequence:";
    var selectSequence = document.createElement("select");
    selectSequence.classList.add("sequence");
    var optionFirst = document.createElement("option");
    optionFirst.value = "first";
    optionFirst.textContent = "First";
    var optionAdditional = document.createElement("option");
    optionAdditional.value = "additional";
    optionAdditional.textContent = "Additional";
    selectSequence.appendChild(optionFirst);
    selectSequence.appendChild(optionAdditional);

    var labelContributorRole = document.createElement("label");
    labelContributorRole.textContent = "Contributor Role:";
    var selectContributorRole = document.createElement("select");
    selectContributorRole.classList.add("contributorRole");

    // Agrega las opciones para Contributor Role
    var roles = [
        "author",
        "editor",
        "chair",
        "reviewer",
        "review-assistant",
        "stats-reviewer",
        "reviewer-external",
        "reader",
        "translator"
    ];

    roles.forEach(function (role) {
        var option = document.createElement("option");
        option.value = role;
        option.textContent = role.charAt(0).toUpperCase() + role.slice(1); // Capitalizar la primera letra
        selectContributorRole.appendChild(option);
    });

    var labelAfiliacion = document.createElement("label"); // Nuevo campo Afiliación
    labelAfiliacion.textContent = "Afiliación:";
    var inputAfiliacion = document.createElement("input");
    inputAfiliacion.type = "text";
    inputAfiliacion.classList.add("afiliacion");

    var labelOrcid = document.createElement("label"); // Nuevo campo ORCID
    labelOrcid.textContent = "ORCID:";
    var inputOrcid = document.createElement("input");
    inputOrcid.type = "text";
    inputOrcid.classList.add("orcid");

    // Agregar campos al nuevo autor
    nuevoAutor.appendChild(labelNombre);
    nuevoAutor.appendChild(inputNombre);
    nuevoAutor.appendChild(labelApellido);
    nuevoAutor.appendChild(inputApellido);
    nuevoAutor.appendChild(labelSequence);
    nuevoAutor.appendChild(selectSequence);
    nuevoAutor.appendChild(labelContributorRole);
    nuevoAutor.appendChild(selectContributorRole);
    nuevoAutor.appendChild(labelAfiliacion);
    nuevoAutor.appendChild(inputAfiliacion);
    nuevoAutor.appendChild(labelOrcid);
    nuevoAutor.appendChild(inputOrcid);

    // Agregar nuevo autor al contenedor
    autoresContainer.appendChild(nuevoAutor);
}

function descargarXML() {
    // Obtener el valor del campo DOI
    var doiValue = document.getElementById("doi").value;

    // Verificar si hay un valor en el campo DOI
    if (doiValue) {
        // Descargar el archivo XML con el nombre del campo DOI
        var blob = new Blob([window.generatedXML], { type: "application/xml" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = doiValue + ".xml"; // Usar el valor del campo DOI como nombre del archivo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } else {
        // Mostrar un mensaje de error si no se proporciona un valor en el campo DOI
        alert("Please enter a value in the DOI field before downloading the file.");
    }
}