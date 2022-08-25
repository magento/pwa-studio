// Javascript goes here

// Use addEventListener to allow other scripts firing on window load
window.addEventListener('load', (event) => {
    let toc = document.getElementsByClassName('table-of-contents');

    if(toc){
        let active = document.getElementsByClassName('active')[0];
        
        if( active ) {
            active.scrollIntoView({inline: "center", block: "center", behavior: "smooth"}); 
        }
    }
});