'use strict';
var gIsMore = true;
var gIsMoreKeywords = false;
var gElGalleryContainer = document.querySelector('.gallery-container');
var gElGalleryPage = document.querySelector('.gallery-page');
var gElCanvasPage = document.querySelector('.canvas-container');
var gElAboutPage = document.querySelector('.about-container');
var gElSearchBar = document.querySelector('.search-container');

// On Load Page
function onInit() {
    onRenderKeywords()
    onRenderGallery()
}

// Open Gallery Page
function onOpenGalleryPage() {
    gElGalleryPage.classList.add('active');
    gElAboutPage.classList.remove('active');
    gElCanvasPage.classList.add('hide-el');;
    gElAboutPage.style.display = "none";
    gElSearchBar.style.display = "flex";
    gElGalleryContainer.style.display = "grid";
}

// Open About Page
function onOpenAboutPage() {
    gElAboutPage.classList.add('active');
    gElGalleryPage.classList.remove('active');
    gElCanvasPage.style.display = "none";
    gElGalleryContainer.style.display = "none";
    gElSearchBar.style.display = "none";
    gElAboutPage.style.display = "flex";
}

// Open Canvas
function onEditImg(imgId) {
    updateSelectedImgId(imgId);
    renderCanvas();
    gElGalleryContainer.style.display = "none";
    gElAboutPage.style.display = "none";
    gElSearchBar.style.display = "none";
    gElCanvasPage.style.display = "flex";
}

// Put all the KeyWords On The Page
function onRenderKeywords() {

    var cnt = 0;
    var strHTML = ``
    var keywords = getKeywords();

    for (var keyword in keywords) {
        var fontSize = 16 + keywords[keyword]
        strHTML += `<button onclick="onSearchImg('${keyword}', true)" class="search-btn ${keyword}" style="font-size:${fontSize}px">${keyword}</button>`
        cnt++
        if (cnt === 5) {
            strHTML += `<button onclick="onMoreKeywords(this)" class="search-btn more">more...</button>`
            strHTML += `<div class="more-keywords">`
        }
    }
    strHTML += `</div>`
    document.querySelector('.keywords-search').innerHTML = strHTML;
}

//Put all the IMGS on the page
function onRenderGallery() {
    var imgs = getImges();
    var strHtml = '';
    imgs.forEach(img => {
        strHtml += `<img id="img-${img.id}" src="${img.url}" class="gallery-img" onclick="onEditImg(${img.id})">`
    })
    gElGalleryContainer.innerHTML = strHtml;
    gElAboutPage.style.display = 'none';
    gElGalleryPage.classList.add('active');
}

// Search Imges By KeyWords On The Page - Clicked Button Or Input
function onSearchImg(searchWord, isKeyword = false) {

    var imgs = getImges()
    var searchedImgs = imgs.filter(img => {
        var imgsKeywords = img.keywords
        var isInclude = imgsKeywords.find(keyword => keyword.startsWith(searchWord.toLowerCase()))
        if (isInclude) return img
    })

    var strHtml = ``
    searchedImgs.forEach(img => {
        strHtml += `<img id="img-${img.id}" src="${img.url}"  onclick="onEditImg(${img.id})">`
    })
    gElGalleryContainer.innerHTML = strHtml;

    if (isKeyword) {
        document.querySelector('.search-container input').value = searchWord;
        onSearchImgKeyWord(searchWord)
    }

    onRenderKeywords()
    if (gIsMoreKeywords) document.querySelector('.more-keywords').classList.toggle('block')
}

//Toggle More KeyWords 
function onMoreKeywords(elMoreBtn) {
    if (gIsMore) {
        elMoreBtn.innerText = 'less...'
        gIsMore = false;
    } else {
        elMoreBtn.innerText = 'more...'
        gIsMore = true;
    }
    document.querySelector('.more-keywords').classList.toggle('block')
    if (!gIsMoreKeywords) gIsMoreKeywords = true;
    else gIsMoreKeywords = false;
}

// Search Img KeyWord
function onSearchImgKeyWord(searchWord) {
    addSearchImgKeyWord(searchWord)
}