const dbUrl = '/db.json';

//Inicialmente el dia seleccionado es null
let selectedDate = null;

const calendarDays = document.getElementById('calendarDays');
const availabilityButton = document.getElementById('availabilityButton');
const dayInfoContainer = document.getElementById('dayInfo');
const calendary = document.getElementById('calendary');
const backButton = document.getElementById('backButton');

// Generamos dinamicamente los dias del mes en el calendario
for (let i = 1; i <= 30; i++) {

    //creamos una etiqueta li
    const dayElement = document.createElement('li');

    //le agregamos como texto el número del día
    dayElement.textContent = i;

    //Le agregamos un evento click con una función que nos permite seleccionar la fecha en nuestra API dummy
    dayElement.addEventListener('click', () => selectDate(`2023-11-${i}`));

    // Agregamos un atributo data-date para identificar la fecha asociada
    dayElement.setAttribute('data-date', `2023-11-${i}`);

    //Si el día es 1, lo ubicamos en el día correspondiente en este caso Noviembre inicia el Miercoles
	if (i === 1) {
       	dayElement.classList.add('first-day');
    }

    //agregamos la etiqueta al calendario
    calendarDays.appendChild(dayElement);
}

//Al botón de 'Disponibilidad' le agregamos un evento con una función que nos muestre la info que solicitamos de la API.
availabilityButton.addEventListener('click', () => showDayInfo());

//Al botón de 'Atras' le agregamos la funcion para devolver el estado inicial, lo hacemos mediante herencia para que no de problemas ya que se cambia muchos botones 'Atras'
dayInfoContainer.addEventListener('click', function(event) {
    if (event.target.id === 'backButton') {
        returnCalendary();
    }
});


//Función para seleccionar el día
function selectDate(date) {

    // Desseleccionamos la fecha anteriormente seleccionada
    const previousSelectedDayElement = document.querySelector('.selected');
    if (previousSelectedDayElement) {
        previousSelectedDayElement.classList.remove('selected');
    }

    //Cambiamos el valor previo o null, por el del Día seleccionado
    selectedDate = date;

    // Añadimos la clase 'selected' a la fecha seleccionada
    const selectedDayElement = document.querySelector(`[data-date="${selectedDate}"]`);
    if (selectedDayElement) {
        selectedDayElement.classList.add('selected');
    }

    //También le quitamos el disabled al botón de 'Disponibilidad' para poder usarlo.
    availabilityButton.disabled = false;
}

//Función para hacer la petición a la API dummy y mostrar los resultados
function showDayInfo() {

    //si es null, simplemente retornamos
    if (!selectedDate) {
        return;
    }

    //Ocultamos el calendario
    calendary.style.display = "none";

    //Mostramos los datos
    dayInfoContainer.style.display = "block";

    //sino hacemos una petición de los datos de la API dummy
    fetch(dbUrl)

        //Convertimos a formato json, que se pueda leer
        .then(response => response.json())

        //De toda la data, buscamos el item que tenga la misma fecha seleccionada
        .then(data => {
            const dayInfo = data.find(item => item.date === selectedDate);

            //Confirmamos si encontramos el item y si cuenta con pesonal habilitado para ese día
            if (dayInfo && dayInfo.availability && dayInfo.availability.length > 0) {

                //creamos una card para cada personal, con sus datos correspondientes y todo lo almacenamos en una variable
                const personalDisponible = dayInfo.availability.map(person => (
                    `<div>
                        <h2 class="Name_h2">${person.name}</h2>
                        <p class="Schendule_p">Horarios: ${person.schedule.map((item, index) => (
                            `<a class="Schendule_a" href="#" onclick="SelectSchedule('${item}', ${person.id})">${item}</a>`
                        ))}
                        </p>
                        
                    </div>`
                )).join('');
                
                //Insertamos los datos en el div que contiene toda la info
                dayInfoContainer.innerHTML += personalDisponible;
            } else {

                //En el caso de no haber encontrado la fecha o personal, devolvemos el siguiente texto
                dayInfoContainer.innerHTML += 'No hay información disponible para este día.';
            }
        })
        .catch(error => {

            //En el caso de un error consologeamos el error y ponemos un texto de error de carga en la página.
            console.error('Error fetching data:', error);
            dayInfoContainer.innerHTML += 'Error al cargar la información.';
        });
}

//Función para volver atrás.
function returnCalendary() {
    
    // Limpiamos el contenido actual del dayInfoContainer y agregamos el botón de atras.
    dayInfoContainer.innerHTML = `<button id="backButton" >Atrás</button>`;

    // Mostramos el calendario
    calendary.style.display = "block";

    // Ocultamos los datos
    dayInfoContainer.style.display = "none";

    //Disableamos al botón de 'Disponibilidad' para que puedan escoger otra fecha.
    availabilityButton.disabled = true;

    // Desseleccionamos la fecha anteriormente seleccionada
    const previousSelectedDayElement = document.querySelector('.selected');
    if (previousSelectedDayElement) {
        previousSelectedDayElement.classList.remove('selected');
    }
}

//Función para agendar la cita, en este caso solo consologeo los datos
function SelectSchedule(item, idPersonal) {
    
    console.log(`Horario seleccionado: ${item},`);
    console.log(`Id del personal: ${idPersonal}`);
}

//Esta función serviria para acceder tipo a la API de Kommo y tener la id del cliente para agregarlo, pero sigue en proceso...

// function SelectSchedule(item, idPersonal) {
//     // Credenciales proporcionadas
//     const integrationId = '987fdd5d-b4dc-*********';
//     const secretKey = '8m2J64pIBDG6UYwA4dHOFYVa9qVMFuJjq8***************';

//     // URL del servicio externo
//     const apiUrl = 'https://alexandernoel.kommo.com/api/v4/account';

//     // Crea una cadena de autorización usando el ID de integración y la clave secreta
//     const authorizationHeader = `Basic ${btoa(`${integrationId}:${secretKey}`)}`;

//     // Hacemos una solicitud fetch al JSON externo con las credenciales
//     fetch(apiUrl, {
//         headers: {
//             'Authorization': authorizationHeader,
//         },
//     })
//         .then(response => response.json())
//         .then(data => {
//             // Extraemos el ID del cliente del JSON
//             const clientId = data.id;

//             // Imprimimos los datos en la consola
//             console.log(`Horario seleccionado: ${item}`);
//             console.log(`Id del personal: ${idPersonal}`);
//             console.log(`Id del cliente: ${clientId}`);

//             // Ahora puedes hacer lo que quieras con el ID del cliente, ya sea mostrarlo en la interfaz de usuario o realizar más operaciones.
//         })
//         .catch(error => {
//             console.error('Error al obtener el JSON externo:', error);
//         });
// }



