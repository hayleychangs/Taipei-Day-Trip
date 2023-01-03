window.onload=function(){
    getData();
    getCategories();
}

let nextPage=0;
let keyword=document.getElementById("keyword").value;

function createAttractions(attractionInfo){
    for (let i=0,j=1;i<attractionInfo.length;i++){
        const attractionName=attractionInfo[i].name;
        const attractionMrt=attractionInfo[i].mrt;
        const attractionCategory=attractionInfo[i].category;
        const attractionImage=attractionInfo[i].images[0];
     

        const aTag=document.createElement("a");
            aTag.href=`/attraction/${attractionInfo[i].id}`;
            document.querySelector(".section-attractions").appendChild(aTag);

        const attractionBox=document.createElement("div");
            attractionBox.className="attraction";       
        
        const imgDiv=document.createElement("div");
            imgDiv.className="img-container";        

        const image=document.createElement("img");
            image.className="attraction-img";
            image.src=attractionImage;
            image.alt=attractionName;
            image.title=attractionName;

        const nameDiv=document.createElement("div");
            nameDiv.className="attraction-name";

        const nameContent=document.createTextNode(attractionName);

        const infoDiv=document.createElement("div");
            infoDiv.className="attraction-info";

        const mrtDiv=document.createElement("div");
            mrtDiv.className="attraction-mrt";

        if (attractionMrt!=null){    
            const mrtContent=document.createTextNode(attractionMrt);
            mrtDiv.appendChild(mrtContent);
        }else{
            const mrtContent=document.createTextNode("無捷運站");
            mrtDiv.appendChild(mrtContent);
        }

        const categoryDiv=document.createElement("div");
            categoryDiv.className="attraction-category";  

        const categoryContent=document.createTextNode(attractionCategory);

            
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
        const attractionInfo=data.data;
        if (attractionInfo!=null){

           //建立景點
           createAttractions(attractionInfo);

           nextPage=data.nextPage;

           //取得景點後開始觀察
           InfinitescrollObserver.observe(scrollTarget);
        }
    })
    .catch((error)=>{
        console.error(error);
    })
}

const goSearch=document.getElementById("search-btn");
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
            const attractionInfo=data.data;
            createAttractions(attractionInfo);

            nextPage=data.nextPage;
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
        const attractionInfo=data.data;
        if (attractionInfo.length!=0){
            attractionsClear();
            createAttractions(attractionInfo);
            nextPage=data.nextPage;
            
            //開始觀察
            InfinitescrollObserver.observe(scrollTarget);
        }else{
            attractionsClear();
            const newDiv=document.createElement("div");
                newDiv.className="error-msg";
                newDiv.id="error-msg";
                const errorContent=document.createTextNode("查無結果，請重新輸入");
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
    const element=document.getElementById("section-attractions");
    element.innerHTML="";
}

//取得分類
function getCategories(){
    const src=`/api/categories`;
    fetch(src).then((response)=>{
        if(!response.ok){
            throw new Error("response.statusText");
        }else{
            return response.json();
        }
    })
    .then((data)=>{
        const categories=data.data;
        const categoriesBlock=document.getElementById("categories-menu");

        for (let i=0,j=1;i<=categories.length,j<=categories.length;i++,j++){
            const categoryDiv=document.createElement("div");
                categoryDiv.className="category-item";
                categoryDiv.id="category-"+j;

            const categoryContent=document.createTextNode(categories[i]);

            categoryDiv.appendChild(categoryContent);
            categoriesBlock.appendChild(categoryDiv);
        }

        const categoryItem = document.getElementsByClassName("category-item");
        for(let i=0;i<categoryItem.length;i++){
            categoryItem[i].addEventListener("click", function() {
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