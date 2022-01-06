
    // Functions to open and close a modal
    const openModal = (elem: Element) => {
      elem.classList.add('is-active');
    }
  
    const closeModal = (elem: Element) => {
      elem.classList.remove('is-active');
    }
  
    const closeAllModals = () => {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll<HTMLDivElement>('.modal-trigger') || []).forEach((trigger) => {
      const modalId = trigger.dataset.target;
  
      if(!modalId) {
        throw Error(`No target modal id for ${trigger}`)
      }
      const modalElem = document.getElementById(modalId);
  
      trigger.addEventListener('click', () => {
        modalElem !== null && openModal(modalElem);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-close-button') || []).forEach((elem) => {
      const modalElem = elem.closest('.modal');
  
      elem.addEventListener('click', () => {
        modalElem !== null && closeModal(modalElem);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      const e = event || window.event;
  
      if (e.keyCode === 27) { // Escape key
        closeAllModals();
      }
    });