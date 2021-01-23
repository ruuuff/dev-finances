const Modal = {
  open(event) {
    event.preventDefault()
    const modal = document.querySelector('.modal-overlay')
    modal.classList.add('active')
  },
  close(event) {
    event.preventDefault()
    const modal = document.querySelector('.modal-overlay')
    modal.classList.remove('active')
  }
}