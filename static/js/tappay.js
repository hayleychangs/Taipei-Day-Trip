// 設置 GetPrime 所需的金鑰
TPDirect.setupSDK(APP_ID, APP_KEY, "sandbox")

// Display ccv field
let fields = {
    number: {
        // css selector
        element: "#card-number",
        placeholder: "**** **** **** ****"
    },
    expirationDate: {
        // DOM object
        element: document.getElementById("card-expiration-date"),
        placeholder: "MM / YY"
    },
    ccv: {
        element: "#card-ccv",
        placeholder: "ccv"
    }
}

//信用卡欄位設定
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        "input": {
            "color": "gray"
        },
        // Styling ccv field
        "input.ccv": {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        "input.expiration-date": {
            // 'font-size': '16px'
        },
        // Styling card-number field
        "input.card-number": {
            // 'font-size': '16px'
        },
        // style focus state
        ":focus": {
            "color": "black"
        },
        // style valid state
        ".valid": {
            'color': 'green'
        },
        // style invalid state
        ".invalid": {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        "@media screen and (max-width: 400px)": {
            "input": {
                "color": "orange"
            }
        }
    },

    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

// 觸發 getPrime
const cardErrorNotice=document.querySelector(".card-error-notice");
const submitButton=document.querySelector(".submit-btn");
submitButton.addEventListener("click", onSubmit);
function onSubmit(event) {
    event.preventDefault()

    //聯絡資訊輸入檢查
    const ContactNameCheck=checkOrderContactName();
    const ContactEmailCheck=checkOrderContactEmail();
    const ContactPhoneNumberCheck=checkOrderContactPhoneNumber();

    let ContactNameCheckResult;
    let ContactEmailCheckResult;
    let ContactPhoneNumberCheckResult;

    if (ContactNameCheck===true){
        ContactNameCheckResult=true;
    }else{
        ContactNameCheckResult=false;
    }

    if (ContactEmailCheck===true){
        ContactEmailCheckResult=true;
    }else{
        ContactEmailCheckResult=false;
    }

    if (ContactPhoneNumberCheck===true){
        ContactPhoneNumberCheckResult=true;
    }else{
        ContactPhoneNumberCheckResult=false;
    }

    if (ContactNameCheckResult&&ContactEmailCheckResult&&ContactPhoneNumberCheckResult){
        // 取得 TapPay Fields 的 status
        const tappayStatus=TPDirect.card.getTappayFieldsStatus()

        // 確認是否可以 getPrime
        if (tappayStatus.canGetPrime===false){
            showCardErrorNotice();
            return
        }

        // Get prime
        TPDirect.card.getPrime((result)=>{
            cardErrorNotice.style.display="none";
            const prime=result.card.prime;
            if (result.status!==0){
                alert("get prime error " + result.msg)
                return
            }
            getBookingData(prime);
            // alert('get prime 成功，prime: ' + result.card.prime)
        })
    }
}


let getBookingData=(prime)=>{
    fetch(bookingSrc, {
        method: "GET",
        headers: {"content-Type":"application/json"},
    })
    .then(response=>response.json())
    .then((data)=>{
        const orderData=data.data;
        if (orderData!=null){
            prime=prime;
            //new order
            newOrder(orderData, prime);
        }
    });
}

const contactErrorNotice=document.querySelector(".contact-error-notice");
//建立訂單資訊、送出訂單並付款
function newOrder(orderData, prime){
    if (signInStatus===false){
        popUp.classList.add("active");
        signIn.style.display="block";
        backgroundCover.style.display="block";
    }else{
        const payInfo=document.querySelector(".pay-info");
        payInfo.style.display="block";
        const orderPrime=prime;
        const orderPrice=orderData.price;
        const orderAttractionId=orderData.attraction.id;
        const orderAttractionName=orderData.attraction.name;
        const orderAttractionAddress=orderData.attraction.address;
        const orderAttractionImg=orderData.attraction.image;
        const orderDate=orderData.date;
        const orderTime=orderData.time;

        const orderContactName=document.querySelector(".contact-name").value;
        const orderContactEmail=document.querySelector(".contact-email").value;
        const orderContactPhoneNumber=document.querySelector(".contact-phone-number").value;

        const src="/api/orders";
        fetch(src, {
            method: "POST",
            body: JSON.stringify({
                    "prime": orderPrime,
                    "order": {
                        "price": orderPrice,
                        "trip": {
                            "attraction": {
                                "id": orderAttractionId,
                                "name": orderAttractionName,
                                "address": orderAttractionAddress,
                                "image": orderAttractionImg,
                            },
                            "date": orderDate,
                            "time": orderTime,
                        },
                        "contact": {
                            "name": orderContactName,
                            "email": orderContactEmail,
                            "phone": orderContactPhoneNumber,
                        },
                    },
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
        .then(response=>response.json())
        .then((data)=>{

            if (data.message==="Please fill out all required fields(name, email, phone number)."){
                contactErrorNotice.innerText="*請輸入完整的聯絡資訊!"
                showContactErrorNotice();
            }else if(data.message==="Please make sure all fields(name, email, phone number) are filled in correctly."){
                contactErrorNotice.innerText="*請輸入正確的聯絡資訊!"
                showContactErrorNotice();
            }

            const orderNumber=data.data.number;
            setTimeout(()=>{window.location.href=`/thankyou?number=${orderNumber}`}, 500);

        })
        .catch((error)=>{
            console.error(error);
        })
    }
}

function showCardErrorNotice(){
    cardErrorNotice.style.display="none";
    setTimeout("cardErrorNotice.style.display='block'", 200)
}

function showContactErrorNotice(){
    contactErrorNotice.style.display="none";
    setTimeout("cardErrorNotice.style.display='block'", 200)
}

//------------------------------------------------

//得知目前卡片資訊的輸入狀態
// TPDirect.card.onUpdate(function (update) {
//     // update.canGetPrime === true
//     // --> you can call TPDirect.card.getPrime()
//     const submitButton=document.querySelector(".submit-btn");
//     if (update.canGetPrime) {
//         // Enable submit Button to get prime.
//         submitButton.removeAttribute('disabled')
//     } else {
//         // Disable submit Button to get prime.
//         submitButton.setAttribute('disabled', true)
//     }

//     // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
//     if (update.cardType === 'visa'){
//         // Handle card type visa.
//     }

//     // number 欄位是錯誤的
//     if (update.status.number === 2) {
//         //setNumberFormGroupToError()
//         //console.log("卡號錯誤")
//     } else if (update.status.number === 0) {
//         // setNumberFormGroupToSuccess()
//         //console.log("0，卡號欄位已填好，並且沒有問題")
//     } else {
//         // setNumberFormGroupToNormal()
//         //console.log("1、3，卡號欄位還沒填寫，或使用者正在輸入中")
//     }

//     if (update.status.expiry === 2) {
//         // setNumberFormGroupToError()
//         //console.log("日期錯誤")
//     } else if (update.status.expiry === 0) {
//         // setNumberFormGroupToSuccess()
//         //console.log("0，日期欄位已填好，並且沒有問題")
//     } else {
//         // setNumberFormGroupToNormal()
//         //console.log("1、3，日期欄位還沒填寫，或使用者正在輸入中")
//     }

//     if (update.status.ccv === 2) {
//         // setNumberFormGroupToError()
//         //console.log("CVV錯誤")
//     } else if (update.status.ccv === 0) {
//         // setNumberFormGroupToSuccess()
//         //console.log("0，CVV位已填好，並且沒有問題")
//     } else {
//         // setNumberFormGroupToNormal()
//         //console.log("1、3，CVV欄位還沒填寫，或使用者正在輸入中")
//     }
// })

//信用卡輸入空白驗證
// const cardNumber=document.getElementById("card-number");
// const cardExpirationDate=document.getElementById("card-expiration-date");
// const cardCCV=document.getElementById("card-ccv");

// function checkCardNumber(){
//     let cardNumberCheck=false;
//     const cardNumberValue=cardNumber.value;
//     console.log(cardNumberValue)
//     if (cardNumberValue==""){
//         setErrorForCard(cardNumber, "卡片號碼不得為空白");
//     }else{
//         setSuccessForCard(cardNumber);
//         cardNumberCheck=true;
//         return cardNumberCheck
//     }
// }

// function setErrorForCard(input, message){
//     let formControl=input.parentElement;  .form-box
//     let small=formControl.querySelector("small");
//     small.innerText=message;
//     formControl.className="form-box error";
// }

// function setSuccessForCard(input){
//     let formControl=input.parentElement;
//     formControl.className="form-box success";
// }