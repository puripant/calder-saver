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

function createKeyframes(value, interpolating) {
  let keyframes = [];
  for (let i = 0; i < 30; i++) keyframes.push({ value: (interpolating ? (i / 30)*value : value) });
  return keyframes;
}

function animateShape(el) {
  let mobile_keyframes = createKeyframes(anime.random(-mobile_radius, mobile_radius), true);

  let animation = anime.timeline({
    targets: el,
    duration: () => anime.random(3000, 5000),
    easing: () => 'easeInOutSine', //'easeInOutQuad', 'easeInOutCirc'
    complete: anim => animateShape(anim.animatables[0].target),
    // loop: true,
  })
  .add({
    translateX: mobile_keyframes,
    rotateY: createKeyframes(() => anime.random(-90, 90), false),
    scale: mobile_keyframes.map(k => 3 * Math.sqrt(mobile_radius*mobile_radius - k.value*k.value) / mobile_radius)
  }, 0);
}

function main() {
  let anim_el = document.querySelector('.layered-animations');

  fitElementToParent(anim_el);

  anim_el.querySelectorAll('.shape').forEach(shape => {
    animateShape(shape);
  });
}
main();