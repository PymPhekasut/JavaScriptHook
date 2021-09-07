'use strict';

    const modal = document.querySelector('.modal');
    const overlay = document.querySelector('.overlay');
    const btnCloseModal = document.querySelector('.close-modal');
    const btnsOpenModal = document.querySelectorAll('.show-modal');

    const openModal = function() {
        console.log('Button clicked');
        modal.classList.remove('hidden'); //remove hidden when click
        overlay.classList.remove('hidden'); //adjust brightness of screeen when it pops
    }

    const closeModal = function() {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }
    for(let i = 0; i < btnsOpenModal.length; i++)
        btnsOpenModal[i].addEventListener('click', openModal);
 
    //close modal
    btnCloseModal.addEventListener('click', closeModal);
    //close modal when clock on overlay
    overlay.addEventListener('click', closeModal)

    document.addEventListener('keydown', function(event){
        console.log(event.key);

        if (event.key === 'Escape') {
            if(!modal.classList.contains('hidden')) {
                closeModal();
            }
        };
    });
    
