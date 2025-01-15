// Seleziona gli elementi del DOM
const menuToggle = document.getElementById('menu-toggle');
const menuContainer = document.getElementById('menu-container');




// Aggiungi un evento per aprire/chiudere il menu
menuToggle.addEventListener('click', () => {
  menuContainer.classList.toggle('active');
});




// Seleziona l'elemento del link per tornare alla home
const homeLink = document.getElementById('home-link');

document.addEventListener("DOMContentLoaded", function () {
  // Selezioniamo la sezione principale e la nascondiamo inizialmente
  const mainSection = document.querySelector("main");
  mainSection.classList.remove("hidden"); // Rimuove manualmente "hidden" (se presente)
  mainSection.style.display = "block"; // Forza la visibilità
  console.log("Sezione principale visibile");

  // Aggiungiamo l'evento di clic sul link "Agenda Virtuale"
  const homeLink = document.getElementById('home-link');
  homeLink.addEventListener('click', function(event) {
      console.log("Cliccato su Agenda Virtuale");
      event.preventDefault(); // Evita il comportamento predefinito del link (navigazione)

      // Mostra la sezione principale
      if (mainSection) {
          mainSection.classList.remove("hidden");
          mainSection.style.display = "block"; // Forza la visibilità
      }

      // Nascondi le altre sezioni (Calendario, Gestione Esami, Dashboard)
      const calendarSection = document.getElementById("calendar-section");
      const manageExamsSection = document.getElementById("manage-exams-section");
      const dashboardSection = document.getElementById("dashboard-section");

      if (calendarSection) {
          calendarSection.classList.add("hidden"); // Nasconde il Calendario
      }
      if (manageExamsSection) {
          manageExamsSection.classList.add("hidden"); // Nasconde Gestione Esami
      }
      if (dashboardSection) {
          dashboardSection.classList.add("hidden"); // Nasconde Dashboard
      }

      console.log("Altre sezioni nascoste");
  });
});







// Gestione della visualizzazione della sezione calendario
document.getElementById("calendar-link").addEventListener("click", function() {
  // Nasconde la sezione principale
  document.querySelector("main").classList.add("hidden");
 
   // Mostra la sezione calendario
  document.getElementById("calendar-section").classList.remove("hidden");
});




// Funzione per chiudere il menu quando si clicca su un elemento
const menuLinks = document.querySelectorAll('#dropdown-menu a');
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
      menuContainer.classList.remove('active');  // Chiude il menu
  });
});




// Variabili globali
let currentDate = new Date();
let examData = {}; // Oggetto per memorizzare gli esami per ogni giorno

let exams = [];

document.addEventListener("DOMContentLoaded", function() {
  loadExams();  // Carica gli esami salvati quando la pagina è pronta
});


// Carica i dati del Calendario salvati in localStorage
loadCalendarData();



// Funzione per salvare i dati degli esami del calendario in localStorage
function saveCalendarData() {
  localStorage.setItem('examData', JSON.stringify(examData));
}

// Funzione per caricare i dati degli esami del calendario da localStorage
function loadCalendarData() {
  const savedData = localStorage.getItem('examData');
  if (savedData) {
      examData = JSON.parse(savedData);
  } else {
      examData = {};
  }
}


// Funzione per salvare gli esami della Gestione Esami in localStorage
function saveExams() {
  localStorage.setItem('exams', JSON.stringify(exams));
  console.log('Esami salvati:', exams); // Log per verificare
}

// Funzione per caricare gli esami della Gestione Esami da localStorage
function loadExams() {
  const savedExams = localStorage.getItem('exams');
  if (savedExams) {
      exams = JSON.parse(savedExams);
      console.log('Esami caricati:', exams); // Log per verificare
    } else {
        exams = [];
        console.log('Nessun esame salvato trovato'); // Log se vuoto
    }
}


