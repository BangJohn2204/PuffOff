function nextSlide(current) {
  document.getElementById('slide-' + current).classList.remove('active');
  document.getElementById('slide-' + (current + 1)).classList.add('active');
}
