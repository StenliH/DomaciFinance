/** Názvy sloupců z tabulky Zůstatky s funkcemi pro výpočet hodnot. */
var zustatkyTableColumnHeaders = [
    {label: 'Běžná spotřeba', value: getBeznaSpotrebaCF},
    {label: 'Rezerva', value: getRezervaCF},
    {label: 'Martin', value: getMartinCF},
    {label: 'Káťa', value: getKataCF},
    {label: 'Cashflow celkem', value: getCelkoveCF},
];

/** Názvy řádků z tabulky Cashflow s funkcemi pro výpočet hodnot. */
var cashflowTableRowHeaders = [
    {label: 'Běžná spotřeba', value: getBeznaSpotrebaCF},
    {label: 'Rezerva', value: getRezervaCF},
    {label: 'Martin', value: getMartinCF},
    {label: 'Káťa', value: getKataCF},
    {label: 'Celkové CF', value: getCelkoveCF},
];

/** Názvy řádků z tabulky Příjmy s funkcemi pro výpočet hodnot. */
var prijmyTableRowHeaders = [
    {label: 'Pravidelné', value: getPravidelnePrijmy},
    {label: 'Ostatní', value: getOstatniPrijmy},
    {label: 'Celkové', value: getCelkovePrijmy},
];

/** Názvy řádků z tabulky Výdaje s funkcemi pro výpočet hodnot. */
var vydajeTableRowHeaders = [
    {label: 'Běžná spotřeba', value: getBeznaSpotrebaVydaje},
    {label: 'Bydlení', value: getBydleniVydaje},
    {label: 'Rezerva', value: getRezervaVydaje},
    {label: 'Celkem', value: getCelkoveVydaje},
];

/** Názvy řádků z tabulky Běžná spotřeba s funkcemi pro výpočet hodnot. */
var beznaSpotrebaTableRowHeaders = [
    {label: 'Ke spotřebě', value: getBeznaSpotrebaPrijmy},
    {label: 'Jídlo a pití', value: getJidloVydaje},
    {label: 'Charita a dárky', value: getCharitaVydaje},
    {label: 'Finanční výdaje', value: getFinancniVydaje},
    {label: 'Ostatni', value: getOstatniVydajeBezneSpotreby},
    {label: 'Do osobního', value: getPrevedenoDoOsobniho},
    {label: 'Zbývá', value: getBeznaSpotrebaCF},
];

var tabulky = [
    {id: 'cashflow', value: cashflowTableRowHeaders},
    {id: 'prijmy', value: prijmyTableRowHeaders},
    {id: 'vydaje', value: vydajeTableRowHeaders},
    {id: 'bezna-spotreba', value: beznaSpotrebaTableRowHeaders},
];

/** Sem se uloží všechny transakce ze zpracovaného vstupního souboru. */
var allTransactions = [];


//---------------------------------------------------------------


/** Nastavení stránky bezprostředně po zobrazení. */
function initialSetup() {
    let fileInput = document.getElementById("fileinput");
    fileInput.onchange = processInput;
    createOptionsForSelectYear();
}


/** Zpracování vstupu a zobrazení tabulek s výsledky. (případně vymazání předchozích tabulek) */
async function processInput() {
    // zpracování textu ze souboru
    let file = document.getElementById('fileinput').files[0];
    let text = await file.text();
    parseFile(text);

    displayTables();
    let yearSelect = document.getElementById("years");
    yearSelect.onchange = displayTables;
}


/** Smaže všechny tabulky na stránce (reset před zobrazením nových tabulek). */
function clearPage() {
    let tables = document.getElementsByTagName("table");
    while (tables[0]) {
        tables[0].parentNode.removeChild(tables[0]);
    }
}


/** Vygeneruje a zobrazí tabulky s hodnotami. */
function displayTables() {
    clearPage();
    createZustatkyTable();
    tabulky.forEach(t => {
        createMonthlyTableInContainer(t.id, t.value);
    });
}


/** Pro select s roky vytvoří options (od roku 2020 po aktuální) a vybere letošek. */
function createOptionsForSelectYear() {
    // add options and set actual
    var selectYear = document.getElementById("years");

    var actualYear = new Date().getFullYear()
    for (i = 2020; i < actualYear + 1; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.text = i;
        selectYear.appendChild(option);
    }
    selectYear.value = actualYear;
}


/** Vrací rok zvolený v selectu. */
function getYear() {
    return document.getElementById("years").value;
}


