export class NetflixTitleReader {
    constructor(titleChangeCB){
        this.titleChangeCB = titleChangeCB;
        this.readTitles();
        // Create listener on windowChange
        // let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        let observer = new window.MutationObserver((mutations, observer) => {
            for(let i in mutations){
                let mutation = mutations[i];
                if(mutation.type==="childList" && mutation.addedNodes.length>0){
                    this.readTitles();
                    break;
                }
            }
            // fired when a mutation occurs
            // ...
        });
        observer.observe(document, {
            subtree: true,
            attributes: false,
            childList: true
            //...
        });
    }
    readTitles(){
        this.titles = findAllTitles();
        this.titleChangeCB(this.titles);
    }
}

export class NetflixTitle{
    constructor(title, container){
        this.title = title;
        this.container = container;
    }
}

function findAllTitles(){
    let titles = [];
    findAllTitleCardContainers().forEach(function(titleCardContainer){
        titleCardContainer.find(".ptrack-content").each(function(){
            $(this).children().each(function(){
                let title = $(this).attr("aria-label");
                if(title !== undefined)
                {
                    let titleInfo = new NetflixTitle(title, titleCardContainer);
                    titles.push(titleInfo);
                }
            })
        })
    });
    return titles;
}

function findAllTitleCardContainers(){
    let titleCardContainer = [];
    $(".title-card-container").each(function(){titleCardContainer.push($(this))});
    return titleCardContainer
}

function findAllRows(){
    let rows = [];
    $(".lolomoRow_title_card").each(function(){rows.push($(this))});
    return rows
}
