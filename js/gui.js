/**
 * Módulo GUI para el juego buscaminas
 * @author Jesús Mejías Leiva
 */

{
//import { buscaMinas } from "./main.js";

let $container;
let $containerTablero;
let $timer;
let $time;

let init = function() {

  $("#elegirNivel").change(buscaMinasGUI.initJuego);
  $("#instrucciones").click(buscaMinasGUI.abrirInstrucciones);

  $container = $("#container");
  $containerTablero = $("#containerTablero");
  $timer = $("#timer");
  $time = $("time");

  $container.addClass("shadowMaterialButton");
};

let buscaMinasGUI = {
  flagRecord: false,

  /**
   * Inicia el juego GUI
   */
  initJuego() {
    buscaMinas.nivel = $(this).val();
    buscaMinas.init();
    this.disabled = true;
    buscaMinasGUI.generarTableroGui();
    buscaMinasGUI.crearDivRecord();
    buscaMinasGUI.crearDivNumBombas();
    buscaMinasGUI.crearDivNumBanderas();
    buscaMinasGUI.mostrarTiempoPartida();
    buscaMinasGUI.volverAjugar();
    buscaMinasGUI.cssAlEmpezar();
    buscaMinasGUI.disableContextMenu();
    //buscaMinasGUI.mostrarTableros();
  },
 //  /*
 //  * Muestra el tablero con las minas
 //  */
 //  mostrarTableros(){
 //    let buscaminas = function(){
 //      return {
 //        mostrar: () => buscaMinas.mostrar()
 //      }
 //    }();
 //
 //   window.buscaminas = buscaminas;
 // },
  abrirInstrucciones() {
    window.open("./instrucciones.html", "", "");
  },
  /**
   * Inserta el css necesario al comienzo del juego
   */
  cssAlEmpezar() {
    $container.css("width", "100%");
    $container.css("border-bottom", "2px solid #6A1B9A");

    $("#btnVolverAjugar").addClass("shadowMaterialButton");
    $("#timer").css("min-width", "80px");

    $containerTablero.addClass("shadowMaterial").css("min-width", "100%");
  },
  /**
   * Genera el tablero GUI
   */
  generarTableroGui() {
    $containerTablero.css({
      "display": "grid",
      "grid-template-columns": "repeat(" + buscaMinas.columnas + ", 1fr)"
    });

    let $fragment = $(document.createDocumentFragment());


    for (let i = 0; i < buscaMinas.filas; i++) {
      for (let j = 0; j < buscaMinas.columnas; j++) {
        let $input = $(`<input type='text' id='${i}-${j}' readOnly></input>`);

        buscaMinasGUI.claseSegunNivel("violet", $input);

        $input.click(function(ev) {
          buscaMinasGUI.picarGui($(this));
        });

        let longpress = 1200; // tiempo para detectar la pulsación larga
        let start; // hora de comienzo

          $input.mousedown(function(ev) {
            //calculamos la hora exacta de cuando pulsamos el touchpad
            start = new Date().getTime();

            switch (ev.buttons) {
              case 2:
                  buscaMinasGUI.marcarGui($(this));
                break;
              case 3:
                  buscaMinasGUI.despejarGui($(this));
                break;
              default:

            }

          });

          // función para detectar la pulsación larga
          (function() {
              $input.mouseleave(function(event) {
                start = 0; // cuando perdemos el foco del ratón asigaamos a 0
              });

              $input.mouseup(function(event) {
                if (new Date().getTime() >= ( start + longpress )){
                    buscaMinasGUI.despejarGui($(this));
                }
              });
          }());


        $fragment.append($input)

      }
    }

    $containerTablero.append($fragment);
  },
  /*
  * Añade animaciones al input pasado por parámetro.
  * @param input elemento DOM.
  * @param classs clase css que contiene la animación.
  * @param animationViolet animación que se le añadirá a los input violet.
  * @param animationOthers animación que se le añadirá a los input que no sean violet.
  * @param nivel nivel actual de la partida.
  */
  animationInput(input,classs, nivel, effect,delay){

    if (classs === "violet"){
      buscaMinasGUI.limpiarClasesCss(input)
      input.addClass('animated ' + 'zoomIn ' + 'faster ' + nivel + ' ' + classs );
    }else{
      buscaMinasGUI.limpiarClasesCss(input)
      input.addClass(nivel + ' ' + classs );
      input.effect(effect, delay);
    }
  },
  /**
   * Clases según el nivel
   * @param classs clase que se le añadirá al input
   * @param input elemento al cuál se le añadirá la clase
   */
  claseSegunNivel(classs, input, delay = 400, effect = "fade") {

    switch (buscaMinas.nivel) {
      case "facil":
          buscaMinasGUI.animationInput(input,classs, " inputFacil", effect, delay)
        break;
      case "test":
          buscaMinasGUI.animationInput(input,classs, " inputTest", effect, delay)
        break;
      case "intermedio":
          buscaMinasGUI.animationInput(input,classs, " inputIntermedio", effect, delay)
        break;
      case "experto":
            buscaMinasGUI.animationInput(input,classs, " inputExperto", effect, delay)
        break;

      default:
        break;
    }
  },
  /**
   * Despeja las casilla colindantes si el numero de banderas coincide con el valor de la casilla
   * @param element elemento DOM
   */
  despejarGui(element) {
    let coordenada = buscaMinasGUI.extraerCoordenada(element);
    try {
        buscaMinas.despejar(coordenada.fila, coordenada.columna);
        if (!buscaMinas.juegoNoFinalizado()){
          return;
        }
          buscaMinasGUI.actualizarGui();
          if (buscaMinas.seleccionaContiguas.size > 0){
            for (let casilla of buscaMinas.seleccionaContiguas) {
              $("#"  + casilla).effect("highlight",{ color : "#B39DDB" } , "slow");
            }
          }
    } catch (e) {
      buscaMinasGUI.controlException(e, element);
    }
  },
  /*
  * Actualiza el número de banderas en el contador
  */
  actualizaNumBanderas(){
      if ($("#pNumBanderas")){
         $("#pNumBanderas").text(`${buscaMinas.numBanderas}`)
      }
  },
  /**
   * Actualiza la GUI con los valores del tablero visible interno
   */
  actualizarGui() {

      buscaMinasGUI.actualizaNumBanderas();


      if (buscaMinas.flagGanado){
         $("input").each(function(index, el) {
           if ($(el).hasClass("violet")){
             buscaMinasGUI.claseSegunNivel("blanco", $(el))
           }
         });
      }
      let contDelay = 400;
      for (const item of buscaMinas.aperturaCasillas) {
        let fila = item.split("-")[0];
        let columna = item.split("-")[1];

        let $element = $("#" + fila +"-"+ columna)

              if (
                buscaMinas.tableroVisible[fila][columna] !== "!" &&
                buscaMinas.tableroVisible[fila][columna] !== "#"
              ) {
                if (buscaMinas.tableroVisible[fila][columna] === 0) {
                  $element.val("");
                }else{
                   $element.val(buscaMinas.tableroVisible[fila][columna]);
                 };

                 buscaMinasGUI.claseSegunNivel(
                   "blanco",
                   $element,
                   contDelay
                 );

                 if (contDelay === 400){
                   buscaMinasGUI.reproducirAudio("abrir.mp3");
                 }
              }
              contDelay += 80;
      }

      buscaMinas.aperturaCasillas.clear(); // vacío la collection con las coordenadas
   },

   /*
   * Extrae la coordenada de la casilla pasada por parámetro y devuelve un objeto con las coordenadas.
   * @param element casilla del DOM.
   */
   extraerCoordenada(element){
     return {
       fila: parseInt(element.prop("id").split("-")[0]),
       columna: parseInt(element.prop("id").split("-")[1])
     }
   },
  /**
   * Realiza la accion de picar y actualiza la GUI
   * @param element elemento DOM
   */
  picarGui(element) {

    let coordenada = buscaMinasGUI.extraerCoordenada(element);

      try {
          buscaMinas.picar(coordenada.fila, coordenada.columna);
          if (buscaMinas.juegoNoFinalizado()){
              buscaMinasGUI.actualizarGui();
          }
      } catch (e) {
        buscaMinasGUI.controlException(e,element);
      }

  },
  /*
  * Control de manejo de mensajes al ganar y perder.
  * @param e exception
  */
  controlException(e, element){
    buscaMinasGUI.descubrirMinas();
    if (e.message === messagesBuscaminas.msgGanarPartida) {
      buscaMinasGUI.actualizarGui();
      buscaMinasGUI.comprobarRecord();
      setTimeout(function(){
        buscaMinasGUI.swalVolverAJugar(e.message, "success");
      }, 4000);
    } else {
      buscaMinasGUI.reproducirAudio("explosion.mp3");
      buscaMinasGUI.animacionAbrirMinasNivel(e.message);
    }
  },
  /**
   * Realiza la accion de picar y actualiza la GUI
   * @param i coordenada para la fila
   * @param j coordenada para la columna
   */
  marcarGui(element) {
    let coordenada = buscaMinasGUI.extraerCoordenada(element);
        buscaMinas.marcar(coordenada.fila, coordenada.columna);
        if (!buscaMinas.juegoNoFinalizado()){
          return;
        }
        if (buscaMinas.tableroVisible[coordenada.fila][coordenada.columna] === "!" ){
          buscaMinasGUI.reproducirAudio("flag.mp3");
          buscaMinasGUI.claseSegunNivel(
            "amarillo",
            element
          )
        }else if (buscaMinas.tableroPulsaciones[coordenada.fila][coordenada.columna] !== "p"){
              buscaMinasGUI.claseSegunNivel(
                "violet",
                element
              )
        }
        // actualizo el numero de banderas
        buscaMinasGUI.actualizaNumBanderas();
  },
  /**
   * Carga la librería sweetalert para preguntar si desea jugar de nuevo
   * @param msg mensaje a mostra
   * @param icon icono que mostrará la ventana
   */
  swalVolverAJugar(msg, icon) {

    let tiempoPartida = parseInt($("#timer #time").text());
    let recordNivel = buscaMinasGUI.obtenerRecordActualNivel();

    let message = "";
    let title = msg;

    if (icon === "success") {
      buscaMinasGUI.reproducirAudio("win.mp3");
      message = `Tu tiempo en esta partida a sido ${tiempoPartida} segundo/s. \n \n El record actual es de ${recordNivel} segundo/s.\n \n`;
    }else if (icon === "error"){
      buscaMinasGUI.reproducirAudio("lost.mp3");
    }
    if (
      icon === "success" &&
      (recordNivel === 0 || tiempoPartida < recordNivel)
    ) {
      title = `${msg} \n además has establecido el record de este nivel en ${tiempoPartida} segundo/s. \n\n`;
    }

    swal({
      className: "buttons-Swal",
      title: title,
      text: message + "¿Desea jugar de nuevo?",
      icon: icon,
      buttons: {
        Sí: true,
        No: true
      }
    }).then(result => {
      if (result === "Sí") {
        $("#elegirNivel").val("");
        location.reload();
      }
    });
  },
  /*
  * Obtiene el record actual del nivel actual.
  */
  obtenerRecordActualNivel() {
    if (localStorage.getItem(buscaMinas.nivel) !== null) {
      return parseInt(localStorage.getItem(buscaMinas.nivel));
    } else {
      return 0;
    }
  },
  /*
  * Abre el modal, según el nivel asignará un delay para abrirlo dado que el numero de minas por abrir cambian con el nivel.
  */
  animacionAbrirMinasNivel(message){
    switch (buscaMinas.nivel) {
      case "facil":
      case "test":
          setTimeout(function(){
            buscaMinasGUI.swalVolverAJugar(message, "error");
          }, 4000);
        break;
      case "intermedio":
            setTimeout(function(){
              buscaMinasGUI.swalVolverAJugar(message, "error");
            }, 7000);
        break;
      case "experto":
            setTimeout(function(){
              buscaMinasGUI.swalVolverAJugar(message, "error");
            }, 11000);
        break;
      default:
        return;
    }

  },
  /**
   * Descubre las minas
   */
  descubrirMinas() {
    buscaMinasGUI.eliminarBanderasGui();
    let contDelay = 400;
    let $inputs = $("input");

    for (let mina of buscaMinas.apeturaMinas) {

      if (buscaMinas.flagGanado){
        $("#" + mina).animate({
          color: "#43A047",
          backgroundColor: "#43A047"
        },contDelay);
      }else{
        $("#" + mina).animate({
          color: "#EC407A",
          backgroundColor: "#EC407A"
        },contDelay);
      }



      contDelay += 80;
    }
  },
  eliminarBanderasGui(){
    buscaMinas.eliminarBanderas();
    for (const coordenada of buscaMinas.coordenadasBanderas) {
      let $input = $("#"+ coordenada);

      if ($input.hasClass("amarillo")){
        $input.switchClass("violet", "amarillo");
      }

    }
  },
  /**
   * Crea un boton para volver a jugar
   */
  volverAjugar() {
    let $btnVolverAjugar = $("<button id='btnVolverAjugar'>Volver a jugar</button>");
    $("#tools").append($btnVolverAjugar);

    $("#btnVolverAjugar").click(()=> {
      // reseteamos el select
      $("#elegirNivel").val("");
      location.reload();
    });
  },
  /**
   * Limpia las clases del elemento pasado por parametro
   * @param element elemento del DOM
   */
  limpiarClasesCss(element) {
    if (element) {
      if (
        element.prop("class") !== ""
      ) {
        element.prop("class", "");
      }
    }
  },
  /**
   * Crear div numero de bombas
   */
  crearDivNumBombas() {
    let $div = $("<div></div>");
    $div.prop("id","numBombas" );
    $div.html(`<img src="images/bomb.svg"/> ${buscaMinas.numMinas}`);
    $container.append($div);
  },
  /**
   * Crear div numero de bombas
   */
  crearDivNumBanderas() {
    let $div = $("<div></div>");
    $div.prop("id","numBanderas" );
    $div.html(`<img src="images/flag.svg" height="30px"/><p id="pNumBanderas">${
      buscaMinas.numBanderas
    }</p>`);
    $container.append($div);
  },
  /**
   * Crear div para el timer
   */
  crearDivTimer() {
    $timer.html(`<img src="images/hourglass.svg" /><p id="time"></p>`);
    $time = $("#time");
  },
  /**
   * Crea los divs para el record y el tiempo
   */
  crearDivRecord() {
    buscaMinasGUI.crearDivTimer();
    if ($("#record")) {
      $("#record").remove();
    }
    let $container = $("#container");
    let $div = $("<div></div>");
    $div.prop("id", "record");

    if (localStorage.getItem(buscaMinas.nivel) !== null) {
      $div.html(`<img src="images/record.svg" height="30px"/> ${localStorage.getItem(
        buscaMinas.nivel
      )}`);
    } else {
      $div.html(`<img src="images/record.svg" height="30px"/> 0`);
    }

    $container.append($div);
  },
  /**
   * Comprueba el record y lo actualiza
   */
  comprobarRecord() {
    let tiempo = parseInt($("#timer p").text());

    if (localStorage.getItem(buscaMinas.nivel) === null || localStorage.getItem(buscaMinas.nivel) > tiempo ) {
      localStorage.setItem(buscaMinas.nivel, tiempo);
    } else {
      if (
        localStorage.getItem(buscaMinas.nivel) === 0 ||
        localStorage.getItem(buscaMinas.nivel) > tiempo
      ) {
      }
    }
  },

  /**
   * Muestra el tiempo de partida
   */
  mostrarTiempoPartida() {
    let seconds = 0;

    let interv = setInterval(() => {
      if (buscaMinas.juegoNoFinalizado()) {
        seconds++;
        $("#time").text(seconds);
      } else {
        clearInterval(interv);
        if (buscaMinas.flagGanado) {
          buscaMinasGUI.comprobarRecord();
        }
      }
    }, 1000);
  },
  disableContextMenu() {
    if ($(document).on()) {
      $(document).contextmenu(function(e) {
        e.preventDefault();
      },
      false);
    } else {
      $(document).attachEvent("oncontextmenu", function() {
        $(window).event.returnValue = false;
      });
    }
  },
  reproducirAudio(file){
    let $reproducir = new Audio();
    $reproducir.src = "./sounds/" + file;
    $reproducir.play();
  }

};

$(init);
}
