const showBookingPage=document.getElementById("show-booking-page");
const ShowSignIn=document.getElementById("show-sign-in");
const popUp=document.querySelector(".popup");
const hrefCurrent=location.href;

const signIn=document.querySelector(".signin-box");
const signUp=document.querySelector(".signup-box");

const SignInCloseIcon=document.getElementById("signin-close-icon");
const SignUpCloseIcon=document.getElementById("signup-close-icon");

const signInForm=document.getElementById("signin-form");
const signInEmail=document.getElementById("signin-email");
const signInPassword=document.getElementById("signin-password");
const signInBtn=document.getElementById("signin-btn");
const signInMsgBox=document.getElementById("signin-msg");

const signUpForm=document.getElementById("signup-form");
const signUpName=document.getElementById("signup-name");
const signUpEmail=document.getElementById("signup-email");
const signUpPassword=document.getElementById("signup-password");
const signUpBtn=document.getElementById("signup-btn");
const signUpMsgBox=document.getElementById("signup-msg");

const formElement=document.querySelectorAll(".form-element");
const backgroundCover=document.querySelector(".backgroundcover");

// 會員登入畫面
function show_hide(){
    if(signIn.style.display==="none"){
        signIn.style.display="block";
        signInEmail.value="";
        signInPassword.value="";
        signUp.style.display="none";

        for( let i=0;i<formElement.length;i++){
            formElement[i].className="form-element";
        }
    }else{
        signIn.style.display="none";
        backgroundCover.style.display="none";
        signUp.style.display="block";
        backgroundCover.style.display="block";
        // signUp.style.visibility="visible";
     
        signUpName.value="";
        signUpEmail.value="";
        signUpPassword.value="";

        for( let i=0;i<formElement.length;i++){
            formElement[i].className="form-element";
        }
    }
}

ShowSignIn.addEventListener("click", function(){
    if (ShowSignIn.innerHTML==="登入/註冊"){
        popUp.classList.add("active");
        signIn.style.display="block";
        backgroundCover.style.display="block";
    }
});

SignInCloseIcon.addEventListener("click", function(){
    signInMsgBox.style.display="none";
    signInEmail.value="";
    signInPassword.value="";

    for( let i=0;i<formElement.length;i++){
        formElement[i].className="form-element";
    }

    popUp.classList.remove("active");
    signIn.style.display="none";
    backgroundCover.style.display="none";
});

SignUpCloseIcon.addEventListener("click", function(){
    signUpMsgBox.style.display="none";
    signUpName.value="";
    signUpEmail.value="";
    signUpPassword.value="";

    for( let i=0;i<formElement.length;i++){
        formElement[i].className="form-element";
    }

    popUp.classList.remove("active");
    // signIn.style.display="block";
    signUp.style.display="none";
    // signUp.style.visibility="hidden";
    backgroundCover.style.display="none";
});

//登入視窗背景事件
backgroundCover.addEventListener("click", function(){
   
    for( let i=0;i<formElement.length;i++){
        formElement[i].className="form-element";
    }

    signInMsgBox.style.display="none";
    signInEmail.value="";
    signInPassword.value="";
    
    if (signUp.style.display=="block"){
        for( let i=0;i<formElement.length;i++){
            formElement[i].className="form-element";
        }

        signUpMsgBox.style.display="none";
        signUpName.value="";
        signUpEmail.value="";
        signUpPassword.value="";
    }

    popUp.classList.remove("active");
    signIn.style.display="block";
    signUp.style.display="none";
    // signUp.style.visibility="hidden";
    backgroundCover.style.display="none";
});

//隱藏註冊訊息
signUp.addEventListener("click", function(event){
    if(!event.target.matches(".sign-btn")){
        if (signUpMsgBox.style.display=="block"){
            signUpMsgBox.style.display="none";
        }
    }
})

//隱藏登入訊息
signIn.addEventListener("click", function(event){
    if(!event.target.matches(".sign-btn")){
        if (signInMsgBox.style.display=="block"){
            signInMsgBox.style.display="none";
        }
    }
})

