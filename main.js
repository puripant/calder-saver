const mobile_radius = 500;

function fitElementToParent(el, padding) {
  let timeout = null;
  function resize() {
    if (timeout) clearTimeout(timeout);
    anime.set(el, {scale: 1});
    let pad = padding || 0;
    let parentEl = el.parentNode;
    let elOffsetWidth = el.offsetWidth - pad;
    let parentOffsetWidth = parentEl.offsetWidth;
    let ratio = parentOffsetWidth / elOffsetWidth;
    timeout = setTimeout(anime.set(el, {scale: ratio}), 10);
  }
  resize();
  window.addEventListener('resize', resize);
}

let layeredAnimation = (function() {
  let transformEls = document.querySelectorAll('.transform-progress');
  let layeredAnimationEl = document.querySelector('.layered-animations');
  let shapeEls = layeredAnimationEl.querySelectorAll('.shape');
  let triangleEl = layeredAnimationEl.querySelector('polygon');
  let trianglePoints = triangleEl.getAttribute('points').split(' ');
  let easings = ['easeInOutQuad', 'easeInOutCirc', 'easeInOutSine', 'spring'];

  fitElementToParent(layeredAnimationEl);

  function createKeyframes(value) {
    let keyframes = [];
    for (let i = 0; i < 30; i++) keyframes.push({ value: value });
    return keyframes;
  }
  function interpolateKeyframes(value) {
    let keyframes = [];
    for (let i = 0; i < 30; i++) keyframes.push({ value: value * i / 30 });
    return keyframes;
  }

  function animateShape(el) {
    let circleEl = el.querySelector('circle');
    let rectEl = el.querySelector('rect');
    let polyEl = el.querySelector('polygon');

    let mobileKeyframes = interpolateKeyframes(anime.random(-mobile_radius, mobile_radius));

    let animation = anime.timeline({
      targets: el,
      duration: () => anime.random(1000, 2000),
      easing: () => easings[anime.random(0, easings.length - 1)],
      complete: (anim) => animateShape(anim.animatables[0].target),
      // loop: true,
    })
    .add({
      translateX: mobileKeyframes,
      // translateX: createKeyframes(el => 
      //   el.classList.contains('large') ? anime.random(-300, 300) : anime.random(-520, 520)),
      // translateY: createKeyframes(el => 
      //   el.classList.contains('large') ? anime.random(-110, 110) : anime.random(-280, 280)),
      rotateY: createKeyframes(() => anime.random(-180, 180)),
    }, 0);

    // if (circleEl) {
    //   animation.add({
    //     targets: circleEl,
    //     r: createKeyframes(() => anime.random(32, 72)),
    //   }, 0);
    // }

    // if (rectEl) {
    //   animation.add({
    //     targets: rectEl,
    //     width: createKeyframes(() => anime.random(64, 120)),
    //     height: createKeyframes(() => anime.random(64, 120)),
    //   }, 0);
    // }

    if (polyEl) {
      animation.add({
        targets: polyEl,
        points: mobileKeyframes.map(k => 
          trianglePoints.map(p => p * Math.sqrt(mobile_radius*mobile_radius - k.value*k.value) / mobile_radius).join(' ')),
        // points: createKeyframes(() => {
        //   let scale = anime.random(72, 180) / 100;
        //   return trianglePoints.map(p => p * scale).join(' ');
        // }),
      }, 0);
    }

  }

  for (let i = 0; i < shapeEls.length; i++) {
    animateShape(shapeEls[i]);
  }

})();