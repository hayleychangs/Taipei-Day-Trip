window.onload=function(){
    getAttractions();
    getCategories();
}

function createAttractions(attractionInfo){
    // 1. 先建立容器
    // class="section-attractions-page0
    for (let i=0, j=1;i<=attractionInfo.length,j<=attractionInfo.length;i++,j++){
        let attractionBox=document.createElement("div");
            attractionBox.className="box1";
            attractionBox.id="box1-"+j;
            document.querySelector(".section-attractions-page0").appendChild(attractionBox);
    }

     //2. 把抓到的資料放到畫面上
    for (let i=0,j=1;i<=attractionInfo.length,j<=attractionInfo.length;i++,j++){
        let attractionName=attractionInfo[i].name;
        let attractionMrt=attractionInfo[i].mrt;
        let attractionCategory=attractionInfo[i].category;
        let attractionImage=attractionInfo[i].images.split(",", 1)[0];
        let imgDiv=document.createElement("div");
            imgDiv.className="box1-img-container";
            imgDiv.id="box1-"+j+"-img-container";
                
        let image=document.createElement("img");
            image.className="box1-pic";
            image.src=attractionImage;
            image.alt=attractionName;
            image.title=attractionName;

        let nameDiv=document.createElement("div");
            nameDiv.className="box1-name";
            nameDiv.id="box1-"+j+"-name";

        let nameContent=document.createTextNode(attractionName);

        let infoDiv=document.createElement("div");
            infoDiv.className="box1-info";
            infoDiv.id="box1-"+j+"-info";

        let mrtDiv=document.createElement("div");
            mrtDiv.className="box1-mrt";
            mrtDiv.id="box1-"+j+"-mrt";

        let mrtContent=document.createTextNode(attractionMrt);

        let categoryDiv=document.createElement("div");
            categoryDiv.className="box1-category";
            categoryDiv.id="box1-"+j+"-category";

        let categoryContent=document.createTextNode(attractionCategory);
            

        categoryDiv.appendChild(categoryContent);
        mrtDiv.appendChild(mrtContent);
        infoDiv.appendChild(mrtDiv);
        infoDiv.appendChild(categoryDiv);
        nameDiv.appendChild(nameContent);
        imgDiv.appendChild(image);
        document.getElementById("box1-"+j).appendChild(imgDiv);
        document.getElementById("box1-"+j).appendChild(nameDiv);
        document.getElementById("box1-"+j).appendChild(infoDiv);
    }
}


//產生景點
let currentItems = 1;
function createAttractionsB(attractionInfo){
    // 1. 先建立容器
    // class="section-attractions-page1
    for (let i=0, j=currentItems;i<=attractionInfo.length;i++,j++){
        let attractionBox=document.createElement("div");
            attractionBox.className="box2";
            attractionBox.id="box2-"+j;
            document.querySelector(".section-attractions-page1").appendChild(attractionBox);
    }
    console.log("資料長度"+Number(attractionInfo.length));
    console.log("容器建立完成")
    console.log(currentItems)
    
     //2. 把抓到的資料放到畫面上
    for (let i=0,j=currentItems;i<=attractionInfo.length;i++,j++){
        let attractionName=attractionInfo[i]?.name;
        let attractionMrt=attractionInfo[i]?.mrt;
        let attractionCategory=attractionInfo[i]?.category;
        let attractionImage=attractionInfo[i]?.images.split(",", 1)[0];
        let imgDiv=document.createElement("div");
            imgDiv.className="box2-img-container";
            imgDiv.id="box2-"+j+"-img-container";
                
        let image=document.createElement("img");
            image.className="box2-pic";
            image.src=attractionImage;
            image.alt=attractionName;
            image.title=attractionName;

        let nameDiv=document.createElement("div");
            nameDiv.className="box2-name";
            nameDiv.id="box2-"+j+"-name";

        let nameContent=document.createTextNode(attractionName);

        let infoDiv=document.createElement("div");
            infoDiv.className="box1-info";
            infoDiv.id="box2-"+j+"-info";

        let mrtDiv=document.createElement("div");
            mrtDiv.className="box1-mrt";
            mrtDiv.id="box2-"+j+"-mrt";

        let mrtContent=document.createTextNode(attractionMrt);

        let categoryDiv=document.createElement("div");
            categoryDiv.className="box2-category";
            categoryDiv.id="box2-"+j+"-category";

        let categoryContent=document.createTextNode(attractionCategory);
            

        categoryDiv.appendChild(categoryContent);
        mrtDiv.appendChild(mrtContent);
        infoDiv.appendChild(mrtDiv);
        infoDiv.appendChild(categoryDiv);
        nameDiv.appendChild(nameContent);
        imgDiv.appendChild(image);
        document.getElementById("box2-"+j).appendChild(imgDiv);
        document.getElementById("box2-"+j).appendChild(nameDiv);
        document.getElementById("box2-"+j).appendChild(infoDiv);
    }
    currentItems +=Number(attractionInfo.length)
}


