/**
 * Prototyp Lern Web-App
 * @author Sascha Andre Wolgast
 */
 

"use strict"


// Dummy-Daten
const cardsApi = [
    {
        front: "\u3042",
        back: "a"

    },
    {
        front: "\u3044",
        back: "i"

    },

    {
        front: "\u3046",
        back: "u"

    },
    {
        front: "\u3048",
        back: "e"

    },
    {
        front: "\u304A",
        back: "o"
    }

];



// Variablen initalisieren
let cards = [];
let currentCardIdx = 0; // Index der aktuellen Karte
let counterCorrectCards = 0;
let counterWrongCards = 0;


// Warten bis das komplette HTML Dokument geladen ist
window.addEventListener('DOMContentLoaded', (event) => {

    if('serviceWorker' in navigator){
        navigator.serviceWorker
        .register('../service_worker.js')
        .then(reg => console.log('Service Worker: Registered'))
        .catch(err => console.log(`Service Worker Error: ${err}`));
    }

    // Counter SPAN-Elemente aus DOM ermitteln
    const spanCardCounter = document.getElementById("card-counter");
    const spanCounterCorrectCards = document.getElementById("counter-correct-cards");
    const spanCounterWrongCards = document.getElementById("counter-wrong-cards");

    // DIV-Elemente f. Karteninhalt und Button ermitteln
    const divCardContent = document.getElementById("content");
    const divCardControl = document.getElementById("control");

    // INPUT-Elemente erzeugen
    const buttonnShowAnswer = document.createElement("input");
    buttonnShowAnswer.setAttribute("type", "button");
    buttonnShowAnswer.setAttribute("value", "Lösung");
    buttonnShowAnswer.setAttribute("id", "button-show-answer");

    const buttonCorrectAnswer = document.createElement("input");
    buttonCorrectAnswer.setAttribute("type", "button");
    buttonCorrectAnswer.setAttribute("value", "Richtig");
    buttonCorrectAnswer.setAttribute("id", "button-correct-answer");

    const buttonWrongAnswer = document.createElement("input");
    buttonWrongAnswer.setAttribute("type", "button");
    buttonWrongAnswer.setAttribute("value", "Falsch");
    buttonWrongAnswer.setAttribute("id", "button-wrong-answer");


    // Allgemeiner Eventhandler mit der Applikationslogik registrieren
    document.addEventListener("click", (event) => {
        
        if (event.target.id === "button-show-answer") {
            // Lösung wurde angeklickt

            // Lösung anzeigen
            divCardContent.innerText = cards[currentCardIdx].back;
            // Buttons austauschen
            divCardControl.innerHTML = "";
            divCardControl.appendChild(buttonWrongAnswer);
            divCardControl.appendChild(buttonCorrectAnswer);

        } else if (event.target.id === "button-correct-answer" || event.target.id === "button-wrong-answer") {
            // Richtig oder Falsch wurde angeklickt

            if (event.target.id === "button-correct-answer") {
                // Richtig wurde angeklickt

                // Counter für Richtig erhöhen und aktualisieren
                counterCorrectCards = counterCorrectCards + 1;
                spanCounterCorrectCards.innerText = counterCorrectCards;

            } else {
                // Falsch wurde angeklickt

                // Counter für Falsch erhöhen und aktualisieren
                counterWrongCards = counterWrongCards + 1;
                spanCounterWrongCards.innerText = counterWrongCards;
            }

            // Karten Index um eins erhöhen
            currentCardIdx = currentCardIdx + 1;

            if (currentCardIdx < cards.length) {
                // Es sind noch Karten vorhanden

                // HTML aktualiseren
                spanCardCounter.innerText = (currentCardIdx + 1) + "/" + cards.length;
                divCardContent.innerText = cards[currentCardIdx].front;
                divCardControl.innerHTML = "";
                divCardControl.appendChild(buttonnShowAnswer);


            } else {
                // Es sind keine Karten mehr vorhanden

                // HTML aktualiseren
                divCardContent.innerText = "Fertig!";
                divCardControl.innerHTML = "";
            }



        }
    });

    // IndexDB öffnen
    const request = indexedDB.open("KanaLernApp", 2);

    // Fehlerfall
    request.onerror = (event) => {
        console.log("Datenbank konnte nicht geöffnet werden!")
    };

    // Datenbank existiert noch nicht bzw. die Version ist nicht aktuell
    request.onupgradeneeded = (event) => {
        
        // DB-Objekt 
        const db = event.target.result;

        // Neue Datenbank erstellen
        const objectStore = db.createObjectStore("cards", { autoIncrement: true });
        
        // Eventhandler für Datenbank wurde erstellt
        objectStore.transaction.oncomplete = (event) => {
            console.log("Datenbank wurde neu erstellt!")
            // Karten in Datenbank speichern
            const cardsObjectStore = db.transaction("cards", "readwrite").objectStore("cards");
            cardsApi.forEach((card) => {
                cardsObjectStore.add(card);
            });
        };
    };

    // Datenbank existiert und wurde geöffnet
    request.onsuccess = (event) => {

        const db = event.target.result;

        // Alle Karten aus DB laden
        const transaction = db.transaction(["cards"]);
        const objectStore = transaction.objectStore("cards");
        objectStore.getAll().onsuccess = (event) => {
            // Ergebnis in Array cards speichern
            cards = event.target.result;
            console.log("Karten wurden aus der DB geladen.")
            // Erste Karte initalisieren
            divCardContent.innerText = cards[currentCardIdx].front
            divCardControl.appendChild(buttonnShowAnswer)
            spanCardCounter.innerText = "1/" + cards.length
        };


    };






});