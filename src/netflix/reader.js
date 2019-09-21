export class NetflixTitleReader {
    static readTitles(){
        return findAllTitles();
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
                    titles.push(title);
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