function displayExams() {
  const examList = document.getElementById('exam-list');
  examList.innerHTML = '';  // Pulisce la lista esistente

  exams.forEach(exam => {
      const li = document.createElement('li');
      li.innerHTML = `
          <span>${exam.name}</span> - 
          <span>${exam.credits} CFU</span> - 
          <span>Voto: ${exam.grade}</span>
          <button class="remove-exam" data-name="${exam.name}">Elimina</button>
      `;
      examList.appendChild(li);
  });

  // Aggiungi eventi per i bottoni "Rimuovi"
  document.querySelectorAll('.remove-exam').forEach(button => {
      button.addEventListener('click', function() {
          const examName = this.getAttribute('data-name');
          removeExam(examName);
      });
  });
}

function removeExam(examName) {
  exams = exams.filter(exam => exam.name !== examName);
  saveExams();  // Salva l'elenco aggiornato
  displayExams();  // Aggiorna la UI
}

function calculateStatistics() {
  if (exams.length === 0) {
      document.getElementById('stats').textContent = 'Nessun dato disponibile';
      return;
  }

  // Calcola la media aritmetica
  const totalGrades = exams.reduce((sum, exam) => sum + exam.grade, 0);
  const arithmeticMean = totalGrades / exams.length;

  // Calcola la media ponderata
  const totalWeightedGrades = exams.reduce((sum, exam) => sum + (exam.grade * exam.credits), 0);
  const totalCredits = exams.reduce((sum, exam) => sum + exam.credits, 0);
  const weightedMean = totalWeightedGrades / totalCredits;

  // Aggiorna le statistiche nella UI
  document.getElementById('stats').innerHTML = `
      Media Aritmetica: ${arithmeticMean.toFixed(2)}<br>
      Media Ponderata: ${weightedMean.toFixed(2)}
  `;
}




function showSection(sectionId) {
  // Nasconde tutte le sezioni
  document.querySelectorAll('main, #dashboard-section, #calendar-section, #manage-exams').forEach(section => {
      section.classList.add('hidden');
      section.style.display = 'none';
  });



  // Mostra la sezione specificata
  const sectionToShow = document.getElementById(sectionId);
  sectionToShow.classList.remove('hidden');
  sectionToShow.style.display = 'block';
}




// Funzione per generare il calendario
function generateCalendar() {
  const calendarDays = document.getElementById('calendar-days');
  const calendarMonth = document.getElementById('calendar-month');
   const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
   const months = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  calendarMonth.textContent = `${months[month]} ${year}`;
   const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
   // Allineamento con il lunedì
  const correctedFirstDay = firstDay === 0 ? 7 : firstDay; // Se il primo giorno è domenica (0), lo spostiamo a 7 per il lunedì
  calendarDays.innerHTML = '';
   // Aggiunge gli spazi vuoti prima del primo giorno
  for (let i = 0; i < correctedFirstDay - 1; i++) {
      const emptyCell = document.createElement('span');
      calendarDays.appendChild(emptyCell);
  }
   // Aggiunge i giorni del mese
  for (let day = 1; day <= daysInMonth; day++) {
      const dayCell = document.createElement('span');
    
      // Crea un contenitore per il numero del giorno e il nome dell'esame
      const dayNumber = document.createElement('div');
      dayNumber.textContent = day;
      dayCell.appendChild(dayNumber);
    
       // Verifica se esiste un esame per questo giorno, mese e anno
       if (examData[year] && examData[year][month] && examData[year][month][day]) {
        const exam = examData[year][month][day]; // Ottieni l'esame specifico per il giorno
        const examName = document.createElement('div');
        examName.textContent = exam.name;
        examName.style.fontSize = '12px'; 
        examName.style.marginTop = '5px';
        dayCell.appendChild(examName);


        dayCell.style.backgroundColor = '#e74c3c'; // Colore di sfondo per la cella con esame
        dayCell.style.color = 'white'; // Colore del testo bianco per il contrasto
    }




    dayCell.classList.add('calendar-day');  // Aggiungiamo una classe per le celle dei giorni
    dayCell.addEventListener('click', () => {
        if (examData[year] && examData[year][month] && examData[year][month][day]) {
            showModal(day, month, year);  // Mostra il modale con i dettagli dell'esame
        }
    });




      calendarDays.appendChild(dayCell);
  }
}