// 景點1-12
let getAttractions=()=>{
    const page=0;
    let src=`/api/attractions?page=${page}`;  //0要可變
    fetch(src).then((response)=>{
        if(!response.ok){
            throw new Error("response.statusText");
        }else{
            return response.json()
        }
    })
    .then((data)=>{
        if (data["data"]!=null){
            console.log(data);
            let attractionInfo=data["data"];
            
           //建立景點
           createAttractions(attractionInfo);

    
        //    nextPage=data["nextPage"]
        //    console.log(nextPage)
        //    if (nextPage!=null){

                
        //    }
        }

        //載入12筆資料後開始觀察
        observerInfinite.observe(infinite);
    })
    .catch((error)=>{
        console.error(error);
    })
}


//觀察目標
const infinite = document.getElementById('js-detective');


//建立觀察器
let option= {   // infinite IO option
    root: null,
    rootMargin: '0px',
    threshold: [0]
};
let observerInfinite = new IntersectionObserver(callback, option);

//觀察到目標後執行的動作
let count=1;
function callback(entries) {    
    if (entries[0].isIntersecting){ 
        console.log('Loaded new items');
        let srcNext=`/api/attractions?page=1`; 
        fetch(srcNext).then((response)=>{
            if(!response.ok){
                throw new Error("response.statusText");
            }else{
                return response.json()
            }
        })
        .then((dataNext)=>{
            // 取消觀察，以免又觸發下一個 request
            observerInfinite.unobserve(infinite);

            //載入下一頁景點
            console.log('載入中');
            let attractionInfoNext=dataNext["data"];
            createAttractionsB(attractionInfoNext);

            count++;
        })
        .then(()=>{
            //載入5次測試
            if(count<5){
                observerInfinite.observe(infinite);
            }else{
                observerInfinite.disconnect(); // 關閉觀察器
            }
        })
        .catch((error)=>{
            console.error(error);
        })
        }
};



//關鍵字搜尋
let getResultByKeyword=()=>{
    const page=0;
    const keyword=document.getElementById("keyword").value;
    let src=`/api/attractions?page=${page}&keyword=${keyword}`;
    fetch(src).then((response)=>{
        if(!response.ok){
            console.log(response);
            throw new Error("response.statusText");
        }else{
            return response.json()
        }
    })
    .then((data)=>{
        let attractionInfo=data["data"];
        if (attractionInfo.length!=0){
            // console.log(data["data"]);
            attractionsClear();
            createAttractions(attractionInfo);
            let nextPage=data["nextPage"];
            console.log(nextPage);
            //if nextpage !=null 監聽 滾動事件
        }else{
            attractionsClear();
            let newDiv=document.createElement("div");
                newDiv.className="error-msg";
                newDiv.id="error-msg";
                let errorContent=document.createTextNode("查無結果，請重新輸入");
                newDiv.appendChild(errorContent);
                document.querySelector(".section-attractions-page0").appendChild(newDiv);
        }
    })
    .catch((error)=>{
        console.error(error);
    })
}

let goSearch=document.getElementById("search-btn");
goSearch.addEventListener("click", getResultByKeyword);


//清空景點
let attractionsClear=()=>{
    let elementZero=document.getElementById("section-attractions-page0");
    let elementOne=document.getElementById("section-attractions-page1");
    elementZero.innerHTML="";
    elementOne.innerHTML="";
}


//取得分類
function getCategories(){
    let src=`/api/categories`;
    fetch(src).then((response)=>{
        if(!response.ok){
            console.log(response);
            throw new Error("response.statusText");
        }else{
            return response.json();
        }
    })
    .then((data)=>{
        let categories=data["data"];
        let categoriesBlock=document.getElementById("categories-menu");
        console.log(categories)

        for (let i=0,j=1;i<=categories.length,j<=categories.length;i++,j++){
            let categoryDiv=document.createElement("div");
                categoryDiv.className="category-item";
                categoryDiv.id="category-"+j;

            let categoryContent=document.createTextNode(categories[i]);

            categoryDiv.appendChild(categoryContent);
            categoriesBlock.appendChild(categoryDiv);
        }

        const categoryItem = document.getElementsByClassName("category-item"); //項目class
        console.log(categoryItem)
        for(let i=0;i<categoryItem.length;i++){
            categoryItem[i].addEventListener("click", function() {
                console.log(categoryItem[i].innerText)
                document.getElementById("keyword").value=""; //input的id   
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
    if(!event.target.matches(".input-click")){  //select class
        if (categoriesMenu.classList.contains("show")){
            categoriesMenu.classList.remove("show")
        }
    }
}