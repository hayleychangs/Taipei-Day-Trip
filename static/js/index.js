window.onload=function(){
    getData();
    getCategories();
}

let nextPage=0;
let keyword=document.getElementById("keyword").value;

function createAttractions(attractionInfo){
    for (let i=0,j=1;i<attractionInfo.length;i++){
        let attractionName=attractionInfo[i]["name"];
        let attractionMrt=attractionInfo[i]["mrt"];
        let attractionCategory=attractionInfo[i]["category"];
        let attractionImage=attractionInfo[i]["images"][0];
     

        let aTag=document.createElement("a");
            aTag.href=`/attraction/${attractionInfo[i]["id"]}`;
            document.querySelector(".section-attractions").appendChild(aTag);

        let attractionBox=document.createElement("div");
            attractionBox.className="attraction";       
        
        let imgDiv=document.createElement("div");
            imgDiv.className="img-container";        

        let image=document.createElement("img");
            image.className="attraction-img";
            image.src=attractionImage;
            image.alt=attractionName;
            image.title=attractionName;

        let nameDiv=document.createElement("div");
            nameDiv.className="attraction-name";

        let nameContent=document.createTextNode(attractionName);

        let infoDiv=document.createElement("div");
            infoDiv.className="attraction-info";

        let mrtDiv=document.createElement("div");
            mrtDiv.className="attraction-mrt";

        if (attractionMrt!=null){    
            let mrtContent=document.createTextNode(attractionMrt);
            mrtDiv.appendChild(mrtContent);
        }else{
            let mrtContent=document.createTextNode("無捷運站");
            mrtDiv.appendChild(mrtContent);
        }

        let categoryDiv=document.createElement("div");
            categoryDiv.className="attraction-category";  

        let categoryContent=document.createTextNode(attractionCategory);

            
        categoryDiv.appendChild(categoryContent);
        infoDiv.appendChild(mrtDiv);
        infoDiv.appendChild(categoryDiv);
        nameDiv.appendChild(nameContent);
        imgDiv.appendChild(image);
        attractionBox.appendChild(imgDiv);
        attractionBox.appendChild(nameDiv);
        attractionBox.appendChild(infoDiv);
        aTag.appendChild(attractionBox);
    }
}

// 取得景點資料
let getData=()=>{
    let src=`/api/attractions?page=${nextPage}`;
    fetch(src).then((response)=>{
        if(!response.ok){
            throw new Error("response.statusText");
        }else{
            return response.json()
        }
    })
    .then((data)=>{
        let attractionInfo=data["data"];
        if (attractionInfo!=null){

           //建立景點
           createAttractions(attractionInfo);

           nextPage=data["nextPage"];

           //取得景點後開始觀察
           InfinitescrollObserver.observe(scrollTarget);
        }
    })
    .catch((error)=>{
        console.error(error);
    })
}

let goSearch=document.getElementById("search-btn");
goSearch.addEventListener("click", ()=>{
    keyword=document.getElementById("keyword").value;
    nextPage=0;
    InfinitescrollObserver.unobserve(scrollTarget);
    getDataByKeyword();
})

//觀察目標
const scrollTarget=document.querySelector("footer");

//建立觀察器
let option={
    root: null,
    rootMargin: '0px',
    threshold: [0]
};
let InfinitescrollObserver = new IntersectionObserver(callback, option);

//觀察到目標後執行的動作
function callback(entries) {    
    if (entries[0].isIntersecting && nextPage!=null){ 
        let src=`/api/attractions?page=${nextPage}`;
        if(keyword!=""){
            src=`/api/attractions?page=${nextPage}&keyword=${keyword}`;
        }
        fetch(src).then((response)=>{
            if(!response.ok){
                throw new Error("response.statusText");
            }else{
                return response.json()
            }
        })
        .then((data)=>{
            // 取消觀察，以免又觸發下一個 request
            InfinitescrollObserver.unobserve(scrollTarget);

            //載入下一頁景點
            let attractionInfo=data["data"];
            createAttractions(attractionInfo);

            nextPage=data["nextPage"];
        })
        .then(()=>{
            if(nextPage!=null){
                setTimeout(()=>{
                    InfinitescrollObserver.observe(scrollTarget);
                }, 500);
            }else{
                InfinitescrollObserver.disconnect(); //關閉觀察器
            }
        })
        .catch((error)=>{
            console.error(error);
        })
        }
};

//關鍵字搜尋
let getDataByKeyword=()=>{
    let src=`/api/attractions?page=${nextPage}&keyword=${keyword}`;
    fetch(src).then((response)=>{
        if(!response.ok){
            throw new Error("response.statusText");
        }else{
            return response.json()
        }
    })
    .then((data)=>{
        let attractionInfo=data["data"];
        if (attractionInfo.length!=0){
            attractionsClear();
            createAttractions(attractionInfo);
            nextPage=data["nextPage"];
            
            //開始觀察
            InfinitescrollObserver.observe(scrollTarget);
        }else{
            attractionsClear();
            let newDiv=document.createElement("div");
                newDiv.className="error-msg";
                newDiv.id="error-msg";
                let errorContent=document.createTextNode("查無結果，請重新輸入");
                newDiv.appendChild(errorContent);
                document.querySelector(".section-attractions").appendChild(newDiv);
        }
    })
    .catch((error)=>{
        console.error(error);
    })
}

//清空景點
let attractionsClear=()=>{
    let element=document.getElementById("section-attractions");
    element.innerHTML="";
}

//取得分類
function getCategories(){
    let src=`/api/categories`;
    fetch(src).then((response)=>{
        if(!response.ok){
            throw new Error("response.statusText");
        }else{
            return response.json();
        }
    })
    .then((data)=>{
        let categories=data["data"];
        let categoriesBlock=document.getElementById("categories-menu");

        for (let i=0,j=1;i<=categories.length,j<=categories.length;i++,j++){
            let categoryDiv=document.createElement("div");
                categoryDiv.className="category-item";
                categoryDiv.id="category-"+j;

            let categoryContent=document.createTextNode(categories[i]);

            categoryDiv.appendChild(categoryContent);
            categoriesBlock.appendChild(categoryDiv);
        }

        const categoryItem = document.getElementsByClassName("category-item");
        for(let i=0;i<categoryItem.length;i++){
            categoryItem[i].addEventListener("click", function() {
                console.log(categoryItem[i].innerText)
                document.getElementById("keyword").value="";   
                document.getElementById("keyword").value += categoryItem[i].innerText
            })
        }

    })
    .catch((error)=>{
        console.error(error);
    })
}

//顯示分類區塊
const categoriesMenu=document.getElementById("categories-menu")
function showMenu(){
    categoriesMenu.classList.add("show")
}

//隱藏分類區塊
window.onclick=(event)=>{
    if(!event.target.matches(".input-click")){
        if (categoriesMenu.classList.contains("show")){
            categoriesMenu.classList.remove("show")
        }
    }
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