// Funzione per navigare al mese precedente
document.getElementById('prev-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar();
});




// Funzione per navigare al mese successivo
document.getElementById('next-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar();
});




// Funzione per mostrare il modale con i dettagli dell'esame
function showModal(day, month, year) {
  const modal = document.getElementById('event-modal');
  const modalName = document.getElementById('modal-event-name');
  const modalDate = document.getElementById('modal-event-date');
  const modalTime = document.getElementById('modal-event-time');
  const modalRoom = document.getElementById('modal-event-room');


  const exam = examData[year][month][day];  // Recupera l'esame con giorno, mese e anno


  modalName.textContent = exam.name;
  modalDate.textContent = `${day} ${exam.month} ${exam.year}`;
  modalTime.textContent = exam.time;
  modalRoom.textContent = exam.room;


  modal.classList.remove('hidden');
}






// Funzione per nascondere il modale
document.getElementById('close-modal-button').addEventListener('click', () => {
  document.getElementById('event-modal').classList.add('hidden');
});


document.getElementById('delete-event-button').addEventListener('click', () => {
  // Ottieni la data dal modale
  const modalDate = document.getElementById('modal-event-date').textContent.split(' ');
  const day = parseInt(modalDate[0]); // Giorno
  const month = new Date(Date.parse(modalDate[1] + " 1")).getMonth(); // Mese (convertito in indice numerico)
  const year = parseInt(modalDate[2]); // Anno

  // Verifica se la data esiste in examData e rimuovi l'evento
  if (examData[year] && examData[year][month] && examData[year][month][day]) {
    delete examData[year][month][day]; // Rimuovi l'evento
    if (Object.keys(examData[year][month]).length === 0) delete examData[year][month]; // Rimuovi il mese se vuoto
    if (Object.keys(examData[year]).length === 0) delete examData[year]; // Rimuovi l'anno se vuoto
  }

  // Salva i dati aggiornati
  saveCalendarData();

  // Aggiorna il calendario
  generateCalendar();

  // Chiudi il modale
  document.getElementById('event-modal').classList.add('hidden');
});






// Funzione per aggiungere un esame
document.getElementById('event-form').addEventListener('submit', function(event) {
  event.preventDefault();  // Previene il comportamento predefinito del form




  const date = document.getElementById('event-date').value;
  const title = document.getElementById('event-title').value;
  const time = document.getElementById('event-time').value;
  const room = document.getElementById('event-room').value;




  const day = new Date(date).getDate();
  const month = new Date(date).getMonth();
  const year = new Date(date).getFullYear();


  // Aggiungi il dato dell'esame in examData, strutturato per anno, mese e giorno
  if (!examData[year]) {
     examData[year] = {}; // Se non esiste, crea un oggetto per l'anno
 }
 if (!examData[year][month]) {
     examData[year][month] = {}; // Se non esiste, crea un oggetto per il mese
 }




  // Salva l'esame nel nostro oggetto di dati
  examData[year][month][day] = {
     name: title,
     time: time,
     room: room,
     month: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"][month],
     year: year
 };
 saveCalendarData();  // Salva i dati nel localStorage
generateCalendar();  // Rigenera il calendario con il nuovo esame




  generateCalendar();  // Rigenera il calendario con il nuovo esame




  // Reset del form
  document.getElementById('event-form').reset();
});




// Funzione per chiudere il modale
document.getElementById('close-modal-button').addEventListener('click', () => {
  document.getElementById('event-modal').classList.add('hidden');
});




// Genera il calendario iniziale
generateCalendar();




