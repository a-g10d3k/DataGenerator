import { faker as faker_pl } from 'https://cdn.skypack.dev/@faker-js/faker/locale/pl';
import { faker as faker_en_AU } from 'https://cdn.skypack.dev/@faker-js/faker/locale/en_AU';
import { faker as faker_de } from 'https://cdn.skypack.dev/@faker-js/faker/locale/de';
var page = 0;
var seed = '';
var rng = new Math.seedrandom(seed + page);
var records = [];
var formattedRecords = [];
var locale = 'pl';
var fakerLocales = {
    'pl': faker_pl,
    'en_AU': faker_en_AU,
    'de': faker_de
};
var localeNames = {
    'pl': 'Poland',
    'en_AU': 'Australia',
    'de': 'Germany'
};
var faker = fakerLocales[locale];
var callingCodes = {
    'pl': '+48',
    'en_AU': '+61',
    'de': '+49'
};
var phoneFormats = [
    '### ### ###',
    '###-###-###',
    '## ## ### ##',
    '##-##-###-##',
    '##-###-##-##',
    '#########'
];
var characterSets = {
    'pl': ["a", "ą", "b", "c", "ć", "d", "e", "ę", "f", "g", "h", "i", "j", "k", "l", "ł", "m", "n", "ń", "o", "ó", "p", "q", "r", "s", "ś", "t", "u", "v", "w", "x", "y", "z", "ż", "ź", "A", "Ą", "B", "C", "Ć", "D", "E", "Ę", "F", "G", "H", "I", "J", "K", "L", "Ł", "M", "N", "Ń", "O", "Ó", "P", "Q", "R", "S", "Ś", "T", "U", "V", "W", "X", "Y", "Z", "Ż", "Ź", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ",", ".", "\\", "/", "-", "_", "!", "?"],
    'en_AU': ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ",", ".", "\\", "/", "-", "_", "!", "?", "'"],
    'de': ["ä", "ö", "ü", "ß", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ",", ".", "\\", "/", "-", "_", "!", "?", "'"]
}

function randRange(from, to) {
    return (Math.abs(rng.int32()) % (to - from)) + from;
}

$.each(fakerLocales, function (key, value) {
    value.mersenne.rand = (max, min) => randRange(min, max);
});

const grid = new gridjs.Grid({
    columns: [
        'Index',
        {
            name: 'Id',
            attributes: {'style': 'font-size:13px'}
        },
        'Name',
        'Address',
        'Phone'
    ],
    autoWidth: false,
    style: {
        table: {
            width: '100%'
        }
    },
    data: [
    ],
    className: {
        table: 'table table-hover',
        thead: 'table-dark'
    }
}).render($('#table-wrapper')[0]);

function getRandomElement(array) {
    return array[Math.abs(rng.int32()) % array.length];
}

function generateRecord() {
    let sex = getRandomElement(['male', 'female']);
    let person = {
        id: faker.datatype.uuid(),
        data: {
            firstName: faker.name.firstName(sex),
            middleName: getRandomElement([faker.name.firstName(sex), null]),
            lastName: faker.name.lastName(sex),
            city: faker.address.cityName(),
            region: getRandomElement([faker.address.state(), null]),
            zipcode: getRandomElement([faker.address.zipCode(), null]),
            street: faker.address.street(),
            streetAddress: faker.address.buildingNumber() + getRandomElement([' ' + faker.address.secondaryAddress(), '']),
            phoneNumber: getRandomElement([callingCodes[locale] + ' ', '']) + faker.phone.number(getRandomElement(phoneFormats))
        }
    }
    return person;
}

function removeRandomCharacter(s) {
    if (s.length == 0) return s;
    let index = Math.abs(rng.int32()) % s.length;
    return s.slice(0, index) + s.slice(index + 1);
}

function addRandomCharacter(s) {
    let index = Math.abs(rng.int32()) % s.length + 1;
    return s.slice(0, index) + getRandomElement(characterSets[locale]) + s.slice(index);
}

function swapRandomCharacters(s) {
    if (s.length < 2) return s;
    let index = Math.abs(rng.int32()) % (s.length - 1);
    return s.slice(0, index) + s.slice(index + 1, index + 2) + s.slice(index, index + 1) + s.slice(index + 2);
}

function generateErrors(person, probability) {
    let errorNumber = Math.floor(probability);
    if (rng() < probability % 1) ++errorNumber;
    for (let i = 0; i < errorNumber; ++i) {
        generateError(person);
    }
    return person;
}

function generateError(person) {
    let keys = Object.keys(person.data).filter(key => person.data[key]);
    let key = getRandomElement(keys);
    let errorFunc = getRandomElement([
        removeRandomCharacter,
        addRandomCharacter,
        swapRandomCharacters
    ]);
    person.data[key] = errorFunc(person.data[key]);
    return person;
}

function generateRecords(count, errorProbability) {
    rng = new Math.seedrandom(seed + page);
    let newRecords = [];
    for (let i = 0; i < count; ++i) {
        let person = generateRecord();
        newRecords.push(person);
    }
    for (let i = 0; i < count; ++i) {
        generateErrors(newRecords[i], errorProbability);
    }
    ++page;
    return newRecords;
}

function updateTable(count) {
    let errorProbability = $('input[name="errorProbability"]').val();
    records.push(...generateRecords(count, errorProbability));
    formattedRecords = records.map((r, i) => [
        i,
        r.id,
        `${r.data.lastName} ${r.data.firstName} ${r.data.middleName || ''}`.replace(/  +/g, ' ').replace(/ +$/g, ''),
        `${r.data.city + (r.data.region || (!r.data.region && !r.data.zipcode) ? ',' : '')} ${r.data.region || ''} ${r.data.zipcode || ''} ${r.data.street} ${r.data.streetAddress}`.replace(/  +/g, ' ').replace(/ +$/g, ''),
        r.data.phoneNumber,
    ]);
    grid.updateConfig({
        data: formattedRecords
    }).forceRender();
}

function resetTable(count) {
    records = [];
    page = 0;
    rng = new Math.seedrandom();
    updateTable(count);
    $('#table-wrapper').css("min-height", 0);
}

function randomizeSeed() {
    let seedRandomizer = new Math.seedrandom();
    setSeed(String(Math.abs(seedRandomizer.int32())));
    $('input[name="seed"]').val(seed);
}

function setSeed(s) {
    seed = s;
    resetTable(20);
}

function setLocale(l) {
    locale = l;
    faker = fakerLocales[locale];
    resetTable(20);
}

function exportCsv() {
    let exportArray = [
        ["Id", "Name", "Address", "Phone number"],
        ...formattedRecords.map(r => [r[1], r[2], r[3], r[4]])
    ];
    let csv = $.csv.fromArrays(exportArray);
    let blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, 'records.csv');
}

$('input[name="seed"]').on('input', function (e) {
    setSeed($(this).val());
});

$('input.errorProbability').on('input', function (e) {
    $('input.errorProbability').not($(this)).val($(this).val());
    resetTable(20);
});

$('button#randomize-seed').on('click', function (e) {
    randomizeSeed();
});

$('button#export-csv').on('click', function (e) {
    exportCsv();
});

$.each(localeNames, function (key, value) {
    var $option = $("<option/>", {
        value: key,
        text: value
    });
    $('select#locale').append($option);
});

$('select#locale').on('input', function (e) {
    setLocale($(this).val());
});

$(window).scroll(function () {
    if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
        $('#table-wrapper').css("min-height", $('#table-wrapper').height());
        updateTable(10);
    }
});

updateTable(20);