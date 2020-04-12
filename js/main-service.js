'use strict';
var gImgId = 0;

// gImgs - all IMGES
var gImgs = [
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['happy, funny'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['funny'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['comics'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['dogs'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['drinks, happy'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['happy'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['dogs'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['books, funny'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['happy'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['happy'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['happy'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['drinks'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['sleep'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['love'] },
    { id: gImgId++, url: `img/${gImgId}.jpg`, keywords: ['eat'] }
];

//  gKeywords - all KEYWORDS
var gKeywords = {
    'funny': 5,
    'comics': 0,
    'dogs': 10,
    'drinks': 8,
    'books': 20,
    'happy': 0,
    'love': 4,
    'eat': 11,
    'sleep': 3
}

// gMeme - Start MEME
var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: [{
        txt: 'Add Text',
        font: 'impact',
        size: 40,
        align: 'center',
        strokeLine: 'black',
        fillColor: 'white',
        positionX: 250,
        positionY: 50,
        isFocus: false
    }, {
        txt: 'Add More Text',
        font: 'impact',
        size: 40,
        align: 'center',
        strokeLine: 'black',
        fillColor: 'white',
        positionX: 250,
        positionY: 430,
        isFocus: false
    }],
}

//  return gImgs
function getImges() {
    return gImgs;
}

//  return selectedImgId
function getSelectedImg() {
    return gMeme.selectedImgId;
}
// return gKeywords
function getKeywords() {
    return gKeywords;
}

// return gMeme
function getMeme() {
    return gMeme;
}

//Render The Txt Location On Small Screen
function renderTxtLocation(canvasW, canvasH) {
    gMeme.lines.forEach(line => {
        line.positionX = (canvasW / 2)
        if (line.positionY > canvasH) line.positionY = canvasH;
    })
}

//render curr line X pos
function renderXpos(posY) {
    if (gIstxtClicked) {
        if (gMeme.lines.length === 0) return;
        var lineIdx = gMeme.selectedLineIdx;
        gMeme.lines[lineIdx].positionY += posY;
    }
}

//render curr line Y pos
function renderYpos(posX) {
    if (gIstxtClicked) {
        if (gMeme.lines.length === 0) return;
        var lineIdx = gMeme.selectedLineIdx;
        gMeme.lines[lineIdx].positionX += posX;
    }
}

// update selected Img
function updateSelectedImgId(imgId) {
    gMeme.selectedImgId = imgId;
}

// update the meme
function editMeme(changedKey, newVal) {
    if (gMeme.lines.length === 0) return;
    const lineIdx = gMeme.selectedLineIdx;
    gMeme.lines[lineIdx][changedKey] = newVal;
}

//update the Selected Line
function updateSelectedLine(lineIdx) {
    gMeme.selectedLineIdx = lineIdx;
}

//update the Line Focus
function updateLineFocus(lineIdx, isFocused) {
    gMeme.lines[lineIdx].isFocus = isFocused;
}

// update Searched Img KeyWords
function addSearchImgKeyWord(txt) {
    gKeywords[txt]++;
}

// Delete Line
function deleteLine() {
    if (gMeme.lines.length === 0) return;
    var lineIdx = gMeme.selectedLineIdx;
    gMeme.selectedLineIdx = 0;
    gMeme.lines.splice(lineIdx, 1);
}

// Switch Lines
function switchLines() {
    if (gMeme.lines.length === 0) return;
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) gMeme.selectedLineIdx = 0;
    else gMeme.selectedLineIdx++;
}

// Add New line
function addLine() {
    var line = {
        txt: 'Add More Txt',
        font: 'impact',
        size: 40,
        align: 'center',
        strokeLine: 'black',
        fillColor: 'white',
        positionX: 225,
        positionY: 225
    }
    gMeme.lines.push(line)
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function changeSize(num) {
    if (gIstxtClicked) {
        if (gMeme.lines.length === 0) return;
        var lineIdx = gMeme.selectedLineIdx;
        gMeme.lines[lineIdx].size += num;
    }
}