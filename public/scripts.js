const IndexRedirectRecipeDetailsByClick = {

  redirectToDetails(recipeId) {

    window.location.href = `/details/${ recipeId }`
  }
}

const showAndHideDetails = {
  cathDetailsList (button) {
        
    const detailsBlock = button.parentNode.parentNode

    const detailsBlockChildrens = detailsBlock.children

    const detailsLiList =  Array.from(detailsBlockChildrens).find( children => { 
      return children.classList.contains("make")
    })

    detailsLiList.classList.toggle("none")

    showAndHideDetails.changeButtonContent(button)

  },

  changeButtonContent(button) {

    if (button.textContent == "ESCONDER") {
      
      button.textContent = "MOSTRAR" 
    } else {
      
      button.textContent = "ESCONDER"
    }
  }
}

const buttons = document.querySelectorAll('.hide')

buttons.forEach(button => 
  button.addEventListener("click", event => showAndHideDetails.cathDetailsList(event.target))
)

const activedMenuItem = {

  localPage: location.pathname.slice(1),
  menuItens:document.querySelectorAll("header a"),

  catchMenuItemToActive() {
    
    const localPage = activedMenuItem.localPage
    for (item of activedMenuItem.menuItens) {
      
      let itemLink = item.pathname.slice(1)
      
      if (itemLink == localPage) item.classList.add("home")
    }
  }
}


const photosUpload = {
  input: "",
  preview: document.querySelector('#recipe_photos_preview'),

  uploadLimit(target) {

    const inputId = target.id

    if (inputId == "recipe_upload_input") return 5

    return 1
  },

  files: [],

  handleFileInput (event) {

    const { files: filesList } = event.target

    photosUpload.input = event.target

    if (photosUpload.limitUploadValidation(event)) {

      photosUpload.updateInputFiles()
      return
    } 

    Array.from(filesList).forEach(file => {

      photosUpload.files.push(file)

      const reader = new FileReader()

      reader.onload = () => {
        
        const image = new Image()
        image.src = reader.result
        
        const container = photosUpload.createPhotoContainer(image)

        photosUpload.preview.appendChild(container)

      }

      reader.readAsDataURL(file)
    })

    photosUpload.updateInputFiles()

  },

  limitUploadValidation(event) {

    const { target } = event
    const uploadLimit = photosUpload.uploadLimit(target)

    if (target.files.length > uploadLimit || photosUpload.files.length + target.files.length > uploadLimit) {
      alert(`Selecione no máximo ${ uploadLimit } fotos!!`)

      event.preventDefault()
      return true
    }

    return false
  },

  createPhotoContainer(image) {

    const container = document.createElement("div")
    container.classList.add("photos")

    container.appendChild(image)

    const removePhotoButton = photosUpload.createRemoveButton()

    container.appendChild(removePhotoButton)


    return container

  },

  createRemoveButton() {

    const removeButton = document.createElement("i")
    removeButton.classList.add("material-icons")
    removeButton.innerHTML = "close"

    removeButton.onclick = photosUpload.removePhotoByClick

    return removeButton
  },

  getAllFiles() {
    
    const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

    photosUpload.files.forEach(file => { dataTransfer.items.add(file) })

    photosUpload.photosCounter()

    return dataTransfer.files
  },

  removePhotoByClick(event) {

    const photoContainer = event.target.parentNode
    const photosArray = Array.from(photosUpload.preview)
    const photoContainerIndex = photosArray.indexOf(photoContainer)

    photosUpload.files.splice(photoContainerIndex, 1)

    photosUpload.updateInputFiles()
    
    photoContainer.remove()
  },

  updateInputFiles () {
    photosUpload.input.files = photosUpload.getAllFiles()
  },

  photosCounter () {
    const totalPhotos = photosUpload.files.length
    const fieldImagesTitle = document.querySelector('.field_item #photos_counter')

    fieldImagesTitle.textContent = `Imagens da receita (${ totalPhotos })`
  }

}