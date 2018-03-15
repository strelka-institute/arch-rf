document.addEventListener('DOMContentLoaded', event => {
  init()
})

const init = () => {
  console.log('INIT!')
  // init
  var controller = new ScrollMagic.Controller();

  // define movement of panels
  var wipeAnimation = new TimelineMax()
    .to("section.panel.blue", 1, {y: "-100%", ease: Linear.easeNone}, 0)  // in from left
    .fromTo("section.panel.turqoise", 1, {y: "100%"}, {y: "0%", ease: Linear.easeNone}, 0)  // in from left
    .to("section.panel.turqoise", 1, {x: "-100%", ease: Linear.easeNone}, 1)  // in from left
    .fromTo("section.panel.green", 1, {x: "100%"}, {x: "0%", ease: Linear.easeNone}, 1)  // in from right
    .to("section.panel.green", 1, {y: "-100%", ease: Linear.easeNone}, 2)  // in from right
    .fromTo("section.panel.bordeaux", 1, {y: "100%"}, {y: "0%", ease: Linear.easeNone}, 2); // in from top

  // create scene to pin and link animation
  new ScrollMagic.Scene({
      triggerElement: "#pinContainer",
      triggerHook: "onLeave",
      duration: "300%"
    })
    .setPin("#pinContainer")
    .setTween(wipeAnimation)
    .addTo(controller);
}
