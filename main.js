const buttons = document.querySelectorAll(".number"); 
const display = document.querySelector(".result");
const iconDelete = document.querySelector("#icon");

const numbers = document.querySelector(".numbers")

// ---------- UI RENDER -------------

// dynamic data
const numbersData = [
    ["7", "8", "9", "+"], // row1
    ["4", "5", "6", "-"], // row2
    ["1", "2", "3", "x"], // row3
    ["0", ".", "√", "/", "="] // row4
]
// { key: value }

// components - generic
function NumberComponent(number) {
    // template string
    numberHtml = `<div class="number">${number}</div>`
    return numberHtml
}

function PopulateNumbers(numbers) {
    let numberHtmls = []
    for(let i = 0; i<numbers.length; i++) {
        number = NumberComponent(numbers[i])

        numberHtmls.push(number)
    }

    return numberHtmls
}

// array methodları
// map, reduce, forEach, find, findIndex

function NumbersRowComponent(numbersHtml) {
    let numbersConcatString = ""
    for(let i = 0; i<numbersHtml.length; i++) {
        numbersConcatString += numbersHtml[i]
    }
    
    html = `
        <div class="numbersRow">
            ${numbersConcatString}
        </div>
    `

    return html
}

function RenderNumberRows() {
    for(let i = 0; i<numbersData.length; i++) {
        let rowNumbers = numbersData[i]
        // her bir row icin
        let numbersHtml = PopulateNumbers(rowNumbers)

        let numberRow = NumbersRowComponent(numbersHtml)

        numbers.innerHTML += numberRow
    }
}

RenderNumberRows()

// ---------- CALCULATION ------------
buttons.forEach(button => {
    button.addEventListener("mousedown", () => {
        button.style.backgroundColor = "rgb(229, 227, 227)";
    });
    button.addEventListener("mouseup", () => {
        button.style.backgroundColor = "rgb(247, 247, 248)";
    });
});

let arrays = [];
buttons.forEach(element => {
    element.addEventListener("click", () => {
        let icerik = element.textContent;

        arrays.push(icerik);
        console.log(arrays);
        display.textContent = arrays.join("");

        sil(icerik)

        if (icerik === "=") {
            hesapla();
        }
    });
});

function hesapla() {
    let islem = arrays.join("").slice(0, -1);
    while (islem.includes("(")) {
        let parantezIci = islem.match(/\([^\(\)]+\)/);
        if (parantezIci) {
            let parantezliIslem = parantezIci[0].slice(1, -1)
            let sonuc = islemHesapla(parantezliIslem)
            islem = islem.replace(parantezIci[0], sonuc) 
        }
    }
    
    let sayilar = islem.split(/([-+√×/^])/g);

    for (let i = 0; i < sayilar.length; i++) {
        if (sayilar[i] === "√") {
            let sonuc = Math.sqrt(parseFloat(sayilar[i + 1]));
            sayilar.splice(i - 1 , 3, sonuc)
            i--
        }
    }

    for(let i=0; i<sayilar.length; i++){
        if(sayilar[i]==="^"){
            let a=sayilar[i-1]
            let b=sayilar[i+1]
            let sonuc= a**b
            sayilar.splice(i-1, 3, sonuc)
            i--
        }
    }

    for (let i = 0; i < sayilar.length; i++) {
        if (sayilar[i] === "×" || sayilar[i] === "/") {
            let a = parseFloat(sayilar[i - 1])
            let b = parseFloat(sayilar[i + 1])

            let sonuc;
            if (sayilar[i] === "×") {
                sonuc = a * b
            } else {
                sonuc = a / b
            }
            sayilar.splice(i - 1, 3, sonuc)
            i--
        }
    }

    let toplam = parseFloat(sayilar[0]);
    for (let i = 1; i < sayilar.length; i += 2) {
        let operator = sayilar[i];
        let sayi = parseFloat(sayilar[i + 1]);

        if (operator === "+") {
            toplam += sayi;
        } else if (operator === "-") {
            toplam -= sayi;
        }
    }
    display.textContent = toplam;
    arrays = [toplam];
}

function islemHesapla(islem) {
    let sayilar = islem.split(/([-+√×/])/g)

    for (let i = 0; i < sayilar.length; i++) {
        if (sayilar[i] === "√") {
            let sonuc = Math.sqrt(parseFloat(sayilar[i + 1]));
            sayilar.splice(i - 1, 3, sonuc);
            i--
        }
    }

    for (let i = 0; i < sayilar.length; i++) {
        if (sayilar[i] === "×" || sayilar[i] === "/") {
            let a = parseFloat(sayilar[i - 1]);
            let b = parseFloat(sayilar[i + 1]);

            let sonuc;
            if (sayilar[i] === "×") {
                sonuc = a * b;
            } else {
                sonuc = a / b;
            }
            sayilar.splice(i - 1, 3, sonuc);
            i--
        }
    }

    let toplam = parseFloat(sayilar[0]);
    for (let i = 1; i < sayilar.length; i += 2) {
        let operator = sayilar[i];
        let sayi = parseFloat(sayilar[i + 1]);

        if (operator === "+") {
            toplam += sayi;
        } else if (operator === "-") {
            toplam -= sayi;
        }
    }
    return toplam
}

function sil(icerik) {
    if (icerik === "AC") {
        display.textContent = "";
        arrays = [];
    }
}

iconDelete.addEventListener('click', () => {
    display.textContent = arrays.join("").slice(0, -1);
    arrays = [display.textContent];
});