// Funzione per visualizzare la sezione Gestione Esami
document.getElementById("manage-exams-link").addEventListener("click", function(event) {
  event.preventDefault();  // Evita il comportamento predefinito del link
   // Nascondi tutte le altre sezioni

  document.querySelector("main").classList.add("hidden");  // Nasconde la sezione principale
  document.getElementById("calendar-section").classList.add("hidden");  // Nasconde la sezione calendario






  // Mostra la sezione Gestione Esami
  document.getElementById("manage-exams").style.display = "block";

   // Carica gli esami salvati
   loadExams();  // Deve essere chiamata qui
   displayExams();  // Mostra gli esami nella UI
   calculateStatistics();  // Aggiorna le statistiche
});









// Seleziona gli elementi del DOM per la gestione esami
const manageExamsSection = document.getElementById('manage-exams');
const examForm = document.getElementById('exam-form');
const examList = document.getElementById('exam-list');
const statsElement = document.getElementById('stats');
const examNameInput = document.getElementById('exam-name');
const examCreditsInput = document.getElementById('exam-credits');
const examGradeInput = document.getElementById('exam-grade');




const examLodeInput = document.getElementById('exam-lode');

let exam = JSON.parse(localStorage.getItem('exam')) || []; 


// Funzione per mostrare la sezione Gestione Esami quando clicchi sul link
document.getElementById("manage-exams-link").addEventListener("click", function(event) {
  event.preventDefault();  // Impedisce il comportamento predefinito del link (evita il refresh della pagina)
   // Nascondi tutte le altre sezioni
  document.querySelector("main").classList.add("hidden");  // Nascondi la sezione principale
  document.getElementById("calendar-section").classList.add("hidden");  // Nascondi la sezione calendario
   // Mostra la sezione Gestione Esami
  document.getElementById("manage-exams").style.display = "block";  // Mostra la sezione Gestione Esami
});




// Aggiungi un evento per il link del calendario
document.getElementById("calendar-link").addEventListener("click", function(event) {
  event.preventDefault();  // Impedisce il comportamento predefinito del link
   // Nascondi la sezione Gestione Esami
  document.getElementById("manage-exams").style.display = "none";  // Nascondi la sezione Gestione Esami
  document.querySelector("main").classList.add("hidden");  // Nascondi la sezione principale
   // Mostra la sezione Calendario
  document.getElementById("calendar-section").classList.remove("hidden");  // Mostra la sezione calendario
});




// Aggiungi un esame al sistema
examForm.addEventListener('submit', function(event) {
  event.preventDefault();  // Previene il comportamento predefinito del form




  const name = examNameInput.value;
  const credits = parseInt(examCreditsInput.value);
  const grade = parseInt(examGradeInput.value);
  const lode = examLodeInput.value === 'yes' ? true : false;




  // Crea un oggetto per l'esame
  const exam = {
      name: name,
      credits: credits,
      grade: grade,
      lode: lode
  };


  console.log('Aggiunta esame:', exam); // Log per verificare


  // Aggiungi l'esame all'array
  exams.push(exam);


  saveExams();  // Salva gli esami nel localStorage

  // Pulisce il form
  examForm.reset();

// Carica gli esami salvati in localStorage
loadExams();


  // Aggiungi l'esame alla lista
  updateExamList();




  // Aggiorna le statistiche
  updateStats();
});




// Riferimento agli elementi del form
const gradeInput = document.getElementById('exam-grade');
const lodeContainer = document.getElementById('lode-container');




// Funzione per gestire la visibilità del campo "Lode" in base al voto
gradeInput.addEventListener('input', function() {
  const grade = parseInt(gradeInput.value);




  if (grade === 30) {
      // Mostra il campo "Lode"
      lodeContainer.style.display = 'block';
  } else {
      // Nascondi il campo "Lode"
      lodeContainer.style.display = 'none';
  }
});




