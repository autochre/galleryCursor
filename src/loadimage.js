function loadimage(url){
  return new Promise((resolve, reject) => {
    let image = new Image()

    image.onload = function(){
      resolve(image)
    }

    image.onError = function(){
      let message = 'could not load image'
      reject(new Error(msg))
    }
    image.src = url
  })
}

export default loadimage
