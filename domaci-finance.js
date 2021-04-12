/**
 * Názvy sloupců z tabulky Zůstatky s funkcemi pro výpočet hodnot.
 */
var zustatkyTableColumnsHeader = [
    {label: 'Běžná spotřeba', value: getBeznaSpotreba},
    // {label: 'Rezerva', value: ??},
    // {label: 'Martin', value: ??},
    // {label: 'Káťa', value: ??}
];

// TODO - odkomentovat a upravit
/**
 * Názvy řádků z tabulky Cashflow s funkcemi pro výpočet hodnot.
 */
var cashflowTableRowsHeader = [
    {label: 'Běžná spotřeba', value: getBeznaSpotreba},
    // {label: 'Rezerva', value: ??},
    // {label: 'Martin', value: ??},
    // {label: 'Káťa', value: ??},
    // {label: 'Celkově', value: ??},
];

// TODO - odkomentovat a upravit
/**
 * Názvy řádků z tabulky Výdaje s funkcemi pro výpočet hodnot.
 */
var vydajeTableRowsHeader = [
    // {label: 'Jídlo a pití', value: ??},
    // {label: 'Nákupy', value: ??},
    // {label: 'Charita a dárky', value: ??}
];

// pro select s roky vytvoří options (od roku 2020 po aktuální) a vybere letošek
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

/**
 * vytvoří tabulku v příslušném containeru s danou vnitřní strukturou
 * @param {*} containerId 
 * @param {*} tableStructure 
 */
function createTable(containerId, tableStructure) {
    let table = document.createElement("table");
    tableStructure(table);

    let parent = document.getElementById(containerId);
    parent.appendChild(table);
}


function zustatkyTableStructure(table) {
    let headersRow = document.createElement("tr");
    let valuesRow = document.createElement("tr");

    zustatkyTableColumnsHeader.forEach(e => {
        let tdHeader = document.createElement("th");
        tdHeader.innerText = e.label;
        headersRow.appendChild(tdHeader);

        let tdValue = document.createElement("td");
        tdValue.innerText = e.value("ahoj");
        valuesRow.appendChild(tdValue);
    });
    table.appendChild(headersRow);
    table.appendChild(valuesRow);
}

/**
 * Z daných transakcí vypočte běžnou spotřebu.
 * @param { array } transactions Pole všech relevantních transakcí.
 * @returns {number} běžná spotřeba
 */
function getBeznaSpotreba(transactions) {
    // TODO - upravit tělo metody dle reality
    return 50;
}