/**
 * Vytvoří vnitřek tabulky Zůstatků.
 * @param {*} table 
 */
function createZustatkyTable() {
    let table = document.createElement("table");
    let headersRow = document.createElement("tr");
    let valuesRow = document.createElement("tr");

    zustatkyTableColumnHeaders.forEach(e => {
        headersRow.appendChild(getThWithValue(e.label));
        valuesRow.appendChild(getTdWithMoneyValue(e.value(allTransactions)));
    });

    table.appendChild(headersRow);
    table.appendChild(valuesRow);

    // vložím tabulku do containeru
    let parent = document.getElementById("zustatky");
    parent.appendChild(table);
}


/**
 * Vytvoří tabulku v příslušném containeru s danou vnitřní strukturou.
 * @param {*} containerId ID parent elementu.
 * @param {*} getTableContent Callback pro vygenerování obsahu tabulky.
 */
 function createMonthlyTableInContainer(containerId, rows) {
    let table = document.createElement("table");

    // generování prvního řádku s popisky
    let firstRow = document.createElement("tr");
    firstRow.appendChild(getThWithValue("rok " + getYear()));
    for (let i = 0; i < 12; i++) {
        firstRow.appendChild(getThWithValue(i+1));
    }
    firstRow.appendChild(getThWithValue("Celkem"));
    table.appendChild(firstRow);

    // generování vnitřních buněk s daty
    generateTableContent(table, rows);

    let parent = document.getElementById(containerId);
    parent.appendChild(table);
}


/** Pomocná metoda pro vytvoření header buňky s textem uvnitř. */
function getThWithValue(value) {
    let th = document.createElement("th");
    th.innerText = value;
    return th;
}

/** Pomocná metoda pro vytvoření td buňky s číslem ve formátu měny. */
 function getTdWithMoneyValue(value) {
    let td = document.createElement("td");
    td.innerText = value !== 0 ? formatter.format(value) : 0;
    return td;
}

