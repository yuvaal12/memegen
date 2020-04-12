'use strict';

var gCanvas;
var gCtx;
var gCurrPosX;
var gCurrPosY;
var gIsMoveLine = false;
var gIstxtClicked = true;
var gIsFirstLoad = true;
var gIsLineClicked = false;


// Render Canvas
function renderCanvas() {
    gCanvas = document.querySelector('#edit-canvas');
    gCtx = gCanvas.getContext('2d');
    if (gIsFirstLoad) onResizeCanvas();
    drawImg();
    if (!gIsLineClicked) {
        renderLineRect()
    } else {
        gIsLineClicked = false;
    }
    onRenderTxt()
    onEvListener()
}

// Resize Canvas
function onResizeCanvas() {

    if (window.innerWidth < 500) {
        gCanvas.width = window.innerWidth - 50
        gCanvas.height = window.innerHeight - window.innerHeight / 2
        document.querySelector('.meme-control').style.width = `"${window.innerWidth}px"`

    } else {
        gCanvas.width = 550;
    }
    renderTxtLocation(gCanvas.width, gCanvas.height)
    gIsFirstLoad = false;
}

function drawImg() {
    var imgId = getSelectedImg()
    var elImg = document.querySelector(`#img-${imgId}`)
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height)
}

// update the txt
function onRenderTxt() {

    var meme = getMeme()
    var lines = meme.lines
    if (lines.length === 0) return
    lines.forEach(line => drawText(line))

    var selectedLine = meme.lines[meme.selectedLineIdx]
    document.querySelector('.selected-line-txt').value = selectedLine.txt
}
// Drow  txt on selected line
function drawText(currLine) {
    gCtx.setLineDash([])
    gCtx.lineWidth = '1'
    gCtx.strokeStyle = currLine.strokeLine
    gCtx.fillStyle = currLine.fillColor
    gCtx.font = `${currLine.size}px ${currLine.font}`
    gCtx.textAlign = currLine.align
    gCtx.fillText(currLine.txt, currLine.positionX, currLine.positionY)
    gCtx.strokeText(currLine.txt, currLine.positionX, currLine.positionY)
}

// Draw Rect on line
function renderLineRect() {

    var meme = getMeme()
    if (gIstxtClicked) {
        if (meme.lines.length === 0) return
        var currLine = meme.lines[meme.selectedLineIdx]
        var lineX = currLine.positionX
        var lineY = currLine.positionY
        gCtx.beginPath()
        gCtx.rect(lineX - 200, lineY - 40, 410, 50)
        gCtx.setLineDash([10, 5])
        gCtx.strokeStyle = 'red'
        gCtx.stroke()
    }
}

// update new txt from input
function onChangeTxtVal(newTxt) {
    editMeme('txt', newTxt);
    gIstxtClicked = true;
    renderCanvas()
}

// update new Aline txt
function onChangeAlign(newAlignTxt) {
    editMeme('align', newAlignTxt)
    renderCanvas()
}


// update the stroke color
function onChangeStrokeColor(newStroke) {
    console.log(newStroke);
    editMeme('strokeLine', newStroke)
    renderCanvas()
}
// update the fill color
function onChangeFillColor(value) {
    console.log('ccccc');
    editMeme('fillColor', value)
    renderCanvas()
}


// Change Font Size When User Click + or -
function onChangeFontSize(size) {
    console.log('ccccc');
    changeSize(size)
    renderCanvas()
}

// Change Font When User change input
function onChangeFont(fontName) {
    editMeme('font', fontName)
    renderCanvas()
}

// Render Y pos selected line
function onRenderYpos(newY) {
    renderXpos(newY)
    renderCanvas()
}
// Render X pos selected line
function onRenderXpos(newX) {
    renderYpos(newX)
    renderCanvas()
}

// Switch Lines
function onSwitchLines() {
    switchLines();
    gIstxtClicked = true;
    renderCanvas();
}

