/**
 * buscaminasFuncionalidad consola
 * @author Jesús Mejías Leiva
 */
{
const msgGanarPartida = "Has ganado la partida";
const msgCoordenadasInvalidas = "Coordenadas no válidas";
const msgPerderPartida= "Has perdido, pulsaste una mina";

let buscaminasFuncionalidad = {
  tableroMaster: [],
  tableroCopiaMaster: [],
  tableroVisible: [],
  tableroPulsaciones: [],
  filas: 0,
  columnas: 0,
  numMinas: 0,
  nivel: "",
  flagGanado: false,
  flagPerdido: false,
  flagRecord: false,
  numBanderas: 0,
  aperturaCasillas: new Set(),
  apeturaMinas: new Set(),
  coordenadasBanderas: new Set(),
  seleccionaContiguas: new Set(),

  /**
   * Genera la funcionalidad
   */
  init() {
    buscaminasFuncionalidad.finPartida = false;
    buscaminasFuncionalidad.flagPerdido = false;
    buscaminasFuncionalidad.elegirNivel();
    buscaminasFuncionalidad.generarTableros();
    buscaminasFuncionalidad.generaMinas();
    buscaminasFuncionalidad.numerosAlrededorMinas();
  },
  /**
   * Muestra los tableros al inicio
   */
  mostrar() {
    console.log("Tablero master \n");
    console.table(buscaminasFuncionalidad.tableroMaster);
    // console.log("Tablero visible \n");
    // console.table(buscaminasFuncionalidad.tableroVisible);
  },

  /**
   * Marca y desmarca una casilla con una bandera
   * @param x cordenada para la fila
   * @param y coordenada para la columna
   */
  marcar(x, y) {
    if (x > buscaminasFuncionalidad.filas || y > buscaminasFuncionalidad.columnas){
      throw new Error(msgCoordenadasInvalidas);
    }
    if (!buscaminasFuncionalidad.juegoNoFinalizado() || buscaminasFuncionalidad.tableroPulsaciones[x][y] === "p") {
      return;
    }
      if (
        buscaminasFuncionalidad.tableroPulsaciones[x][y] !== "p" &&
        buscaminasFuncionalidad.tableroVisible[x][y] !== "!" && !buscaminasFuncionalidad.flagPerdido
      ) {
        if (buscaminasFuncionalidad.numBanderas > 0) {
          buscaminasFuncionalidad.tableroVisible[x][y] = "!";
          buscaminasFuncionalidad.numBanderas--;
          // console.clear();
          // console.table(buscaminasFuncionalidad.tableroMaster);
          //console.table(buscaminasFuncionalidad.tableroVisible);
        }
      } else if (
        buscaminasFuncionalidad.tableroPulsaciones[x][y] !== "p" &&
        buscaminasFuncionalidad.tableroVisible[x][y] === "!"
      ) {
        buscaminasFuncionalidad.tableroVisible[x][y] = "#";
        buscaminasFuncionalidad.numBanderas++;
        // console.clear();
        // console.table(buscaminasFuncionalidad.tableroMaster);
        // console.table(buscaminasFuncionalidad.tableroVisible);
        // console.log(buscaminasFuncionalidad.numBanderas);
      }
      buscaminasFuncionalidad.comprobarGanadorBanderas();
  },
  /*
  * Guarda banderas en collection set para después eliminarlas deL tablero.
  */
  eliminarBanderas(){
    for (let i = 0; i < buscaminasFuncionalidad.filas; i++) {
      for (let j = 0; j < buscaminasFuncionalidad.columnas; j++) {
        if (buscaminasFuncionalidad.tableroVisible[i][j] === "!"){
          buscaminasFuncionalidad.coordenadasBanderas.add(i +"-"+j);
        }
      }
    }
  },
    /**
     * intenta destapar las casillas colindantes, sólo si el número de banderas
     * se corresponden con las que indica la casilla. Entonces muestra el campo
     * de minas actualizado.
     * En caso de estar las banderas equivocadas se indica que se ha perdido el
     * juego.
     */
    despejar(x,y){

      if (!buscaminasFuncionalidad.juegoNoFinalizado()) {
        return;
      }

      buscaminasFuncionalidad.seleccionaContiguas.clear();

      if (x > buscaminasFuncionalidad.filas || y > buscaminasFuncionalidad.columnas){
        throw new Error(msgCoordenadasInvalidas);
      }

      if (buscaminasFuncionalidad.obtenerBanderasColindantes(x,y) === buscaminasFuncionalidad.tableroMaster[x][y]){

        if ((x > 0 && y > 0) && (buscaminasFuncionalidad.tableroVisible[x - 1][ y - 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x - 1][y - 1] !== "p")){
            buscaminasFuncionalidad.picar(x-1,y-1);
        }

        if ( (y > 0) && (buscaminasFuncionalidad.tableroVisible[x][y - 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x][y-1] !== "p")){
            buscaminasFuncionalidad.picar(x,y-1);
        }

        if ((y > 0 && x < buscaminasFuncionalidad.filas - 1) && (buscaminasFuncionalidad.tableroVisible[x + 1][y - 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x+1][y-1] !== "p") ){
            buscaminasFuncionalidad.picar(x+1,y-1);
        }

        if ((x > 0) && (buscaminasFuncionalidad.tableroVisible[x - 1][y] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x-1][y] !== "p")){
            buscaminasFuncionalidad.picar(x-1,y);
        }

        if ((x < buscaminasFuncionalidad.filas - 1) && (buscaminasFuncionalidad.tableroVisible[x + 1][y] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x+1][y] !== "p")){
            buscaminasFuncionalidad.picar(x+1,y);
        }

        if ((y < buscaminasFuncionalidad.columnas - 1) && (buscaminasFuncionalidad.tableroVisible[x][y + 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x][y+1] !== "p")){
            buscaminasFuncionalidad.picar(x,y+1);
        }

        if ((x < buscaminasFuncionalidad.filas - 1  && y < buscaminasFuncionalidad.columnas - 1) && (buscaminasFuncionalidad.tableroVisible[x + 1][y + 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x+1][y+1] !== "p")){
            buscaminasFuncionalidad.picar(x+1,y+1);
        }

        if ((x > 0  && y < buscaminasFuncionalidad.columnas - 1) && (buscaminasFuncionalidad.tableroVisible[x - 1][y + 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x-1][y+1] !== "p")){
            buscaminasFuncionalidad.picar(x-1,y+1);
        }

      }else{

        buscaminasFuncionalidad.seleccionaContiguas.clear();

        if ((x > 0 && y > 0) && (buscaminasFuncionalidad.tableroVisible[x - 1][ y - 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x - 1][y - 1] !== "p")){
            buscaminasFuncionalidad.seleccionaContiguas.add((x-1) + "-" + (y-1));
        }

        if ((y > 0) && (buscaminasFuncionalidad.tableroVisible[x][y - 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x][y-1] !== "p")){
            buscaminasFuncionalidad.seleccionaContiguas.add((x) + "-" + (y-1));
        }

        if ((y > 0 && x < buscaminasFuncionalidad.filas - 1) && (buscaminasFuncionalidad.tableroVisible[x + 1][y - 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x+1][y-1] !== "p")){
            buscaminasFuncionalidad.seleccionaContiguas.add((x+1) + "-" + (y-1));
        }

        if ((x > 0) && (buscaminasFuncionalidad.tableroVisible[x - 1][y] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x-1][y] !== "p")){
            buscaminasFuncionalidad.seleccionaContiguas.add((x-1) + "-" + (y));
        }

        if ((x < buscaminasFuncionalidad.filas - 1) && (buscaminasFuncionalidad.tableroVisible[x + 1][y] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x+1][y] !== "p") ){
            buscaminasFuncionalidad.seleccionaContiguas.add((x+1) + "-" + (y));
        }

        if ((y < buscaminasFuncionalidad.columnas - 1) && (buscaminasFuncionalidad.tableroVisible[x][y + 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x][y+1] !== "p")){
            buscaminasFuncionalidad.seleccionaContiguas.add((x) + "-" + (y+1));
        }

        if ((x < buscaminasFuncionalidad.filas - 1  && y < buscaminasFuncionalidad.columnas - 1) && (buscaminasFuncionalidad.tableroVisible[x + 1][y + 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x+1][y+1] !== "p")){
            buscaminasFuncionalidad.seleccionaContiguas.add((x+1) + "-" + (y+1));
        }

        if ((x > 0  && y < buscaminasFuncionalidad.columnas - 1) && (buscaminasFuncionalidad.tableroVisible[x - 1][y + 1] !== "!" && buscaminasFuncionalidad.tableroPulsaciones[x-1][y+1] !== "p")){
            buscaminasFuncionalidad.seleccionaContiguas.add((x-1) + "-" + (y+1));
        }
      }
    },
    /**
     * Obtiene el numero de banderas de las casillas colindantes, de la casilla pasada por parámetros
     * @param x coordenada de la fila
     * @param y coordenada de la columna
     */
    obtenerBanderasColindantes(x,y){
      let banderas = 0;
      if (buscaminasFuncionalidad.tableroPulsaciones[x][y] === "p"){
        if (x > 0 && y > 0){
          if (buscaminasFuncionalidad.tableroVisible[x - 1][ y - 1] === "!"){
            banderas++;
          }
        }

        if ( y > 0){
          if (buscaminasFuncionalidad.tableroVisible[x][y - 1] === "!"){
            banderas++;
          }
        }

        if (y > 0 && x < buscaminasFuncionalidad.filas - 1){
          if (buscaminasFuncionalidad.tableroVisible[x + 1][y - 1] === "!"){
            banderas++;
          }
        }

        if (x > 0){
          if (buscaminasFuncionalidad.tableroVisible[x - 1][y] === "!"){
            banderas++;
          }
        }

        if (x < buscaminasFuncionalidad.filas - 1 ){
          if (buscaminasFuncionalidad.tableroVisible[x + 1][y] === "!"){
            banderas++;
          }
        }

        if (y < buscaminasFuncionalidad.columnas - 1){
          if (buscaminasFuncionalidad.tableroVisible[x][y + 1] === "!"){
            banderas++;
          }
        }

        if (x < buscaminasFuncionalidad.filas - 1  && y < buscaminasFuncionalidad.columnas - 1){
          if (buscaminasFuncionalidad.tableroVisible[x + 1][y + 1] === "!"){
            banderas++;
          }
        }

        if (x > 0  && y < buscaminasFuncionalidad.columnas - 1){
          if (buscaminasFuncionalidad.tableroVisible[x - 1][y + 1] === "!"){
            banderas++;
          }
        }
      }

      return banderas;
    },
  /**
   * Selecciona el nivel y asigna las casillas y el numero de minas según el nivel
   */
  elegirNivel() {
    switch (buscaminasFuncionalidad.nivel.toLowerCase()) {
      case "test":
        buscaminasFuncionalidad.filas = 3;
        buscaminasFuncionalidad.columnas = 3;
        buscaminasFuncionalidad.numMinas = 4;
        buscaminasFuncionalidad.numBanderas = 4;
        break;
      case "facil":
        buscaminasFuncionalidad.filas = 8;
        buscaminasFuncionalidad.columnas = 8;
        buscaminasFuncionalidad.numMinas = 10;
        buscaminasFuncionalidad.numBanderas = 10;
        break;
      case "intermedio":
        buscaminasFuncionalidad.filas = 16;
        buscaminasFuncionalidad.columnas = 16;
        buscaminasFuncionalidad.numMinas = 40;
        buscaminasFuncionalidad.numBanderas = 40;
        break;
      case "experto":
        buscaminasFuncionalidad.filas = 20;
        buscaminasFuncionalidad.columnas = 24;
        buscaminasFuncionalidad.numMinas = 99;
        buscaminasFuncionalidad.numBanderas = 99;
        break;
      default:
        break;
    }
  },
  /**
   * Actualiza los valores del tablero visible
   */
  actualizaCambios() {
    for (let i = 0; i < buscaminasFuncionalidad.filas; i++) {
      for (let j = 0; j < buscaminasFuncionalidad.columnas; j++) {
        if (buscaminasFuncionalidad.tableroPulsaciones[i][j] === "p" && buscaminasFuncionalidad.tableroVisible[i][j] === "#" ) {
          buscaminasFuncionalidad.tableroVisible[i][j] = buscaminasFuncionalidad.tableroMaster[i][j];
        }
      }
    }
  },
  /**
   * Genera los tableros y los inicializa
   */
  generarTableros() {
    for (let i = 0; i < buscaminasFuncionalidad.filas; i++) {
      buscaminasFuncionalidad.tableroMaster[i] = [];
      buscaminasFuncionalidad.tableroVisible[i] = [];
      buscaminasFuncionalidad.tableroCopiaMaster[i] = [];
      buscaminasFuncionalidad.tableroPulsaciones[i] = [];
      for (let j = 0; j < buscaminasFuncionalidad.columnas; j++) {
        buscaminasFuncionalidad.tableroMaster[i][j] = 0;
        buscaminasFuncionalidad.tableroVisible[i][j] = "#";
        buscaminasFuncionalidad.tableroCopiaMaster[i][j] = 0;
        buscaminasFuncionalidad.tableroPulsaciones[i][j] = 0;
      }
    }
  },

  /**
   * Comprueba si ganaste la partida, mediante el uso de banderas
   */
  comprobarGanadorBanderas() {
    let casillasSinPulsar = 0;
      let casillasGanar = 0;
      let casillasPulsadas = 0;
      for (let i = 0; i < buscaminasFuncionalidad.filas; i++) {
        for (let j = 0; j < buscaminasFuncionalidad.columnas; j++) {
          if (buscaminasFuncionalidad.tableroPulsaciones[i][j] === "p") {
            casillasPulsadas++;
          }
          if (buscaminasFuncionalidad.tableroPulsaciones[i][j] !== "p") {
            casillasSinPulsar++;
            if (
              (casillasSinPulsar === buscaminasFuncionalidad.numMinas) &&
              (buscaminasFuncionalidad.tableroMaster[i][j] === "x" && buscaminasFuncionalidad.tableroVisible[i][j] === "!")
            ) {
              casillasGanar++
            }
          }
        }
      }
        if (casillasPulsadas > 1 && (casillasGanar === buscaminasFuncionalidad.numMinas)) {
          buscaminasFuncionalidad.eliminarBanderas();
          //throw new Error("Has ganado la partida");
        }
  },

  /**
   * Genera y coloca las minas
   */
  generaMinas() {
    for (let i = 0; i < buscaminasFuncionalidad.numMinas; i++) {
      let fila;
      let columna;

      do{
        fila = Math.floor(Math.random() * (buscaminasFuncionalidad.filas - 1 - 0)) + 0;
        columna = Math.floor(Math.random() * (buscaminasFuncionalidad.columnas - 1 - 0)) + 0;
      }while(buscaminasFuncionalidad.tableroMaster[fila][columna] === "x");

      buscaminasFuncionalidad.tableroMaster[fila][columna] = "x";
      buscaminasFuncionalidad.tableroCopiaMaster[fila][columna] = "x";
      buscaminasFuncionalidad.apeturaMinas.add(fila+ "-"+columna)
    }
  },

  /**
   * Carga la pulsacion en la matriz correspondiente
   * @param x cordenada para la fila
   * @param y coordenada para la columna
   */
  cargarPulsacion(x, y) {
    buscaminasFuncionalidad.tableroPulsaciones[x][y] = "p";
    buscaminasFuncionalidad.aperturaCasillas.add("" + x + "-" + y+"");
  },

  /**
   * Coloca los numeros alrededor de las minas del tablero
   */
  numerosAlrededorMinas() {
    for (let i = 0; i < buscaminasFuncionalidad.filas; i++) {
      for (let j = 0; j < buscaminasFuncionalidad.columnas; j++) {
        if (buscaminasFuncionalidad.tableroMaster[i][j] === "x") {
          if (i == 0 && j == 0) {
            buscaminasFuncionalidad.cuentaMinas(i, j, i + 1, j + 1);
          } else if (i == 0 && (j > 0 && j < buscaminasFuncionalidad.numMinas - 1)) {
            buscaminasFuncionalidad.cuentaMinas(i, j - 1, i + 1, j + 1);
          } else if (i == 0 && j == buscaminasFuncionalidad.numMinas - 1) {
            buscaminasFuncionalidad.cuentaMinas(i, j - 1, i + 1, j);
          } else if (
            j == buscaminasFuncionalidad.numMinas - 1 &&
            (i > 0 && i < buscaminasFuncionalidad.numMinas - 1)
          ) {
            buscaminasFuncionalidad.cuentaMinas(i - 1, j - 1, i + 1, j);
          } else if (
            i == buscaminasFuncionalidad.numMinas - 1 &&
            j == buscaminasFuncionalidad.numMinas - 1
          ) {
            buscaminasFuncionalidad.cuentaMinas(i - 1, j - 1, i, j);
          } else if (
            i == buscaminasFuncionalidad.numMinas - 1 &&
            (j > 0 && j < buscaminasFuncionalidad.numMinas - 1)
          ) {
            buscaminasFuncionalidad.cuentaMinas(i - 1, j - 1, i, j + 1);
          } else if (i == buscaminasFuncionalidad.numMinas - 1 && j == 0) {
            buscaminasFuncionalidad.cuentaMinas(i - 1, j, i, j + 1);
          } else if (j == 0 && (i > 0 && i < buscaminasFuncionalidad.numMinas - 1)) {
            buscaminasFuncionalidad.cuentaMinas(i - 1, j, i + 1, j + 1);
          } else {
            buscaminasFuncionalidad.cuentaMinas(i - 1, j - 1, i + 1, j + 1);
          }
        }
      }
    }
  },

  /**
   * Coloca el numero de minas
   * @param ii inicio de fila
   * @param ij inicio de columna
   * @param fi fin de fila
   * @param fj fin de columna
   */
  cuentaMinas(ii, ij, fi, fj) {
    for (let i = ii; i <= fi; i++) {
      for (let j = ij; j <= fj; j++) {
        if (buscaminasFuncionalidad.tableroMaster[i][j] !== "x") {
          if (buscaminasFuncionalidad.tableroMaster[i][j] === 0) {
            buscaminasFuncionalidad.tableroMaster[i][j] = 0 + 1;
            buscaminasFuncionalidad.tableroCopiaMaster[i][j] = 0 + 1;
          } else {
            buscaminasFuncionalidad.tableroMaster[i][j] =
              parseInt(buscaminasFuncionalidad.tableroMaster[i][j]) + 1;
            buscaminasFuncionalidad.tableroCopiaMaster[i][j] = parseInt(
              buscaminasFuncionalidad.tableroMaster[i][j]
            );
          }
        }
      }
    }
  },

  /**
   * Devuelve el número de casillas que hay pulsadas en el tablero
   */
  obtenerNumeroCasillasPulsadas() {
    let contador = 0;
    for (let i = 0; i < buscaminasFuncionalidad.filas; i++) {
      for (let j = 0; j < buscaminasFuncionalidad.columnas; j++) {
        if (buscaminasFuncionalidad.tableroPulsaciones[i][j] === "p") contador++;
      }
    }
    return contador;
  },

  /**
   * Devuelve el número de casillas necesarias para ganar del tablero
   */
  obtenerNumeroCasillasParaGanar() {
    let contador = 0;
    for (let i = 0; i < buscaminasFuncionalidad.filas; i++) {
      for (let j = 0; j < buscaminasFuncionalidad.columnas; j++) {
        if (buscaminasFuncionalidad.tableroMaster[i][j] !== "x") contador++;
      }
    }
    return contador;
  },

  /**
   * Descubre casillas, de manera recursiva
   * @param x coordenada para la fila
   * @param y coordenada para la columna
   */

  abrirCeros(x, y) {
    if (buscaminasFuncionalidad.tableroCopiaMaster[x][y] === 0) {
      buscaminasFuncionalidad.tableroCopiaMaster[x][y] = -1;
      if (buscaminasFuncionalidad.tableroMaster[x][y] === 0) {
        for (
          let j = Math.max(x - 1, 0);
          j <= Math.min(x + 1, buscaminasFuncionalidad.filas - 1);
          j++
        )
          for (
            let k = Math.max(y - 1, 0);
            k <= Math.min(y + 1, buscaminasFuncionalidad.columnas - 1);
            k++
          ) {
            buscaminasFuncionalidad.cargarPulsacion(j, k);
            buscaminasFuncionalidad.abrirCeros(j, k);
          }
      }
    }else{
      for (
        let j = Math.max(x - 1, 0);
        j <= Math.min(x + 1, buscaminasFuncionalidad.filas - 1);
        j++
      )
        for (
          let k = Math.max(y - 1, 0);
          k <= Math.min(y + 1, buscaminasFuncionalidad.columnas - 1);
          k++
        ) {
          if (buscaminasFuncionalidad.tableroVisible[x][y] === "!"){
            buscaminasFuncionalidad.numBanderas = buscaminasFuncionalidad.numBanderas + 1;
            buscaminasFuncionalidad.tableroVisible[x][y] = buscaminasFuncionalidad.tableroMaster[x][y];
          }
        }
    }
  },
  /*
  * Comprueba que el juego no haya finalizado
  */
  juegoNoFinalizado(){
    return !buscaminasFuncionalidad.flagGanado && !buscaminasFuncionalidad.flagPerdido
  },
  /**
   * pica una casilla y realiza las acciones correspondientes
   * @param i coordenada fila
   * @param j coordenada columna
   */

  picar(x, y) {
    if (x > buscaminasFuncionalidad.filas || y > buscaminasFuncionalidad.columnas){
      throw new Error(msgCoordenadasInvalidas);
    }

    if (!buscaminasFuncionalidad.juegoNoFinalizado() || buscaminasFuncionalidad.tableroPulsaciones[x][y] === "p" || buscaminasFuncionalidad.tableroVisible[x][y] === "!") {
      return;
    }

      if (buscaminasFuncionalidad.tableroMaster[x][y] === "x") {
        buscaminasFuncionalidad.flagPerdido = true;
        buscaminasFuncionalidad.eliminarBanderas();
        throw new Error(msgPerderPartida);
      }
      if (buscaminasFuncionalidad.tableroVisible[x][y] === "!"){
        buscaminasFuncionalidad.tableroVisible[x][y] = buscaminasFuncionalidad.tableroMaster[x][y];
      }
      buscaminasFuncionalidad.abrirCeros(x, y);
      buscaminasFuncionalidad.cargarPulsacion(x, y);
      buscaminasFuncionalidad.actualizaCambios();
      //  console.clear();
      //  console.log("Tablero Master \n");
      // console.table(buscaminasFuncionalidad.tableroMaster);
      //  console.log("Tablero Visible \n");
      //  console.table(buscaminasFuncionalidad.tableroVisible);
      // console.table(buscaminasFuncionalidad.tableroPulsaciones);
      buscaminasFuncionalidad.comprobarSiGana();
    },

  /**
   * Comprueba si ganas las partida de manera normal
   */
  comprobarSiGana() {

      if (
        buscaminasFuncionalidad.obtenerNumeroCasillasPulsadas() ===
        buscaminasFuncionalidad.obtenerNumeroCasillasParaGanar()
      ) {
        buscaminasFuncionalidad.flagGanado = true;
        buscaminasFuncionalidad.eliminarBanderas();
        throw new Error(msgGanarPartida);
      }
  },
  /**
   * Pregunta si deseas volver a jugar, es caso verdadero inicia el juego
   * @param msg mensaje para mostrar al usuario
   */
  volverAjugar(msg) {
    let volverAjugar = "";
    do {
      volverAjugar = prompt(msg + ", ¿deseas volver a jugar? (s/n)");
    } while (
      volverAjugar.toLowerCase() === "s" &&
      volverAjugar.toLowerCase() === "n"
    );
    if (volverAjugar.toLowerCase() === "s") {
      location.reload();
    } else {
      return;
    }
  }

};


/*
* Closure objeto buscaminas
*/

// ¡¡ NO VEO SENTIDO A UN CLOSURE LOURDES, PUDIENDO USAR EXPORT E IMPORT !! :(

buscaMinas = (function () {
    return buscaminasFuncionalidad;
})();

/*
* Constantes para messages de execption
*/
messagesBuscaminas= (function () {
    return {
      "msgGanarPartida": msgGanarPartida,
      "msgCoordenadasInvalidas": msgCoordenadasInvalidas,
      "msgPerderPartida" : msgPerderPartida
    };
})();
}
