var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyYONgnMSZoetwAi'
});
var base = Airtable.base('appFIEJmJlIEQ7q0E');
var template =
    '<div class="col-sm-4 item">' +
    '<img class="img-fluid" src="###lienImg###" width="200px" height="100px">' +
    '<h4 class="name"><strong>###titre###</strong></h4><span class="badge badge-success oct" style="background-color: rgb(###colorBadge###);">###mois###</span>' +
    '<p class="description">###synthesis###<br></p>' +
    '<button onclick="affiche(\'###recordId###\')" class="btn btn-primary la-suite" type="button" data-toggle="modal" data-target="#article" style="padding: 4px 10px;background-color: rgba(232,241,247,0.36);color: rgb(20,19,19);border: none;font-size: 14px;">Lire la suite</button></div>';

var templateModal =
    '<div class="container">' +
    '<div class="heading"><h2><strong>###titre###</strong></h2></div>' +
    '<div class="image mx-auto" style="width: 300px;"><img src="###lienImg###" width="300px"></div>' +
    '<div class="row">' +
    '<div class="col info">' +
    '<h3>Synthèse</h3>' +
    '<p class="overflow-visible" style="text-align: justify">###synthesis###<br><br></p>' +
    '<h3>Commentaires</h3>' +
    '<p style="text-align: justify">###Commentaire###<br><br></p>' +
    '<a class="btn btn-primary" href="###Links###" role="button">Lien</a>' +
    '<h6>###Date###</h6>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '<div class="modal-footer">' +
    '<button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button></div>';

//fonction qui recupere le record (l'article que je veux) avec le parametre record.id pour l'afficher
function affiche(monArticle) {
    console.log('monArticle', monArticle)
    base('Table 1').find(monArticle, function (err, record) {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Subject', record.get("Subject"));
        console.log('Synthesis', record.get("Synthesis"));

        var recordId = record.id;
        var synthesis = record.get("Synthesis");
        var title = record.get("Subject");
        var imgLink = record.get("Images");
        var mois = record.get("Mois");
        var date = record.get("Date");
        var commentaire = record.get("Commentaire");
        var links = record.get("Links");

        var newTemplate = templateModal.replace("###lienImg###", imgLink[0].url);
        newTemplate = newTemplate.replace("###recordId###", recordId);
        newTemplate = newTemplate.replace("###colorBadge###", colors[mois] - 1);
        newTemplate = newTemplate.replace("###mois###", mois);
        newTemplate = newTemplate.replace("###Date###", date);
        newTemplate = newTemplate.replace("###titre###", title);
        newTemplate = newTemplate.replace("###synthesis###", synthesis);
        newTemplate = newTemplate.replace("###Commentaire###", commentaire);
        newTemplate = newTemplate.replace("###Links###", links);


        $(".modal-content").html(newTemplate);
    });
}
var colors = ['123,181,139'];

function recupereVeille(mois_choisi) {
    $(".card").find(".row").html('');
    console.log('mois_choisi', mois_choisi);

    var options = {
        sort: [{
            field: "Date",
            direction: 'asc'
        }],
        //Tri record du plus recent en haut au moins recent en bas
        // Selection du nombre d'affichage dans la Grid view:
        maxRecords: 100,
        view: "Grid view"

    }

    // si une cellule est vide 
    if (mois_choisi != null)
        options.filterByFormula = 'Mois = "' + mois_choisi + '"';

    console.log('options', options);
    base('Table 1').select(options).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(function (record) {
            //ici on declare et on donne toutes tes actions à faire

            var recordId = record.id;
            var synthesis = record.get("Synthesis");
            var title = record.get("Subject");
            var imgLink = record.get("Images");
            var mois = record.get("Mois");

            var newTemplate = template.replace("###lienImg###", imgLink[0].url);
            newTemplate = newTemplate.replace("###recordId###", recordId);
            newTemplate = newTemplate.replace("###colorBadge###", colors[mois] - 1);
            newTemplate = newTemplate.replace("###mois###", mois);
            newTemplate = newTemplate.replace("###titre###", title);
            newTemplate = newTemplate.replace("###synthesis###", synthesis);

            $(".card").find(".row").prepend(newTemplate);
        });


        fetchNextPage();

    }, function done(err) {
        if (err) {
            console.error(err);
            return;
        }
    });

}
recupereVeille(null);
base('Table 1').find('recWPZC2pwUCiTaJ4', function (err, record) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Retrieved', record.id);
});

//Pagination
function pagination()
{
    var items = $(".projects .item"); // #list .items c'est l'endroit où tes cartes sont stocké dans le html
            var numItems = items.length; // ne change pas cela
            var perPage = 6; // c'est la variable qui gère le nombre d'item par page

            items.slice(perPage).hide();

            $('.pagination').pagination({ // .pagination-container c'est la div qui va contenir la pagination
                items: numItems,
                itemsOnPage: perPage,
                prevText: "&laquo;",
                nextText: "&raquo;",
                onPageClick: function (pageNumber) {
                    var showFrom = perPage * (pageNumber - 1);
                    var showTo = showFrom + perPage;
                    items.hide().slice(showFrom, showTo).show();
                }
            });
}


setTimeout(function()
{ 
    pagination();
}, 3000);