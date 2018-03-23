const MAILCHIMP_URL = 'https://strelkainstitute.us1.list-manage.com/subscribe/post-json?u=267711a1297299a2b8d0992a6&amp;id=d685a30a47&c=?'
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let downtime = 0
let isShowingHint = false
let formInited = false

document.addEventListener('DOMContentLoaded', event => {
  init()
})

window.addEventListener('orientationchange', () => {
  init()
})


const showHint = () => {
  $('.hint').addClass('hint-visible')
  isShowingHint = true
}

const hideHint = () => {
  $('.hint').removeClass('hint-visible')
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
    inputs.attr('disabled', true)
    $.ajax({
        type        : 'GET',
        url         : MAILCHIMP_URL,
        data        : data,
        cache       : false,
        dataType    : 'json',
        contentType: "application/json; charset=utf-8",
        success     : (data) => {
          inputs.attr('disabled', false)
          if (data.result === "success") {
            $('.room-6-cont').hide()
            $('.already-subscribed').show()
            $('.already-subscribed').text('спасибо!')
            $('.orientation-warning').hide()
          } else {
            if (data.msg.indexOf('already subscribed') !== -1) {
              $('.error').text('вы уже подписаны')
              $('.error').show()
            } else {
              $('.email').addClass('email-with-error')
              $('.error').text('введите правильный адрес')
              $('.error').show()
            }
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
    .fromTo("#plan .room-6", 1, { y: "100%", opacity: 0 }, { y: "0%", opacity: 1, ease: Linear.easeNone }, 4.5)

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
  $('.email').removeClass('email-with-error')
  $('.error').hide()
  const value = e.target.value
  const isValid = validateEmail(value)
  $('.button').toggleClass('active-button', isValid)
}

const initForm = () => {
  if (!formInited) {
    console.log('init form!')
    const subscribeForm = document.querySelector('#mc-embedded-subscribe-form')
    subscribeForm.addEventListener('submit', handleSubmit)

    const emailInput = document.querySelector('.email')
    emailInput.addEventListener('input', handleEmailChange)

    formInited = true
  }
}

const isDesktop = () => {
  const width = (window.innerWidth > 0) ? window.innerWidth : screen.width
  return width > 450
}

const initDesktop = () => {
  console.log('init desk')
  const wipeAnimation = initScrollMagic()
  initHinting(wipeAnimation)
  showHint()
}

const init = () => {
  if (isDesktop()) {
    initDesktop()
  }
  initForm()
}
