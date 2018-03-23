const MAILCHIMP_URL = 'https://strelkainstitute.us1.list-manage.com/subscribe/post-json?u=267711a1297299a2b8d0992a6&amp;id=d685a30a47&c=?'
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const ALREADY_SUBSCRIBED_COOKIE = 'ALREADY_SUBSCRIBED_COOKIE'

let downtime = 0
let isShowingHint = false

document.addEventListener('DOMContentLoaded', event => {
  init()
})


const showHint = () => {
  const hint = document.querySelector('.hint')
  hint.classList.add('hint-visible')
  isShowingHint = true
}

const hideHint = () => {
  const hint = document.querySelector('.hint')
  hint.classList.remove('hint-visible')
  isShowingHint = false
}

const validateEmail = (email) => {
  return EMAIL_REGEX.test(String(email).toLowerCase());
}

const handleSubmit = (e) => {
  e.preventDefault()
  const form = $('#mc-embedded-subscribe-form')
  const data = form.serialize()
  const email = $('.email')[0].value
  if (validateEmail(email)) {
    const inputs = $('#mc-embedded-subscribe-form input')
    console.log('SEND!')
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
          if (data.result === "success") {
            console.log(data)
            console.log(Cookies)
            Cookies.set(ALREADY_SUBSCRIBED_COOKIE, 'true')
          } else {
            console.log(data)
          }
        }
    });
  }
}

const initScrollMagic = () => {
  const controller = new ScrollMagic.Controller()

  const wipeAnimation = new TimelineMax()
    .to("#plan .room-door-1", 0.5, { rotation: -90, ease: Linear.easeNone }, 0)
    .to("#plan .room-door-2", 0.5, { rotation: -90, x: "-1.5px", ease: Linear.easeNone }, 1)
    .fromTo("#plan .room-1", 2, { y: "0%" }, { y: "-66%", ease: Linear.easeNone }, 0.5)
    .to("#plan .room-1", 1, { x: "-100%", ease: Linear.easeNone }, 2.5)
    .fromTo("#plan .room-door-3", 0.5, { rotation: 90 },  { rotation: 0, x: "-1.5px", ease: Linear.easeNone }, 3)
    .to("#plan .room-1", 1, { y: "-100%", ease: Linear.easeNone }, 3.5)
    .fromTo("#plan .room-5", 1, { y: "100%" }, { y: "0%", ease: Linear.easeNone }, 3.5)
    .to("#plan .room-5", 1, { y: "-100%", ease: Linear.easeNone }, 4.5)
    .fromTo("#plan .room-6", 1, { y: "100%" }, { y: "0%", ease: Linear.easeNone }, 4.5)

  const scene = new ScrollMagic.Scene({
      triggerElement: "#plan",
      triggerHook: "onLeave",
      duration: "400%"
    })
    .setPin("#plan")
    .setTween(wipeAnimation)
    .addTo(controller)

  return wipeAnimation
}

const initHinting = (wipeAnimation) => {
  setInterval(() => {
    if (downtime > 3000 && !isShowingHint && wipeAnimation.progress() < 1) {
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

const handleEmailChange = (e) => {
  console.log(e)
  const value = e.target.value
  const isValid = validateEmail(value)
  console.log(value, isValid)
  if (isValid) {
    document.querySelector('.button').classList.add('active-button')
  } else {
    document.querySelector('.button').classList.remove('active-button')
  }
}

const initForm = () => {
  const isAlreadySubscribed = Cookies.get(ALREADY_SUBSCRIBED_COOKIE)
  console.log(isAlreadySubscribed)

  const subscribeForm = document.querySelector('#mc-embedded-subscribe-form')
  subscribeForm.addEventListener('submit', handleSubmit)

  const emailInput = document.querySelector('.email')
  emailInput.addEventListener('input', handleEmailChange)
}


const init = () => {
  const wipeAnimation = initScrollMagic()
  initHinting(wipeAnimation)
  initForm()
  showHint()
}
