// Javascript goes here
window.onload = (event) => {
    let toc = document.getElementsByClassName('table-of-contents');

    if(toc){
        let active = document.getElementsByClassName('active')[0];
        active.scrollIntoView({inline: "center", block: "center", behavior: "smooth"}); 
    }
  };