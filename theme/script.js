// Définition de la partie
function Partie(limitePoints){
    this.scoreFinal = limitePoints;
    this.pauseActive = false;
    // Début de partie
    this.nouvellePartie = function(){
        if (typeof(balles) != 'undefined'){
            var i;
            for (i = 0; i < balles.length; i++){
                clearInterval(balles[i].interval);
            }
        }
        if (typeof(raquettes) != 'undefined'){
            var i;
            for (i = 0; i < raquettes.length; i++){
                clearInterval(raquettes[i].interval);
            }
        }
        joueurs = [];
        joueurs.push(new Joueur(
            100 // Taille raquette
            ));

        joueurs.push(new Joueur(
            100 // Taille raquette
            ));

            
        raquettes = [];
        raquettes.push(new Raquette(
            1, // Orientation
            joueurs[0].raquette, // Hauteur
            20, // xPosition 
            115, // Touche pour descendre
            119, // Touche pour monter
            "blue", // Couleur
            "#id0" // ID
            ));
        
        raquettes.push(new Raquette(
            -1, // Orientation
            joueurs[1].raquette, // Hauteur
            660, // xPosition 
            40, // Touche pour descendre
            38, // Touche pour monter
            "red", // Couleur
            "#id1" // ID
            ));
        if (typeof(balles) != 'undefined') {
            for (i = 0; i < balles.length; i++){
                balles[i].effacer();
            }
        }
        balles = [];
        
        
        setTimeout(function(){balles.push(new Balle(
            344, // xInitial
            219, // yInitial
            12, // Diametre
            5, // Vitesse
            0, // Direction
            "black", // Couleur
            "#balle1" // balleID
            ));},2000);
        $("#joueur0").text(joueurs[0].score)
        $("#joueur1").text(joueurs[1].score)
        
        // Changer le fonctionnement du bouton "nouvelle partie"
        $("#nouvellePartie").attr("onclick","window.location='./pong.html'").css('background-color','yellow');


    }
    
    
    // Pause
    this.pause = function(){
        this.pauseActive = true;
        if (typeof(balles) != 'undefined'){
            var i;
            for (i = 0; i < balles.length; i++){
                if (balles[i].activite == true)
                {
                    clearInterval(balles[i].interval);
                }
            }
        }
        if (typeof(raquettes) != 'undefined'){
            var i;
            for (i = 0; i < raquettes.length; i++){
                clearInterval(raquettes[i].interval);
            }
        }
        $("#pause").text("Continuer").addClass("yellow").attr("onclick","partie.continuer()");
    }

    // Continuer la partie aprés une pause
    this.continuer = function(){
        this.pauseActive = false;
        if (typeof(balles) != 'undefined'){
            var i;
            for (i = 0; i < balles.length; i++){
                if (balles[i].activite == true)
                {
                    balles[i].activation();
                }
            }
        }
        if (typeof(raquettes) != 'undefined'){
            var i;
            for (i = 0; i < raquettes.length; i++){
                raquettes[i].activation();
            }
        }
        $("#pause").text("Pause").attr("onclick","partie.pause()").attr("class","");
    }
    
    // Fin de partie
    this.fin = function(){
        $("body").css("background-color", "lightgrey");
        var temp = '<div id="messageFin"><h2>Partie terminée</h2>';
        if (joueurs.length > 1) {
            if (joueurs[0].score > joueurs[1].score){
                temp = temp + '<p>Le joueur de gauche a gagné !</p>';
            }
            else{
                temp = temp + '<p>Le joueur de droite a gagné !</p>';
            }
        }
        temp = temp + '<p><button type="button" onclick="partie.fermer()">Fermer</button></p></div>';
        $(temp).appendTo($("#airDeJeu"));
    }
    
    this.fermer = function(){
        $("body").css("background-color", "white");
        $("#messageFin").remove();
    }
}

// Définition de l'objet Joueur
function Joueur(tailleRaquette){
    this.raquette = tailleRaquette;
    this.score = 0;
}