// Funzione per aggiornare l'elenco degli esami
function updateExamList() {
  console.log('Aggiornamento della lista esami', exams); // Log per verificare
  examList.innerHTML = ''; // Svuota la lista precedente
  examList.innerHTML = ''; // Svuota la lista precedente


  exams.forEach((exam, index) => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
          <strong>${exam.name}</strong> - Crediti: ${exam.credits}, Voto: ${exam.grade}${exam.lode ? ' (Lode)' : ''}
          <button onclick="deleteExam(${index})">Elimina</button>
      `;
      examList.appendChild(listItem);
  });
}




// Funzione per eliminare un esame dalla lista
function deleteExam(index) {
  exams.splice(index, 1); // Rimuove l'esame dall'array
  updateExamList();  // Rigenera la lista
  updateStats();  // Ricalcola le statistiche
}




// Funzione per aggiornare le statistiche
function updateStats() {
  if (exams.length === 0) {
      statsElement.textContent = 'Nessun dato disponibile';
      return;
  }




  // Calcola il numero di esami e la media dei voti
  const totalExams = exams.length;
  const totalCredits = exams.reduce((sum, exam) => sum + exam.credits, 0);
  const totalGrade = exams.reduce((sum, exam) => sum + exam.grade, 0);
  const averageGrade = (totalGrade / totalExams).toFixed(2);




  statsElement.textContent = `Numero di esami: ${totalExams}, Crediti totali: ${totalCredits}, Media voti: ${averageGrade}`;
}




// Funzione per calcolare la media aritmetica e la media ponderata
function updateStats() {
  const totalCredits = exams.reduce((total, exam) => total + exam.credits, 0);  // Somma totale dei crediti
  const weightedSum = exams.reduce((total, exam) => total + (exam.grade * exam.credits), 0);  // Somma ponderata dei voti
  const sumGrades = exams.reduce((total, exam) => total + exam.grade, 0);  // Somma dei voti




  // Calcola la media aritmetica
  const arithmeticMean = (exams.length === 0) ? 0 : sumGrades / exams.length;




  // Calcola la media ponderata
  const weightedMean = (totalCredits === 0) ? 0 : weightedSum / totalCredits;




  // Aggiorna le statistiche
  const stats = document.getElementById('stats');
  if (exams.length > 0) {
      stats.textContent = `Media Aritmetica: ${arithmeticMean.toFixed(2)} | Media Ponderata: ${weightedMean.toFixed(2)}`;
  } else {
      stats.textContent = "Nessun esame inserito";
  }
}


// Seleziona il link Dashboard e aggiungi evento di clic
document.querySelector("a[href='#dashboard']").addEventListener("click", function(event) {
  event.preventDefault();


  // Nascondi le altre sezioni
  document.querySelector("main").classList.add("hidden");
  document.getElementById("calendar-section").classList.add("hidden");
  document.getElementById("manage-exams").style.display = "none";


  // Mostra la sezione Dashboard
  document.getElementById("dashboard-section").classList.remove("hidden"); dashboard.style.display = "block";


  // Aggiorna il riepilogo
  updateDashboard();
});


// Funzione per aggiornare il contenuto della Dashboard
function updateDashboard() {
  const dashboardSummary = document.getElementById("dashboard-summary");
  const totalExams = exams.length;
  const totalCredits = exams.reduce((sum, exam) => sum + exam.credits, 0);
  const averageGrade = exams.length > 0
      ? (exams.reduce((sum, exam) => sum + (exam.grade * exam.credits), 0) / totalCredits).toFixed(2)
      : 0;


  dashboardSummary.innerHTML = `
      <p>Esami totali: ${totalExams}</p>
      <p>Crediti totali: ${totalCredits}</p>
      <p>Media ponderata: ${averageGrade}</p>
  `;
}


// Mostra solo la sezione della Dashboard
document.getElementById("dashboard-link").addEventListener("click", function(event) {
  event.preventDefault();
  showSection('dashboard-section');
  updateDashboard(); // Mantieni l'aggiornamento della Dashboard
});




   // Nascondi tutte le altre sezioni
   document.querySelector("main").classList.add("hidden");
   document.getElementById("calendar-section").classList.add("hidden");
   document.getElementById("manage-exams").style.display = "none";


   // Mostra la Dashboard
   const dashboard = document.getElementById("dashboard-section");
   dashboard.classList.remove("hidden");
   dashboard.style.display = "block";


   // Aggiorna il contenuto della Dashboard
   updateDashboard();
;


// Nascondi la Dashboard e mostra la sezione Calendario
document.getElementById("calendar-link").addEventListener("click", function(event) {
  event.preventDefault();
  showSection('calendar-section');
});


   // Nascondi la Dashboard
   document.getElementById("dashboard-section").classList.add("hidden");


   // Mostra la sezione Calendario
   document.getElementById("calendar-section").classList.remove("hidden");


   // Nascondi altre sezioni
   document.querySelector("main").classList.add("hidden");
   document.getElementById("manage-exams").style.display = "none";




// Nascondi la Dashboard e mostra la sezione Gestione Esami
document.getElementById("manage-exams-link").addEventListener("click", function(event) {
  event.preventDefault();
  showSection('manage-exams');
});


   // Nascondi la Dashboard
   document.getElementById("dashboard-section").classList.add("hidden");


   // Mostra la sezione Gestione Esami
   document.getElementById("manage-exams").style.display = "block";


   // Nascondi altre sezioni
   document.querySelector("main").classList.add("hidden");
   document.getElementById("calendar-section").classList.add("hidden");




// Nascondi la Dashboard e torna alla Home
document.getElementById("home-link").addEventListener("click", function(event) {
  event.preventDefault();
  showSection('main');
});


   // Mostra la sezione principale
   document.querySelector("main").classList.remove("hidden");
   console.log("Sezione principale mostrata");



   // Nascondi tutte le altre sezioni
   document.getElementById("calendar-section").classList.add("hidden");
   document.getElementById("manage-exams").style.display = "none";
   document.getElementById("dashboard-section").classList.add("hidden");


   // Mostra solo la sezione principale all'avvio
showSection('main');


function updateDashboard() {
  // 1. Calcola la media aritmetica e ponderata
  const totalExams = exams.length; // exams è l'array degli esami svolti
  const totalCredits = exams.reduce((sum, exam) => sum + exam.credits, 0);
  const weightedSum = exams.reduce((sum, exam) => sum + (exam.grade * exam.credits), 0);
  const arithmeticMean = totalExams > 0 ? (exams.reduce((sum, exam) => sum + exam.grade, 0) / totalExams).toFixed(2) : 0;
  const weightedMean = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : 0;


  // Aggiorna i valori nella Dashboard
  document.getElementById("arithmetic-mean").textContent = arithmeticMean;
  document.getElementById("weighted-mean").textContent = weightedMean;
  document.getElementById("total-credits").textContent = totalCredits;


  // 2. Popola gli esami mancanti (dal calendario)
  const missingExamsList = document.getElementById("missing-exams-list");
  missingExamsList.innerHTML = ""; // Svuota la lista


  Object.keys(examData).forEach(year => {
      Object.keys(examData[year]).forEach(month => {
          Object.keys(examData[year][month]).forEach(day => {
              const exam = examData[year][month][day];
              const listItem = document.createElement("li");
              listItem.textContent = `${exam.name} - ${day}/${parseInt(month) + 1}/${year}`;
              missingExamsList.appendChild(listItem);
          });
      });
  });


  // Se non ci sono esami programmati
  if (missingExamsList.children.length === 0) {
      missingExamsList.innerHTML = "<li>Nessun esame programmato</li>";
  }


  // 3. Popola gli esami svolti (da "Gestione Esami")
  const completedExamsList = document.getElementById("completed-exams-list");
  completedExamsList.innerHTML = ""; // Svuota la lista


  exams.forEach(exam => {
      const listItem = document.createElement("li");
      listItem.textContent = `${exam.name} - Voto: ${exam.grade} ${exam.lode ? "(Lode)" : ""}`;
      completedExamsList.appendChild(listItem);
  });


  // Se non ci sono esami registrati
  if (completedExamsList.children.length === 0) {
      completedExamsList.innerHTML = "<li>Nessun esame registrato</li>";
  }
}