//會員註冊程序
function signUpSubmit(){
    const signUpNameValue=signUpName.value;
    const signUpEmailValue=signUpEmail.value;
    const signUpPasswordValue=signUpPassword.value;
    if (signUpNameValue.length!=0 && signUpEmailValue.length!=0 && signUpPasswordValue.length!=0){
        let src="/api/user";
        fetch(src, {
            method: "POST",
            body: JSON.stringify({
                "name": signUpNameValue,
                "email": signUpEmailValue,
                "password": signUpPasswordValue
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then(response=>response.json())
        .then((data)=>{
            if (data["ok"]===true){
                for( let i=0;i<formElement.length;i++){
                    formElement[i].className="form-element";
                }

                signUpMsgClear();
                let successedContent=document.createTextNode("您好，會員已註冊成功，請重新登入!");
                signUpMsgBox.setAttribute("class", "signup-successed")
                signUpMsgBox.appendChild(successedContent);
                signUpMsgBox.style.display="block";
            }else{
                if (data["message"]==="Email already exists."){

                    for( let i=0;i<formElement.length;i++){
                        formElement[i].className="form-element";
                    }

                    signUpMsgClear();
                    let emailExistsMsg=document.createTextNode("抱歉，您輸入的Email已被註冊！");
                    signUpMsgBox.setAttribute("class", "signup-failed");
                    signUpMsgBox.appendChild(emailExistsMsg);
                    signUpMsgBox.style.display="block";
                }else{

                    for( let i=0;i<formElement.length;i++){
                        formElement[i].className="form-element";
                    }

                    signUpMsgClear();
                    let failedContent=document.createTextNode("註冊失敗！");
                    signUpMsgBox.setAttribute("class", "signup-failed")
                    signUpMsgBox.appendChild(failedContent);
                    signUpMsgBox.style.display="block";
                }          
            }
        })
        .catch((error)=>{
            console.error("其它錯誤", error);
            signUpMsgClear();
        })
    }else{
        signUpMsgClear();
        let errorContent=document.createTextNode("請輸入正確格式");
        signUpMsgBox.setAttribute("class", "signup-failed")
        signUpMsgBox.appendChild(errorContent);
        signUpMsgBox.style.display="block";
    }
}

let signUpMsgClear=()=>{
    signUpMsgBox.innerHTML="";
}

signUpBtn.addEventListener("click", signUpCheck);

//會員登入程序
function signInSubmit(){
    const signInEmailValue=signInEmail.value;
    const signInPasswordValue=signInPassword.value;
    if (signInEmailValue.length!=0 && signInPasswordValue.length!=0){
        let src="/api/user/auth";
        fetch(src, {
            method: "PUT",
            body: JSON.stringify({
                "email": signInEmailValue,
                "password": signInPasswordValue
            }),
            headers:{
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then(response=>response.json())
        .then((data)=>{
            if (data["ok"]===true){
                signInMsgClear();
                let signInSuccessedContent=document.createTextNode("登入成功！");
                signInMsgBox.setAttribute("class", "signin-successed")
                signInMsgBox.appendChild(signInSuccessedContent);
                signInMsgBox.style.display="block";
                redirect();
            }else{
                if (data["message"]==="Incorrect email or password."){

                    for( let i=0;i<formElement.length;i++){
                        formElement[i].className="form-element";
                    }

                    signInMsgClear();
                    let incorrectInputMsg=document.createTextNode("請輸入正確的Email及密碼！");
                    signInMsgBox.setAttribute("class", "signin-failed");
                    signInMsgBox.appendChild(incorrectInputMsg);
                    signInMsgBox.style.display="block";
                }else if (data["message"]==="Email unknown."){

                    for( let i=0;i<formElement.length;i++){
                        formElement[i].className="form-element";
                    }

                    signInMsgClear();
                    let incorrectInputMsg=document.createTextNode("請輸入正確的Email！");
                    signInMsgBox.setAttribute("class", "signin-failed");
                    signInMsgBox.appendChild(incorrectInputMsg);
                    signInMsgBox.style.display="block";
                } else{

                    for( let i=0;i<formElement.length;i++){
                        formElement[i].className="form-element";
                    }

                    signInMsgClear();
                    let incorrectPasswordMsg=document.createTextNode("請輸入正確的密碼！");
                    signInMsgBox.setAttribute("class", "signin-failed");
                    signInMsgBox.appendChild(incorrectPasswordMsg);
                    signInMsgBox.style.display="block";
                }    
            }
        })
        .catch((error)=>{
            console.error("其它錯誤", error);
            signInMsgClear();
        })
    }else{
        signInMsgClear();
        let errorContent=document.createTextNode("請輸入正確格式");
        signInMsgBox.setAttribute("class", "signin-failed")
        signInMsgBox.appendChild(errorContent);
        signInMsgBox.style.display="block";
    }
}

let signInMsgClear=()=>{
    signInMsgBox.innerHTML="";
}

signInBtn.addEventListener("click", signInCheck);

function redirect(){
    location.reload();
}

//檢查登入狀態
function signInStatusCheck(){
    let src="/api/user/auth";
    let request=new XMLHttpRequest();
    request.open("GET", src, true);;
    request.send();
    request.onload=function(){
        let data=JSON.parse(this.responseText);
        console.log(data)
        changeNavItem(data);
    }
    request.onerror=function(){
        console.log("request failed");
    };
}

window.addEventListener("DOMContentLoaded",signInStatusCheck(), false);

//改變畫面右上的nav-item 登入/註冊 > 登出系統
function changeNavItem(data){
    let navItem=document.getElementById("show-sign-in");
    if (data["data"]!=null && navItem.innerHTML!="登出系統"){
        navItem.innerHTML="";
        navItem.innerText="登出系統";
        navItem.setAttribute("id", "sign-out");
        navItem.addEventListener("DOMContentLoaded",signOutListen(), false);
    }else{       
        restoreNavItem();
    }
}

//恢復畫面右上的nav-item 登出系統 > 登入/註冊
function restoreNavItem(){
    let navItem=document.getElementById("sign-out");
    if (navItem!=null){
        navItem.innerHTML="";
        navItem.innerText="登入/註冊";
        navItem.setAttribute("id", "show-sign-in");
    }
}

// 監聽登出事件
function signOutListen(){
    let navItem=document.getElementById("sign-out");
    navItem.addEventListener("click", signOut);
}

//登出流程
function signOut(){
    let src="/api/user/auth";
    fetch(src, {
        method: "DELETE",
    })
    .then(response=>response.json())
    .then(()=>{
        setTimeout("redirect()", 100);
    })
}

//表單輸入驗證
const EmailRegex=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
const PasswordRegex=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;

//註冊輸入驗證
let signUpNameCheck;
let signUpEmailCheck;
let signUpPasswordCheck;

function signUpCheck(){
    const signUpNameValue=signUpName.value.trim();
    const signUpEmailValue=signUpEmail.value.trim();
    const signUpPasswordValue=signUpPassword.value.trim();

    signUpNameCheck=false;
    signUpEmailCheck=false;
    signUpPasswordCheck=false;


    if (signUpNameValue===""){
        setErrorFor(signUpName, "姓名不得為空白");
    }else if(signUpNameValue.length<3 || signUpNameValue.length>10){
        setErrorFor(signUpName, "長度須介於3~10個字"); 
    }else{
        SetSuccessFor(signUpName);
        signUpNameCheck=true;
    }

    if (signUpEmailValue===""){
        setErrorFor(signUpEmail, "Email不得為空白");
    }else if(signUpEmailValue.match(EmailRegex)===null){
        setErrorFor(signUpEmail, "請填寫正確的Email格式：trip123@example.com");
    }else{
        SetSuccessFor(signUpEmail);
        signUpEmailCheck=true;
    }

    if (signUpPasswordValue===""){
        setErrorFor(signUpPassword, "密碼不得為空白");
    }else if(signUpPasswordValue.match(PasswordRegex)===null){
        setErrorFor(signUpPassword, "長度須介於8~12字，且包含數字及英文字");
    }else{
        SetSuccessFor(signUpPassword);
        signUpPasswordCheck=true;
    }

    if(signUpNameCheck&&signUpEmailCheck&&signUpPasswordCheck){
        signUpSubmit();
    }
}

//登入輸入驗證
let signInEmailCheck;
let signInPasswordCheck;

function signInCheck(){
    const signInEmailValue=signInEmail.value.trim();
    const signInPasswordValue=signInPassword.value.trim();

    let signInEmailCheck=false;
    let signInPasswordCheck=false;

    if (signInEmailValue===""){
        setErrorFor(signInEmail, "Email不得為空白");
    }else if(signInEmailValue.match(EmailRegex)===null){
        setErrorFor(signInEmail, "請填寫正確的Email格式：trip123@example.com");
    }else{
        SetSuccessFor(signInEmail);
        signInEmailCheck=true;
    }

    if (signInPasswordValue===""){
        setErrorFor(signInPassword, "密碼不得為空白");
    }else if(signInPasswordValue.match(PasswordRegex)===null){
        setErrorFor(signInPassword, "長度須介於8~12字，且包含數字及英文字");
    }else{
        SetSuccessFor(signInPassword);
        signInPasswordCheck=true;
    }

    if(signInEmailCheck&&signInPasswordCheck){
        signInSubmit();
    }
}

function setErrorFor(input, message){
    let formControl=input.parentElement; // .form-element
    let small=formControl.querySelector("small");
    small.innerText=message;
    formControl.className="form-element error";
}

function SetSuccessFor(input){
    let formControl=input.parentElement;
    formControl.className="form-element success";
}

//監聽瀏覽器返回按鈕事件
// window.addEventListener("popstate", function(e){
//     alert("監聽事件成功");
// },false)

// function signInStatusCheck(){
//     let src="/api/user/auth";
//     fetch(src, {
//         method: "GET",
//     })
//     .then(response=>response.json())
//     .then((data)=>{
//         console.log(data)
//     })
// }

//booking前檢查登入狀態
function signInStatusCheckForBooking(){
    let src="/api/user/auth";
    fetch(src, {
        method: "GET",
    })
    .then(response=>response.json())
    .then((data)=>{
        if (data["data"]==null){
            console.log(data);
            signInStatus=false;
            return signInStatus
        }else{
            signInStatus=true;
            return signInStatus
        }
    })
}
let signInStatus=signInStatusCheckForBooking();

function afterCheck(){
    console.log(signInStatus);
    if (signInStatus==true){
        redirectToBooking();
    }else{
        popUp.classList.add("active");
        signIn.style.display="block";
        backgroundCover.style.display="block";
    }
}

//導向booking頁面
function redirectToBooking(){
    location.href="/booking";
}

showBookingPage.addEventListener("click", afterCheck);