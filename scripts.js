const MAILCHIMP_URL = 'https://strelkainstitute.us1.list-manage.com/subscribe/post-json?u=267711a1297299a2b8d0992a6&amp;id=d685a30a47&c=?'
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const ALREADY_SUBSCRIBED_COOKIE = 'ALREADY_SUBSCRIBED_COOKIE'

let downtime = 0
let isShowingHint = false

document.addEventListener('DOMContentLoaded', event => {
  init()
})


const showHint = () => {
  const hint = document.createElement('div')
  hint.classList.add('hint')
  document.querySelector('body').appendChild(hint)
  isShowingHint = true
}

const hideHint = () => {
  const hint = document.querySelector('.hint')
  document.querySelector('body').removeChild(hint)
  isShowingHint = false
}

const validateEmail = (email) => {
  return EMAIL_REGEX.test(String(email).toLowerCase());
}

const handleSubmit = (e) => {
  e.preventDefault()
  const form = $('#mc-embedded-subscribe-form')
  const data = form.serialize()
  const email = $('#mce-EMAIL').value
  const inputs = $('#mc-embedded-subscribe-form input')
  inputs.attr('disabled', true)
  $.ajax({
      type        : 'GET',
      url         : MAILCHIMP_URL,
      data        : data,
      cache       : false,
      dataType    : 'json',
      contentType: "application/json; charset=utf-8",
      error       : function(err) { console.log('ERR:', err) },
      success     : function(data) {
        inputs.attr('disabled', false)
        if (data.result !== "success") {

        } else {
        }
      }
  });
}

const initScrollMagic = () => {
  const controller = new ScrollMagic.Controller()

  const wipeAnimation = new TimelineMax()
    .to("#plan .room-door-1", 0.5, { rotation: -90, ease: Linear.easeNone }, 0)
    .to("#plan .room-door-2", 0.5, { rotation: -90, ease: Linear.easeNone }, 1)
    .fromTo("#plan .room-1", 2, { y: "0%" }, { y: "-66%", ease: Linear.easeNone }, 0.5)
    .to("#plan .room-1", 1, { x: "-100%", ease: Linear.easeNone }, 2.5)
    .fromTo("#plan .room-3", 1, { x: "100%" }, { x: "0%", ease: Linear.easeNone }, 2.5)
    .to("#plan .room-3", 1, { y: "-100%", ease: Linear.easeNone }, 3.5)
    .fromTo("#plan .room-4", 1, { y: "100%" }, { y: "0%", ease: Linear.easeNone }, 3.5)

  const scene = new ScrollMagic.Scene({
      triggerElement: "#plan",
      triggerHook: "onLeave",
      duration: "350%"
    })
    .setPin("#plan")
    .setTween(wipeAnimation)
    .addTo(controller)

  return wipeAnimation
}

const initHinting = (wipeAnimation) => {
  setInterval(() => {
    if (downtime > 5000 && !isShowingHint && wipeAnimation.progress() < 1) {
      showHint()
      downtime = 0
    } else {
      downtime += 5
    }
  }, 5)

  window.addEventListener('scroll', () => {
    downtime = 0
    if (isShowingHint) {
      hideHint()
    }
  })
}

const initForm = () => {
  const subscribeForm = document.querySelector('#mc-embedded-subscribe-form')
  subscribeForm.addEventListener('submit', handleSubmit)
}

const init = () => {
  const wipeAnimation = initScrollMagic()
  initHinting(wipeAnimation)
  initForm()
}