// Del Lines
function onDeleteLine() {
    deleteLine();
    renderCanvas();
}

//Add line
function onAddLine() {
    addLine();
    gIstxtClicked = true;
    renderCanvas();
}

//DownLoad Img
function onDownloadCanvas(elLink) {
    gIsLineClicked = true;
    renderCanvas();
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'Img';
}

//share img
function uploadImg(elForm, ev) {
    ev.preventDefault()
    gIsLineClicked = true
    renderCanvas()
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg")

    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}`)
    }
    upload(elForm, onSuccess)
}

//share img
function upload(elForm, onSuccess) {
    var formData = new FormData(elForm)
    fetch('https://ca-upload.com/here/upload.php', {
            method: 'POST',
            body: formData
        })
        .then(function(res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function(err) {
            console.error(err)
        })
}


// Events From User
function onEvListener() {
    //mouse events
    gCanvas.addEventListener('mousedown', startEv);
    gCanvas.addEventListener('mousemove', setEv);
    gCanvas.addEventListener('mouseup', endEv);
    //touch events
    gCanvas.addEventListener('touchstart', startEv);
    gCanvas.addEventListener('touchmove', setEv);
    gCanvas.addEventListener('touchend', endEv);
}

//User Clicked / Touch the line
function startEv(eventName) {
    var lineIdx = 0;
    var clickedX;
    var clickedY;
    var meme = getMeme();
    var lines = meme.lines;
    eventName.preventDefault();
    eventName.stopPropagation();

    if (eventName.type === 'touchstart') {
        clickedX = eventName.changedTouches[0].pageX - gCanvas.getBoundingClientRect().left
        clickedY = eventName.changedTouches[0].pageY - gCanvas.getBoundingClientRect().top
    } else {
        clickedX = eventName.offsetX;
        clickedY = eventName.offsetY;
    }

    lines.forEach(line => {
        if (clickedX > line.positionX - 200 &&
            clickedX < line.positionX + 200 &&
            clickedY > line.positionY - 40 &&
            clickedY < line.positionY + 10) {
            updateSelectedLine(lineIdx);
            updateLineFocus(lineIdx, true)
            document.querySelector('.selected-line-txt').value = line.txt
            renderCanvas()
            gIstxtClicked = true;
            gIsMoveLine = true;
            return;
        }
        lineIdx++;
    })
    gCurrPosX = clickedX
    gCurrPosY = clickedY
    renderCanvas()
}

//User Stop Clicked / Touch the line
function endEv(eventName) {
    gIsMoveLine = false;
    var meme = getMeme()
    eventName.preventDefault();
    eventName.stopPropagation();

    if (gIstxtClicked) {
        var lines = meme.lines
        var lineIdx = 0
        lines.forEach(line => {
            if (line.isFocus) {
                updateLineFocus(lineIdx, false)
                return
            }
            lineIdx++
        })
    }
    gCurrPosX = null;
    gCurrPosY = null;
}

//User Set Line Pos
function setEv(eventName) {
    var meme = getMeme()
    if (gIsMoveLine) {
        var currX;
        var currY;
        eventName.preventDefault()
        eventName.stopPropagation()
        if (eventName.type === 'touchmove') {
            currX = eventName.changedTouches[0].pageX - gCanvas.getBoundingClientRect().left;
            currY = eventName.changedTouches[0].pageY - gCanvas.getBoundingClientRect().top;
        } else {
            currX = eventName.offsetX;
            currY = eventName.offsetY;
        }
        var distanceX = currX - gCurrPosX;
        var distanceY = currY - gCurrPosY;

        if (gIstxtClicked) {
            var lines = meme.lines
            lines.forEach(line => {
                if (line.isFocus) {
                    renderYpos(distanceX)
                    renderXpos(distanceY)
                }
            })
        }
        renderCanvas()
        gCurrPosX = currX;
        gCurrPosY = currY;
    }
}