// Définition de l'objet Raquette
function Raquette(rOrientation, hauteur, xPosition, tDescendre, tMonter, couleur, raquetteID){
    
    var oThis = this;
    this.orientation = rOrientation;
    this.x = xPosition;
    this.v = 0;
    this.l = 20;
    this.h = hauteur;
    this.y = 225 - Math.floor(this.h/2);
    this.toucheDescendre = tDescendre;
    this.toucheMonter = tMonter;
    this.id = raquetteID;
    this.couleur = couleur;
    var temp;
    temp = '<div class="raquette" id="' + this.id.substring(1, this.id.length) + '"></div>';
    $(temp).appendTo($("#airDeJeu"));
    this.jq = $(this.id); 
    this.jq.css("height", this.h + 'px');
    this.jq.css("width", this.l + 'px'); 
    this.jq.css("left", this.x + 'px');
    this.jq.css("top", this.y + 'px');
    this.jq.css("backgroundColor", this.couleur);
    this.activation = function(){
        // Lancement de la fonction à interval permettant le mouvement de la raquette
    
        this.interval = setInterval(function(){oThis.deplacer();}, 10);
    }
    this.activation();
    // Mouvement de la raquette vers le bas
    this.descendre = function (){
        if (this.v < 0) {
            this.v = -1;
        }
        this.v ++;
    }

    // Mouvement de la raquette vers le haut    
    this.monter = function (){
        if (this.v > 0) {
            this.v = 1;
        }
        this.v --;
    }    
    
    // Contrôleur du déplacement de la raquette
    this.deplacer = function(){
        this.y = this.y + this.v;
        if (this.y < 0){
            this.y = 0;
            this.v = 0;
        }
        if (this.y + this.h > 450){
            this.y = 450-this.h;
            this.v = 0;           
        }
        this.jq.css("top", this.y + 'px');
    }
}


