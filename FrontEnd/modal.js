let modal = null;
const btnAddPicture = document.getElementById("addPicture")
const formAddWork = document.getElementById("formAddWork")
const pageAddWorks = document.getElementById("addWork")
const pageDeleteWorks = document.getElementById("deleteWork")
const btnBack = document.getElementById("btnBack")
const btnAddWork = document.getElementById("btnAddWork")
const galleryModal = document.getElementById("galleryModal");
const previewImage = document.getElementById("previewImage")
const divUploadPicture = document.getElementById("divUploadPicture");
const selectCat = document.getElementById("categories")
const titleSelected = document.getElementById("title")
const msgForm = document.getElementById("msgForm")
const btnValidateFormAddWork = document.getElementById("btnValidateFormAddWork")

const openModal = async function (e) {
    e.preventDefault()
    modal = document.querySelector(document.getElementById("editionBtn").getAttribute("href"))
    modal.style.display = null;
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true")
    modal.addEventListener("click", closeModal)
    modal.querySelector(".js-close-modal").addEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)
    btnAddWork.addEventListener("click",showAddWork)
    createGallery()
}

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal")
    modal.removeEventListener("click", closeModal)
    modal.querySelector(".js-close-modal").removeEventListener("click", closeModal)
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation)
    btnAddWork.removeEventListener("click", showAddWork)
    showDeleteWork()
    modal = null;
}

const stopPropagation = function (e) {
    e.stopPropagation()
}


const createGallery = async function (){
    const works = await getResponse("http://localhost:5678/api/works");
    galleryModal.innerHTML = ""
    works.forEach(work => {
        const baliseImg =`<figure>
                            <img src ="${work.imageUrl}" class="imgGalleryModal"/>
                            <button class="deleteWorkBtn" work-id=${work.id} ><i class="fa-solid fa-trash-can"></i></button>
                        </figure>`
        galleryModal.innerHTML += baliseImg;
              
    });
    const btnDeletes = galleryModal.querySelectorAll(".deleteWorkBtn");
        btnDeletes.forEach(btnDelete => {
            btnDelete.addEventListener("click",async () => deleteWork(btnDelete.getAttribute("work-id")))
        });  
}

async function deleteWork(workId){
    const token = window.localStorage.getItem("token")
    const deleteResponse = await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers:{ 
            'Authorization':`Bearer ${token}`
        }
    });
    if(deleteResponse.ok){
        await createGallery();
        await createMainGallery();
    }
}

const showAddWork = async function(){    
    const headerModal = modal.querySelector(".headerModal")    
    pageDeleteWorks.style.display = "none";
    pageAddWorks.style.display = "flex";
    btnBack.style.display = "flex";
    headerModal.style.justifyContent = "space-between";
    btnBack.addEventListener("click",showDeleteWork)
    btnAddPicture.addEventListener("change",  function (e) {loadPicture(e)})
    managementBtnForm()
    await createOptionsCategories()
}

const loadPicture = function(e){
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        if(file.size > 4194304){
            msgForm.innerHTML = "Taille de l'image incorrect, 4mo max"
            return
        }

        reader.onload = function(e) {
           divUploadPicture.style.display = "none"
           previewImage.src = e.target.result;
           previewImage.style.display = 'block';
           previewImage.style.width = "129px";
           previewImage.style.height = "193px";
        };
        reader.readAsDataURL(file);
        managementBtnForm()
    }
}

const showDeleteWork = function() {
    const headerModal = modal.querySelector(".headerModal")
    pageDeleteWorks.style.display = "block";
    pageAddWorks.style.display = "none";
    btnBack.style.display = "none";
    headerModal.style.justifyContent = "end";
    resetForm()
    btnBack.removeEventListener("click",showDeleteWork)
}

const createOptionsCategories = async function(){
    const categories = await getResponse("http://localhost:5678/api/categories")
    selectCat.innerHTML = '<option value=""></option>'
    categories.forEach(category => {
        const option = `<option value=${category.id}>${category.name}</option>`
        selectCat.innerHTML += option
    });
}

const resetForm = function(){
    btnAddPicture.value = ""
    titleSelected.value = ""
    selectCat.value = ""
    msgForm.innerHTML = ""
    divUploadPicture.style.display = "flex"
    previewImage.style.display = 'none';
    managementBtnForm()
}

const managementBtnForm = function (){
    if(titleSelected.value != "" && selectCat.value != "" && btnAddPicture.value != ""){
        btnValidateFormAddWork.disabled = false
    }else{
        btnValidateFormAddWork.disabled = true
    }
}

document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal)
})

window.addEventListener("keydown", function (e) {
    if(e.key === "Escape" || e.key === "Esc"){
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    }
})

titleSelected.addEventListener("input",function() {managementBtnForm()})
selectCat.addEventListener("change",function() {managementBtnForm()})

formAddWork.addEventListener("submit", async function(e){
    e.preventDefault()
    const body = new FormData();
    body.append("image", btnAddPicture.files[0])
    body.append("title", titleSelected.value)
    body.append("category", selectCat.value)
    const token = window.localStorage.getItem("token")
    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers:{ 
            'Authorization':`Bearer ${token}`
        },
         body:body
    });
    if(response.ok){
        await createGallery();
        await createMainGallery();
        resetForm();
        msgForm.innerHTML = "Image ajoutée avec succès"
    }else{
        msgForm.innerHTML = "Une erreur est survenue"
    }
})