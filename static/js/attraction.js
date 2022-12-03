let path=location.pathname;
let id=path.split("/")[2];
let main=document.querySelector("main");
let slideIndex=1;
let prevN=0

window.onload=function(){
    getData();
    guideFeeDefault();
}

let getData=()=>{
    let src=`/api/attraction/${id}`;
    fetch(src, {
        method: "GET",
    })
    .then((response)=>{
        if(!response.ok){
            main.innerHTML="";
            errorMsg=`
                <div class="error-msg-box">
                    <div class="error-msg">哎呀，查無景點資訊!</div>
                    <a href="/">回到首頁，看看其他景點吧～</a>
                </div>
            `
            main.insertAdjacentHTML("afterbegin", errorMsg)
            throw new Error("response.statusText");
        }else{
            return response.json()
        }
    })
    .then((data)=>{
        let attractionInfo=data["data"];
        if (attractionInfo!=null){

           //展示景點資訊
           showAttractionInfo(attractionInfo);
           showImages(attractionInfo)
           showSlides(slideIndex);
        }
    })
    .catch((error)=>{
        console.error(error);
    })
}

function showAttractionInfo(attractionInfo){
    let attractionName=document.getElementsByClassName("name");
    let name=attractionInfo["name"];
    attractionName[0].insertAdjacentText("beforebegin", name);

    let attractionCategory=document.getElementsByClassName("category");
    let category=attractionInfo["category"]
    attractionCategory[0].insertAdjacentText("beforeend", category);

    let attractionMrt=document.getElementsByClassName("mrt");
    let mrt=attractionInfo["mrt"]   
    attractionMrt[0].insertAdjacentText("beforeend", mrt);

    let attractionDescription=document.getElementsByClassName("description");
    let description=attractionInfo["description"];
    attractionDescription[0].insertAdjacentText("beforeend", description);

    let attractionAddress=document.getElementsByClassName("address-content");
    let address=attractionInfo["address"];
    attractionAddress[0].insertAdjacentText("beforeend", address);

    let attractionTransport=document.getElementsByClassName("transport-content");
    let transport=attractionInfo["transport"];
    attractionTransport[0].insertAdjacentText("beforeend", transport);

    let attractionImgs=attractionInfo["images"];
}

//images&dots
function showImages(attractionInfo){
    let attractionImages=attractionInfo["images"];
    let name=attractionInfo["name"];
    let dots=document.querySelector(".dots");

    for (i=0,j=1;i<attractionImages.length;i++,j++){

        //images
        image=`<div class="img-container"><img class="img" src=${attractionImages[i]} alt="${name}" title="${name}"></div>`
        dots.insertAdjacentHTML("beforebegin", image)
        
        //dots
        circle=`<span class="dot" onclick="currentSlide(${j})"></span>`
        dots.insertAdjacentHTML("beforeend", circle)
    }
}

// Next/previous controls
function plusSlides(n){
    showSlides(slideIndex += n);
    prevN=n
    changeEffect();
}

function changeEffect(){
    let slides=document.getElementsByClassName("img-container");
    if (prevN===-1){
        for (i=0;i<slides.length;i++){
            slides[i].classList.remove("go-right");
            slides[i].classList.remove("go-left");
        }
        slides[slideIndex-1].classList.add("go-left");
    }else{
        for (i=0;i<slides.length;i++){
            slides[i].classList.remove("go-right");
            slides[i].classList.remove("go-left");
        }
        slides[slideIndex-1].classList.add("go-right");
    }
}

// Thumbnail image controls
function currentSlide(n){
    showSlides(slideIndex = n);
}

function showSlides(n){
    let i;
    let slides=document.getElementsByClassName("img-container");
    let dots=document.getElementsByClassName("dot");
    if (n>slides.length){
        slideIndex=1;
    }
    if (n<1){
        slideIndex=slides.length;
    }
    for (i=0;i<slides.length;i++){
        slides[i].style.display="none";
    }
    for (i=0;i<dots.length;i++) {
      dots[i].className=dots[i].className.replace(" active", "");
      
    }
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
}

//pick time and show guide-fee
function pickTime(){
    let pickMorning=document.getElementById("morning");
    let pickAfternoon=document.getElementById("afternoon");
    let morningGuideFee="新台幣2000元";
    let afternoonGuideFee="新台幣2500元";
    let fee=document.querySelector(".fee");

    pickMorning.addEventListener("onload",()=>{ 
        fee.innerHTML="";
        fee.insertAdjacentText("beforeend", morningGuideFee)
    })

    pickMorning.addEventListener("click",()=>{ 
        fee.innerHTML="";
        fee.insertAdjacentText("beforeend", morningGuideFee)
    })

    pickAfternoon.addEventListener("click",()=>{
        fee.innerHTML="";
        fee.insertAdjacentText("beforeend", afternoonGuideFee)
    })
}
pickTime();

//guide fee default
function guideFeeDefault(){
    let pickMorning=document.getElementById("morning");
    let morningGuideFee="新台幣2000元";
    let fee=document.querySelector(".fee");

    fee.innerHTML="";
    fee.insertAdjacentText("beforeend", morningGuideFee)
}

// Go TO TOP BUTTON
let goToTopButton=document.getElementById("go-to-top");
window.onscroll=function(){scrollFunction()};

function scrollFunction(){
  if (document.body.scrollTop>20 || document.documentElement.scrollTop>20) {
    goToTopButton.style.display="block";
  } else {
    goToTopButton.style.display="none";
  }
}

function topFunction(){
  document.body.scrollTop=0; // For Safari
  document.documentElement.scrollTop=0; // For Chrome, Firefox, IE and Opera
}

//image slide auto-play
let timer;
function setTimer(){
    timer=setInterval(function(){
        function plusSlides(n){
            showSlides(slideIndex += 1);
            prevN=1
            changeEffect();
        }
        plusSlides();
    }, 2000)
}
setTimer();