// Définition de l'objet Balle
function Balle(xInitial, yInitial, diametre, vitesse, direction, couleur, balleID){
    var oThis = this;
    
    // Détermine de quelle côté va partir la balle au départ
    // Donne une direction au hasard s'il n'y en a pas de définie 
    this.attribuerDirection = function(direction){
        if (direction == 0) {
            var temp = Math.random();
            if (temp >= 0.5) {
                direction = 1;
            }
            else {
                direction = -1;
            }
        }
        return(direction);
    }
        
    this.attribuerVitesse = function(vitesse){
        vitesseXY = [];
        var temp = Math.random() * 2 - 1;
        vitesseXY[0] = Math.cos(temp) * vitesse * this.dir;
        vitesseXY[1] = Math.sin(temp) * vitesse;
        return(vitesseXY);
    }

    this.attribuerPosition = function(){
        if (this.dir == 1){
            this.x = raquettes[0].x + raquettes[0].l / 2 - this.d / 2;
            this.y = raquettes[0].y + raquettes[0].h / 2 - this.d / 2;
        }
        else{
            this.x = raquettes[1].x + raquettes[1].l / 2 - this.d / 2;
            this.y = raquettes[1].y + raquettes[1].h / 2 - this.d / 2;
        }
        
    }
    
    this.d = diametre;
    this.v = vitesse;
    this.couleur = couleur;
    this.id = balleID;
    this.activite = true;
    var temp;
    temp = '<div class="balle" id="' + this.id.slice(1) + '"></div>';
    $(temp).appendTo($("#airDeJeu"));
    this.dir = this.attribuerDirection(direction);
    this.attribuerPosition(); 
    this.vXY = this.attribuerVitesse(vitesse);
    this.jq = $(this.id);
    this.jq.css("left", this.x + 'px');
    this.jq.css("top", this.y + 'px'); 
    this.jq.css("height", this.d + 'px');
    this.jq.css("width", this.d + 'px');
    this.jq.css("border-radius", this.d/2 + 'px');
    this.jq.css("backgroundColor", this.couleur);
    
    // Fonction pour effacer la balle
    this.effacer = function(){
        oThis.jq.css("display","none");
        oThis.jq.remove();
    }

    
    // Après un point, création de la nouvelle balle
    this.nouvelleBalle = function(){
            if (partie.pauseActive){
                setTimeout(oThis.nouvelleBalle, 2000);
            }
            else{
                balles.push(new Balle(
                344, // xInitial
                219, // yInitial
                oThis.d, // Diametre
                oThis.v, // Vitesse
                oThis.dir, // Direction
                oThis.couleur, // Couleur
                "#balle" + (parseInt(oThis.id.slice(6)) + 1) // Balle ID
                ));
            }
        
    }
    
    // Gestion des rebonds contre les murs
    this.murs = function(){
        if (this.y < 0) {
            this.y = this.y * -1;
            this.vXY[1] = Math.abs(this.vXY[1]);
        }
        if (this.y + this.d > 450){
            this.y = 900 - 2*this.d - this.y;
            this.vXY[1] = Math.abs(this.vXY[1]) * -1;
        }
    }

    // Fonction vérifiant si la balle est à portée d'une raquette
    this.renvoi = function(){
        var i
        for (i = 0; i < raquettes.length; i++){
            if ((this.x + this.d > raquettes[i].x) && (this.x < raquettes[i].x + raquettes[i].l) &&
                (this.y + this.d > raquettes[i].y) && (this.y < raquettes[i].y + raquettes[i].h) &&
                (raquettes[i].orientation * this.vXY[0] < 0)){
                    var temp = ((this.y + this.d/2) - (raquettes[i].y + raquettes[i].h / 2)) / ((raquettes[i].h + this.d)/2)
                    
                    this.vXY[0] = Math.cos(temp) * this.v * raquettes[i].orientation;
                    this.vXY[1] = Math.sin(temp) * this.v;
                    
                }
        }
    }

    this.pointMarque = function(){
        if ((this.x < 0) || (this.x > 700 - this.d)){
            clearInterval(this.interval);
            this.activite = 0;
            setTimeout(oThis.effacer, 1000);
            
            if (this.x < 0){
                joueurs[1].score ++;
                oThis.dir = 1;
                $("#joueur1").text(joueurs[1].score);
            }
            else{
                joueurs[0].score ++;
                oThis.dir = -1;
                $("#joueur0").text(joueurs[0].score);
            }                      
            
            if ((parseInt(joueurs[0].score) >= partie.scoreFinal) || (parseInt(joueurs[1].score) >= partie.scoreFinal)){
                partie.fin();
            }
            else{
                setTimeout(oThis.nouvelleBalle, 2000);
            }

            
        }
    }
    
    this.deplacer = function(){
        this.x = this.x + this.vXY[0];
        this.y = this.y + this.vXY[1];
        oThis.murs();
        oThis.renvoi();
        oThis.pointMarque();
        this.jq.css("left", this.x + 'px');
        this.jq.css("top", this.y + 'px');
    }
    
    // Lancement de la fonction à interval permettant le mouvement de la balle
    this.activation = function(){     
        this.interval = setInterval(function(){oThis.deplacer();}, 8);
    }
    this.activation();
}

    /*-----------------------*/
    /* Création des éléments */
    /*-----------------------*/

function initialiser(){
    
    $("nav a").click(function(e){ e.preventDefault();});
    partie = new Partie(8);

    joueurs = [];
    joueurs.push(new Joueur(
        100 // Taille raquette
        ));

    joueurs.push(new Joueur(
        100 // Taille raquette
        ));

    raquettes = [];
    raquettes.push(new Raquette(
        1, // Orientation
        joueurs[0].raquette, // Hauteur
        20, // xPosition 
        115, // Touche pour descendre
        119, // Touche pour monter
        "blue", // Couleur
        "#id0" // ID
        ));
    
    raquettes.push(new Raquette(
        -1, // Orientation
        joueurs[1].raquette, // Hauteur
        660, // xPosition 
        40, // Touche pour descendre
        38, // Touche pour monter
        "red", // Couleur
        "#id1" // ID
        ));

    /*----------------------*/
    /* Contrôles au clavier */
    /*----------------------*/
    $(document).keypress(function(touche){
        var code = touche.keyCode || touche.which;
        var i;
        for (i = 0; i < raquettes.length; i++){
            if (code == raquettes[i].toucheMonter){
                raquettes[i].monter();
            }
            if (code == raquettes[i].toucheDescendre){
                raquettes[i].descendre();
            }
        }  
    });
}