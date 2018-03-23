const MAILCHIMP_URL = 'https://strelkainstitute.us1.list-manage.com/subscribe/post-json?u=267711a1297299a2b8d0992a6&amp;id=d685a30a47&c=?'
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

let downtime = 0
let isShowingHint = false
let formInited = false
let mobileFormInited = false

document.addEventListener('DOMContentLoaded', event => {
  init()
})

window.addEventListener('orientationchange', () => {
  init()
  window.scrollTo(0, 0)
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
  const form = $('#plan #mc-embedded-subscribe-form')
  const data = form.serialize()
  const email = $('#plan .email')[0].value
  if (validateEmail(email)) {
    const inputs = $('#plan #mc-embedded-subscribe-form input')
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
            $('#plan .room-6-cont').hide()
            $('#plan .already-subscribed').show()
            $('#plan .already-subscribed').text('спасибо!')
            $('#plan .orientation-warning').hide()
          } else {
            if (data.msg.indexOf('already subscribed') !== -1) {
              $('#plan .error').text('вы уже подписаны')
              $('#plan .error').show()
            } else {
              $('#plan .email').addClass('email-with-error')
              $('#plan .error').text('введите правильный адрес')
              $('#plan .error').show()
            }
          }
        }
    });
  }
}


const handleMobileSubmit = (e) => {
  e.preventDefault()
  const form = $('.room-6-mob #mc-embedded-subscribe-form')
  const data = form.serialize()
  const email = $('.room-6-mob .email')[0].value
  if (validateEmail(email)) {
    const inputs = $('.room-6-mob #mc-embedded-subscribe-form input')
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
            $('.room-6-mob .room-6-cont').hide()
            $('.room-6-mob .already-subscribed').show()
            $('.room-6-mob .already-subscribed').text('спасибо!')
            $('.room-6-mob .orientation-warning').hide()
          } else {
            if (data.msg.indexOf('already subscribed') !== -1) {
              $('.room-6-mob .error').text('вы уже подписаны')
              $('.room-6-mob .error').show()
            } else {
              $('.room-6-mob .email').addClass('email-with-error')
              $('.room-6-mob .error').text('введите правильный адрес')
              $('.room-6-mob .error').show()
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
  $('#plan .email').removeClass('email-with-error')
  $('#plan .error').hide()
  const value = e.target.value
  const isValid = validateEmail(value)
  $('#plan .button').toggleClass('active-button', isValid)
}

const handleMobileEmailChange = (e) => {
  $('.room-6-mob .email').removeClass('email-with-error')
  $('.room-6-mob .error').hide()
  const value = e.target.value
  const isValid = validateEmail(value)
  $('.room-6-mob .button').toggleClass('active-button', isValid)
}

const initForm = () => {
  if (!formInited) {
    console.log('init form!')
    const subscribeForm = document.querySelector('#plan #mc-embedded-subscribe-form')
    subscribeForm.addEventListener('submit', handleSubmit)

    const emailInput = document.querySelector('#plan .email')
    emailInput.addEventListener('input', handleEmailChange)

    formInited = true
  }
}

const initMobileForm = () => {
  if (!mobileFormInited) {
    console.log('init mobile form!')
    const subscribeForm = document.querySelector('.room-6-mob #mc-embedded-subscribe-form')
    subscribeForm.addEventListener('submit', handleMobileSubmit)

    const emailInput = document.querySelector('.room-6-mob .email')
    emailInput.addEventListener('input', handleMobileEmailChange)

    mobileFormInited = true
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
    initForm()
  } else {
    initMobileForm()
  }
}
