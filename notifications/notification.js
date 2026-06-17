const filterContainer =
document.getElementById(
  "filter-container"
);

if(filterContainer){

  setTimeout(()=>{

    filterContainer.scrollTo({
      left:80,
      behavior:"smooth"
    });

    setTimeout(()=>{

      filterContainer.scrollTo({
        left:0,
        behavior:"smooth"
      });

    },500);

  },800);

}
 