/** Formátování čísla jako měny, např. 12 326,20. */
var formatter = new Intl.NumberFormat('cs', {
    //style: 'currency',
    //currency: 'CZK',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

/** Vygeneruje obsah tabulky. */
function generateTableContent(table, rows) {
    rows.forEach(item => table.appendChild(getMonthlyRow(item)));
}


/**
 * Vytvoří řádek tabulky s hodnotami pro každý měsíc.
 * @param {object} item Objekt s popiskem řádku a callbackem pro výpočet hodnoty.
 * @returns 
 */
function getMonthlyRow(item) {
    // tr
    let row = document.createElement("tr");

    // th
    let th = document.createElement("th");
    th.innerText = item.label;
    row.appendChild(th);

    // 12 values
    let celkoveZaRok = 0;
    let year = getYear();
    for (let month = 0; month < 12; month++) {
        // get první den měsíce a první den dalšího měsíce
        let dateMin = new Date(year, month, 1);
        let dateMax = new Date(year, month, 1);
        dateMax = new Date(dateMax.setMonth(dateMax.getMonth() + 1));

        let monthlyTransactions = allTransactions.filter(function (x) {
            return x.datum >= dateMin &&
                x.datum < dateMax;
        });

        let castkaVMesici = item.value(monthlyTransactions);
        //appendTdWithValue(row, castkaVMesici);
        row.appendChild(getTdWithMoneyValue(castkaVMesici));
        celkoveZaRok += castkaVMesici;
    }

    row.appendChild(getTdWithMoneyValue(roundTwoPlaces(celkoveZaRok)));

    return row;
}


/**
 * Vrací řádek s vytvořeným prvním sloupcem pro tabulku s měsíčním výkazem.
 * @param {string} header 
 * @returns element 'tr'
 */
function getRowWithFirstCol(header) {
    let row = document.createElement("tr");
    let th = document.createElement("th");
    th.innerText = header;
    row.appendChild(th);

    return row;
}


/**
 * Zpracuje vstupní soubor s daty a uloží do globální proměnné.
 * @param {string} text Transakce v csv formátu, jak lezou z appky.
 */
function parseFile(text) {
    let lines = text.split('"\n"');

    // přeskočí se první řádek = záhlaví tabulky
    for (let i = 1; i < lines.length; i++) {
        let valuesFromLine = lines[i].split('","');

        let transaction = {
            typ: trimQuotes(valuesFromLine[0]),
            datum: new Date(trimQuotes(valuesFromLine[1]).replace(" ", "T")),
            cas: trimQuotes(valuesFromLine[2]),
            nazev: trimQuotes(valuesFromLine[3]),
            castka: parseFloat(trimQuotes(valuesFromLine[4]).replace(",", ".")),
            mena: trimQuotes(valuesFromLine[5]),
            smennyKurz: trimQuotes(valuesFromLine[6]),
            skupinaKategorii: trimQuotes(valuesFromLine[7]),
            kategorie: trimQuotes(valuesFromLine[8]),
            ucet: trimQuotes(valuesFromLine[9]),
            poznamky: trimQuotes(valuesFromLine[10]),
            popisky: getPopisky(trimQuotes(valuesFromLine[11])),       // TODO #1 - dořešit zpracování pro více popisků u jedné transakce
            status: trimQuotes(valuesFromLine[12]),
        }

        allTransactions[i - 1] = transaction;
    }
}

/**
 * Ořezání přebytečných znaků.
 * @param {string} text 
 * @returns {string} ořezaný text
 */
function trimQuotes(text) {
    return text.replace(/["']/g, "");
}

function getPopisky(inputString){
    let popiskySeparator = " ";
    return inputString.split(popiskySeparator);
}

/**
 * Sečte field 'castka' všech itemů v poli a výsledek zaokrouhlí na dvě desetinná místa.
 * @param {*} transactions Pole transakcí.
 * @returns {number}
 */
function sum(transactions) {
    var transactionsSum = transactions.reduce((a, b) => a + (b['castka'] || 0), 0);

    if (transactionsSum == undefined) { return 0; }
    return roundTwoPlaces(transactionsSum);
}

/**
 * Vrací input zaokrouhlený na dvě desetinná místa.
 * @param {number} value 
 * @returns {number}
 */
function roundTwoPlaces(value) {
    return Math.round(value * 100) / 100;
}


/*_______________ Výpočty jednotlivých veličin _______________*/

function getBeznaSpotrebaCF(transactions) {
    // všechny pravidelné příjmy
    var prijmy = transactions.filter(function (x) {
        return x.typ === "Příjem" &&
            x.skupinaKategorii === "Pravidelné";
    });

    // všechny výdaje kromě bydlení, mimořádných a osobních
    var vydaje = transactions.filter(function (x) {
        return x.typ === 'Výdaj' &&
            x.skupinaKategorii !== "Bydlení" &&
            !x.popisky.includes('Mimořádné') &&
            !x.popisky.includes("Martin") &&
            !x.popisky.includes("Káťa");
    });
    
    // co jsme si vyplatili v daném měsíci do osobního (odečtu z výsledné běžné spotřeby)
    var prevedenoDoOsobniho = transactions.filter(function (x) {
        return x.typ === "Příjem" && x.skupinaKategorii === "Pravidelné" &&
        (x.popisky.includes("Martin") || x.popisky.includes("Káťa"));
    });
    
    var beznaSpotreba = sum(prijmy) * 0.4 + sum(vydaje) - sum(prevedenoDoOsobniho);

    return Math.round(beznaSpotreba * 100) / 100;
}

/** Kolik v daném měsíci můžeme ještě utratit za běžnou spotřebu. */
function getBeznaSpotrebaPrijmy(transactions) {
    // všechny pravidelné příjmy
    var prijmy = transactions.filter(function (x) {
        return x.typ === "Příjem" &&
            x.skupinaKategorii === "Pravidelné";
    });

    // co jsme si vyplatili v daném měsíci do osobního (odečtu z výsledné běžné spotřeby)
    // var prevedenoDoOsobniho = transactions.filter(function (x) {
    //     return x.typ === "Příjem" && x.skupinaKategorii === "Pravidelné" &&
    //     (x.popisky.includes("Martin") || x.popisky.includes("Káťa"));
    // });
    
    // var beznaSpotreba = sum(prijmy) * 0.4 - sum(prevedenoDoOsobniho);
    var beznaSpotreba = sum(prijmy) * 0.4;

    return Math.round(beznaSpotreba * 100) / 100;
}

function getPrevedenoDoOsobniho(transactions) {
    // co jsme si vyplatili v daném měsíci do osobního (odečtu z výsledné běžné spotřeby)
    var prevedenoDoOsobniho = transactions.filter(function (x) {
        return x.typ === "Příjem" && x.skupinaKategorii === "Pravidelné" &&
        (x.popisky.includes("Martin") || x.popisky.includes("Káťa"));
    });

    return sum(prevedenoDoOsobniho);
}

function getMartinCF(transactions) {
    var trans = transactions.filter(function (x) {
        return x.popisky.includes("Martin");
    });

    return sum(trans);
}

function getKataCF(transactions) {
    var trans = transactions.filter(function (x) {
        return x.popisky.includes("Káťa");
    });

    return sum(trans);
}

function getRezervaCF(transactions) {
    var prijmy = transactions.filter(function (x) {
        return x.typ === "Příjem" &&
            x.skupinaKategorii === "Pravidelné" &&
            x.popisky.includes("Mimořádné");
    });

    var vydaje = transactions.filter(function (x) {
        return x.typ === 'Výdaj' &&
            x.popisky.includes("Mimořádné");
    });

    var beznaSpotreba = sum(prijmy) + sum(vydaje);

    return Math.round(beznaSpotreba * 100) / 100;
}

function getRezervaVydaje(transactions) {
    var vydajeZRezervy = transactions.filter(function (x) {
        return x.typ === 'Výdaj' &&
            x.popisky.includes("Mimořádné");
    });

    return sum(vydajeZRezervy);
}

function getJidloVydaje(transactions) {
    var jidlo = transactions.filter(function (x) {
        return x.typ === 'Výdaj' &&
            x.skupinaKategorii == "Jídlo a pití";
    });

    return sum(jidlo);
}

function getNakupy(transactions) {
    var nakupy = transactions.filter(function (x) {
        return x.typ === 'Výdaj' &&
            x.skupinaKategorii == "Nákupy";
    });

    return sum(nakupy);
}

function getCelkoveCF(transactions) {
    var cf = transactions.filter(function (x) {
        return x.typ === "Příjem" || x.typ === "Výdaj";
    });

    return sum(cf);
}

function getCharitaVydaje(transactions) {
    var charita = transactions.filter(function (x) {
        return x.typ === 'Výdaj' &&
            x.skupinaKategorii == "Darování";
    });

    return sum(charita);
}

function getFinancniVydaje(transactions) {
    var financniVydaje = transactions.filter(function (x) {
        return x.typ === 'Výdaj' &&
            x.skupinaKategorii == "Finanční výdaje";
    });

    return sum(financniVydaje);
}

function getBeznaSpotrebaVydaje(transactions) {
    // všechny výdaje kromě bydlení, mimořádných a osobních
    var vydaje = transactions.filter(function (x) {
        return x.typ === 'Výdaj' &&
            x.skupinaKategorii !== "Bydlení" &&
            !x.popisky.includes('Mimořádné') &&
            !x.popisky.includes("Martin") &&
            !x.popisky.includes("Káťa");
    });
    
    var beznaSpotreba = sum(vydaje);

    return Math.round(beznaSpotreba * 100) / 100;
}

function getOstatniVydajeBezneSpotreby(transactions) {
    var vydaje = getBeznaSpotrebaVydaje(transactions);
    var jidlo = getJidloVydaje(transactions);
    var charita = getCharitaVydaje(transactions);
    var financni = getFinancniVydaje(transactions);

    var ostatniVydaje = vydaje - jidlo - charita - financni;

    return Math.round(ostatniVydaje * 100) / 100;
}

function getBydleniVydaje(transactions) {
    var vydajeZaBydleni = transactions.filter(function (x) {
        return x.typ === 'Výdaj' &&
            x.skupinaKategorii === "Bydlení"
    });

    return sum(vydajeZaBydleni);
}

function getCelkoveVydaje(transactions) {
    var celkoveVydaje = transactions.filter(function (x) {
        return x.typ === 'Výdaj';
    });

    return sum(celkoveVydaje);
}

// Funkce pro výpočet příjmů

function getPravidelnePrijmy(transactions) {
    var pravidelnePrijmy = transactions.filter(function (x) {
        return x.typ === 'Příjem' &&
        x.skupinaKategorii === "Pravidelné";
    });

    return sum(pravidelnePrijmy);
}

function getOstatniPrijmy(transactions) {
    var ostatniPrijmy = transactions.filter(function (x) {
        return x.typ === 'Příjem' &&
        x.skupinaKategorii !== "Pravidelné";
    });

    return sum(ostatniPrijmy);
}

function getCelkovePrijmy(transactions) {
    var celkovePrijmy = transactions.filter(function (x) {
        return x.typ === 'Příjem';
    });

    return sum(celkovePrijmy);
}