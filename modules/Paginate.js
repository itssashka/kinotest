export default class Paginate{
    constructor (paginationContainer, maxEllements=10,currentPage=1){
        this.maxEllements = maxEllements;
        this.paginationContainer = paginationContainer;
        this.currentPage = currentPage;
        this.dataContainer = this.paginationContainer.querySelector('.pagination-data');
        this.btnsContainer = this.paginationContainer.querySelector('.pagination-btns');
        this.paginationEllements = this.dataContainer.querySelectorAll('.pagination-ellement');
        this.pagesCount = Math.ceil(this.paginationEllements.length/this.maxEllements); 
        this.beforePages;
        this.afterPages;

        this.paginateBtns();
        this.buttonsOnClick();
        this.paginateContent();
    }

    paginateContent(){
        this.dataContainer.innerHTML = "";
        for(let i = this.maxEllements * (this.currentPage - 1); i < this.currentPage * this.maxEllements && i < this.paginationEllements.length; i++){
            this.dataContainer.appendChild(this.paginationEllements[i]);
        }
    }

    paginateBtns(){
        let ellements = ``;
        this.beforePages = this.currentPage - 1;
        this.afterPages = this.currentPage + 1;
        if(this.pagesCount < 2) return;

        if(this.currentPage > 1){
            ellements+=`
                <div class="pagination_btn-prev">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg_btnArrow">
                        <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                    </svg>
                </div>
            `
        }

        if(this.currentPage>2 && this.pagesCount > 4) {
            ellements+=`<div class="pagination_pageNum" data-pagenum="1">1</div>`
            if(this.currentPage>3) {
                ellements+=`<div class="pagination_dots">...</div>`
            }
        }

        this.btnsRange();

        for(let i = this.beforePages; i <= this.afterPages; i++){
            console.log(i);
            ellements+=`<div class="pagination_pageNum ${i === this.currentPage ? 'active' : ''}" data-pagenum="${i}">${i}</div>`
        }
        
        if(this.currentPage < this.pagesCount-1 && this.pagesCount > 4){
            if(this.currentPage<this.pagesCount-2){
                ellements+=`<div class="pagination_dots">...</div>`
            }
            ellements+=`<div class="pagination_pageNum" data-pagenum="${this.pagesCount}">${this.pagesCount}</div>`
        }

        if(this.currentPage < this.pagesCount){
            ellements+=`
                <div class="pagination_btn-next">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg_btnArrow">
                        <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"/>
                    </svg>
                </div> 
            `
        }

        this.btnsContainer.innerHTML = ellements;
    }

    btnsRange(){
        if(this.currentPage === this.pagesCount){
            if(this.pagesCount > 4) {
                this.afterPages = this.currentPage;
                this.beforePages = this.beforePages - 2;
            }else{
                this.afterPages = this.currentPage;
                this.beforePages = 1;
            }            
        }else if (this.currentPage === this.pagesCount - 1) {
            if(this.pagesCount > 4){
                this.beforePages = this.beforePages - 1;
            }else {
                this.afterPages = this.pagesCount;
                this.beforePages = 1;
            }            
        }

        if(this.currentPage === 1) {
            if(this.pagesCount > 4){
                this.beforePages = 1;
                this.afterPages = this.afterPages + 2;
            }else {
                this.beforePages = 1;
                this.afterPages = this.pagesCount;
            }
        }else if (this.currentPage === 2) {
            if(this.pagesCount > 4){
                this.afterPages = this.afterPages + 1;
            }else {
                this.beforePages = 1;
                this.afterPages = this.pagesCount;
            }            
        }
    }



    buttonsOnClick(){
        this.btnsContainer.addEventListener('click', e=>{
            if(e.target.closest('.pagination_pageNum')) {
                this.currentPage = +(e.target.closest('.pagination_pageNum').dataset.pagenum);
                console.log(this.currentPage);
                this.paginateBtns()
                this.paginateContent();
            }
            if(e.target.closest('.pagination_btn-next')) {
                this.currentPage++;
                this.paginateBtns()
                this.paginateContent();
            }
            if(e.target.closest('.pagination_btn-prev')) {
                this.currentPage--;
                this.paginateBtns()
                this.paginateContent();
            }
        })
    }
}

