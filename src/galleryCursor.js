import $ from 'jquery'
import Bacon from 'baconjs'
import loadimage from './loadimage'

$.fn.asEventStream = Bacon.$.asEventStream

const cursor = (imageLeft, imageRight) => {
  let arrowRight = new Image()
  let arrowLeft = new Image()
  let mouse = $('<figure></figure>')

  loadimage(imageRight).then((img) => {
    arrowRight = img
  })

  loadimage(imageLeft).then((img) => {
    arrowLeft = img

    mouse = $('<figure></figure>')
    $('body').append(mouse)

    mouse.css({
      'cursor': 'none',
      'width': + img.naturalWidth + 'px',
      'height': + img.naturalHeight + 'px',
      'position': 'absolute',
      'margin-left': '-8px',
      'display': 'none',
    })
  })

  return {
    updateDirection: (direction) => {
      if (direction === "r") {
        mouse.css({
          'background-image': 'url(' + arrowLeft.src + ')',
        })
      } else {
        mouse.css({
          'background-image': 'url(' + arrowRight.src + ')',
        })
      }
    },
    updatePosition: (x, y) => {
      mouse.css({
        'left': x + 'px',
        'top': y + 'px',
      })
    },
    show: () => {
      mouse.show()
    },
    hide: () => {
      mouse.hide()
    }
  }
}

export function init(element, imgLeft, imgRight){
  const crs = cursor(imgLeft, imgRight)

  const leave = element.asEventStream('mouseleave')
  const enter = element.asEventStream('mouseenter')
  const positionStream = element.asEventStream('mousemove')
  const directionStream = element
    .asEventStream('mousemove')
    .map(x => getDirection(x.pageX, x.pageY, x.currentTarget.offsetWidth, x.currentTarget.offsetLeft))
    .skipDuplicates()

  hideSystemCursor(element)

  enter.onValue(() => {
    crs.show()
  })

  leave.onValue(() => {
    crs.hide()
  })

  directionStream.onValue((move) =>{
    crs.updateDirection(move)
  })

  positionStream.onValue((move) => {
    crs.updatePosition(move.pageX, move.pageY)
  })
}

function getDirection(x, y, w, offLeft){
  if (x - offLeft >= w / 2) {
    return 'l'
  } else {
    return 'r'
  }
}

function getMaxDimensions(images){
  const dimX = images.map((img) => {
    return img.naturalWidth
  })
  return dimX.reduce((prev, curr) => {
    return ( curr > prev ? curr : prev )
  }, 0)
}

function hideSystemCursor(element){
  element.css({
    'cursor': 'none',
  })
}
