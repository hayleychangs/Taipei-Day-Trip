const bookingBox=document.querySelector(".booking-box");
const welcomeMsg=document.querySelector(".welcome-message");
const bookingImgContainer=document.querySelector(".booking-img-container");
const bookingName=document.querySelector(".booking-name");
const bookingDate=document.querySelector(".booking-date");
const bookingTime=document.querySelector(".booking-time");
const bookingPrice=document.querySelector(".booking-price");
const bookingAddress=document.querySelector(".booking-address");
const totalPrice=document.querySelector(".total-price");
const deleteBookingBtn=document.querySelector(".delete-booking");
const contactName=document.querySelector(".contact-name");
const contactEmail=document.querySelector(".contact-email");
const userSrc="/api/user/auth";
const bookingSrc="/api/booking";
let userName;

window.onload=function(){
    getUsername();
    getBookingInfo();
}

deleteBookingBtn.addEventListener("click", deleteBooking);

function getUsername(){
    fetch(userSrc, {
        method: "GET",
    })
    .then(response=>response.json())
    .then((data)=>{
        if (data.data==null){
            location.href="/";
        }else{
            const userName=data.data.name;
            const userEmail=data.data.email;
            welcomeMsg.innerText="您好，" + userName + "，待預訂的行程如下：";
            contactName.value=userName;
            contactEmail.value=userEmail;      
        }
    })
}

//取得預訂行程API
function getBookingInfo(){
    fetch(bookingSrc, {
        method: "GET",
        headers: {"content-Type":"application/json"},
    })
    .then(response=>response.json())
    .then((data)=>{
        if (data.message==="Please signin again!"){
            bookingBox.innerHTML="";
            location.href="/";
        }
        if (data.data===null){
            bookingBox.innerHTML="";
            errorMsg=`
                <div class="error-msg-box">
                    <div class="error-msg">您目前沒有預訂的行程</div>
                    <a href="/">回到首頁，看看其他景點吧～</a>
                </div>
            `
            bookingBox.insertAdjacentHTML("afterbegin", errorMsg)
        }else{
            const img=document.createElement("img");
            img.className="booking-img";
            img.src=data.data.attraction.image;
            bookingImgContainer.appendChild(img);
            
            const nameSpan=document.createElement("span");
            nameSpan.innerText=data.data.attraction.name;
            bookingName.appendChild(nameSpan);

            const dateSpan=document.createElement("span");
            dateSpan.innerText=data.data.date;
            bookingDate.appendChild(dateSpan);

        
            const timeSpan=document.createElement("span");
            if (data.data.time=="morning"){
                timeSpan.innerText="上午9點至上午11點"
            }else{
                timeSpan.innerText="下午1點至下午4點"
            }
            bookingTime.appendChild(timeSpan);

            const priceSpan=document.createElement("span");
            priceSpan.innerText="新台幣 " + data.data.price + "元";
            bookingPrice.appendChild(priceSpan);

            const addressSpan=document.createElement("span");
            addressSpan.innerText=data.data.attraction.address;
            bookingAddress.appendChild(addressSpan);

            const totalPriceSpan=document.createElement("span");
            totalPriceSpan.innerText="新台幣 " + data.data.price + "元";
            totalPrice.appendChild(totalPriceSpan);

        }
    })
    .catch((error)=>{
        console.error(error);
    })
}

//刪除預定行程
function deleteBooking(){
    fetch(bookingSrc, {
        method: "DELETE",
        headers: {"content-Type":"application/json"},
    })
    .then((response)=>response.json())
    .then((data)=>{
        if (data.ok===true){
            location.reload();
        }
    })
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