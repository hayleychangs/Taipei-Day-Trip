const thankYouCard=document.querySelector(".thank-you-card");
const params=new URL(location.href).searchParams;
const queryString=params.get("number");
const orderSrc=`/api/order/${queryString}`;

window.onload=function(){
    getOrderInfo();
}

//取得訂單資訊 產生感謝頁面
function getOrderInfo(){
    fetch(orderSrc, {
        method: "GET",
        headers: {"content-Type":"application/json"},
    })
    .then(response=>response.json())
    .then((data)=>{
        if (data.message==="Please signin again!"){
            thankYouCard.innerHTML="";
            location.href="/";
        }
        if (data.data===null){
            thankYouCard.innerHTML="";
            errorMsg=`
                <div class="error-msg-box">
                    <div class="error-msg">查無訂單資訊(訂單編號錯誤)，請洽台北一日遊。</div>
                </div>
            `
            thankYouCard.insertAdjacentHTML("afterbegin", errorMsg)
        }else{
            const orderStatus=data.data.status;
            const orderImg=data.data.trip.attraction.image;
            const orderPerson=data.data.contact.name;
            const orderNumber=data.data.number;
            const orderPrice=data.data.price;
            const orderName=data.data.trip.attraction.name;
            const orderDate=data.data.trip.date;
            const orderTime=data.data.trip.time;
            const orderAddress=data.data.trip.attraction.address;
            console.log(orderStatus)
            if (orderStatus==="0"){
                const successBox=document.createElement("div");
                successBox.className="order-success";

                //image
                const orderImgContainer=document.createElement("div");
                orderImgContainer.className="order-img-container"; 
                const orderImgElement=document.createElement("img");
                orderImgElement.className="order-img";
                orderImgElement.src=orderImg;
                orderImgContainer.appendChild(orderImgElement);

                //thanks title
                const thanksTitle=document.createElement("div");
                thanksTitle.className="thanks-title";
                thanksTitle.innerText="親愛的 "+orderPerson+" ，感謝您的訂購！"

                //oder details container
                const orderDetailsContainer=document.createElement("div");
                orderDetailsContainer.className="order-details";

                //order number
                const orderNumberDiv=document.createElement("div");
                orderNumberDiv.className="order-number";
                orderNumberDiv.innerText="訂單編號 "+orderNumber+"，訂單金額新台幣 "+orderPrice+"元，目前狀態為付款成功。"

                //subtitle
                const subtitleDiv=document.createElement("div");
                subtitleDiv.className="subtitle";
                subtitleDiv.innerText="訂購資訊"

                //order name
                const orderNameDiv=document.createElement("div");
                orderNameDiv.className="order-name";
                const nameTitleSpan=document.createElement("span");
                nameTitleSpan.className="detail-list";
                nameTitleSpan.innerText="台北一日遊：";
                const nameContentSpan=document.createElement("span");
                nameContentSpan.innerText=orderName;
                orderNameDiv.appendChild(nameTitleSpan);
                orderNameDiv.appendChild(nameContentSpan);

                //order date
                const orderDateDiv=document.createElement("div");
                orderDateDiv.className="order-date";
                const dateTitleSpan=document.createElement("span");
                dateTitleSpan.className="detail-list";
                dateTitleSpan.innerText="日期：";
                const dateContentSpan=document.createElement("span");
                dateContentSpan.innerText=orderDate;
                orderDateDiv.appendChild(dateTitleSpan);
                orderDateDiv.appendChild(dateContentSpan);

                //order time
                const orderTimeDiv=document.createElement("div");
                orderTimeDiv.className="order-time";
                const timeTitleSpan=document.createElement("span");
                timeTitleSpan.className="detail-list";
                timeTitleSpan.innerText="時間：";
                const timeContentSpan=document.createElement("span");
                if (orderTime==="morning"){
                    timeContentSpan.innerText="上午9點至上午11點"
                }else{
                    timeContentSpan.innerText="下午1點至下午4點"
                }
                orderTimeDiv.appendChild(timeTitleSpan);
                orderTimeDiv.appendChild(timeContentSpan);

                //order address
                const orderAddressDiv=document.createElement("div");
                orderAddressDiv.className="order-address";
                const addressTitleSpan=document.createElement("span");
                addressTitleSpan.className="detail-list";
                addressTitleSpan.innerText="地點：";
                const addressContentSpan=document.createElement("span");
                addressContentSpan.innerText=orderAddress;
                orderAddressDiv.appendChild(addressTitleSpan);
                orderAddressDiv.appendChild(addressContentSpan);

                //notice
                const noticeDiv=document.createElement("div");
                noticeDiv.className="notice";
                noticeDiv.innerText="行程當日務必於預訂時間前抵達指定地點集合，若您有任何疑問，歡迎洽詢台北一日遊。"

                
                orderDetailsContainer.appendChild(orderNumberDiv);
                orderDetailsContainer.appendChild(subtitleDiv);
                orderDetailsContainer.appendChild(orderNameDiv);
                orderDetailsContainer.appendChild(orderDateDiv);
                orderDetailsContainer.appendChild(orderTimeDiv);
                orderDetailsContainer.appendChild(orderAddressDiv);

                successBox.appendChild(orderImgContainer);
                successBox.appendChild(thanksTitle);
                successBox.appendChild(orderDetailsContainer);
                successBox.appendChild(noticeDiv);
                
                thankYouCard.appendChild(successBox);


                printBtn=`<button class="print-btn" onclick="window.print()">列印訂購資訊</button>`
                thankYouCard.insertAdjacentHTML("beforeend", printBtn)

            }else{
                const processingBox=document.createElement("div");
                processingBox.className="order-processing";

                //process title
                const processTitle=document.createElement("div");
                processTitle.className="thanks-title";
                processTitle.innerText="親愛的 "+orderPerson+" ，感謝您在台北一日遊訂購，您的訂單正在處理中！"

                //oder details container
                const orderDetailsContainer=document.createElement("div");
                orderDetailsContainer.className="order-details";

                //order number
                const orderNumberDiv=document.createElement("div");
                orderNumberDiv.className="order-number";
                orderNumberDiv.innerText="訂單編號 "+orderNumber+"，訂單金額新台幣 "+orderPrice+"元，目前狀態為付款失敗，請聯絡客服。"

                //subtitle
                const subtitleDiv=document.createElement("div");
                subtitleDiv.className="subtitle";
                subtitleDiv.innerText="訂購資訊"

                //order name
                const orderNameDiv=document.createElement("div");
                orderNameDiv.className="order-name";
                const nameTitleSpan=document.createElement("span");
                nameTitleSpan.className="detail-list";
                nameTitleSpan.innerText="台北一日遊：";
                const nameContentSpan=document.createElement("span");
                nameContentSpan.innerText=orderName;
                orderNameDiv.appendChild(nameTitleSpan);
                orderNameDiv.appendChild(nameContentSpan);

                //order date
                const orderDateDiv=document.createElement("div");
                orderDateDiv.className="order-date";
                const dateTitleSpan=document.createElement("span");
                dateTitleSpan.className="detail-list";
                dateTitleSpan.innerText="日期：";
                const dateContentSpan=document.createElement("span");
                dateContentSpan.innerText=orderDate;
                orderDateDiv.appendChild(dateTitleSpan);
                orderDateDiv.appendChild(dateContentSpan);

                //order time
                const orderTimeDiv=document.createElement("div");
                orderTimeDiv.className="order-time";
                const timeTitleSpan=document.createElement("span");
                timeTitleSpan.className="detail-list";
                timeTitleSpan.innerText="時間：";
                const timeContentSpan=document.createElement("span");
                if (orderTime=="morning"){
                    timeContentSpan.innerText="上午9點至上午11點"
                }else{
                    timeContentSpan.innerText="下午1點至下午4點"
                }
                orderTimeDiv.appendChild(timeTitleSpan);
                orderTimeDiv.appendChild(timeContentSpan);

                //order address
                const orderAddressDiv=document.createElement("div");
                orderAddressDiv.className="order-address";
                const addressTitleSpan=document.createElement("span");
                addressTitleSpan.className="detail-list";
                addressTitleSpan.innerText="地點：";
                const addressContentSpan=document.createElement("span");
                addressContentSpan.innerText=orderAddress;
                orderAddressDiv.appendChild(addressTitleSpan);
                orderAddressDiv.appendChild(addressContentSpan);
                
                orderDetailsContainer.appendChild(orderNumberDiv);
                orderDetailsContainer.appendChild(subtitleDiv);
                orderDetailsContainer.appendChild(orderNameDiv);
                orderDetailsContainer.appendChild(orderDateDiv);
                orderDetailsContainer.appendChild(orderTimeDiv);
                orderDetailsContainer.appendChild(orderAddressDiv);

                processingBox.appendChild(processTitle);
                processingBox.appendChild(orderDetailsContainer)

                thankYouCard.appendChild(processingBox);
            }
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
