
:bomb: Buscaminas :bomb:
----
Abre el juego [aquí](https://iesgrancapitan-dwec.github.io/Buscaminas-JesusMejiasLeiva)

------------

 ### :exclamation: ¿Cómo puedo ver el tablero para hacer las pruebas? :exclamation:

------------

Solo es necesario hacer un ```buscaminas.mostrar()``` en la consola, **una vez se haya elegido el nivel del juego**. Las casillas que muestren una ```x``` indican que en ella se encuentra una mina.

![Alt Text](images/mostrar.gif)

------------

 ### :dizzy: Efectos Jquery para las funcionalidades básicas :dizzy:

------------
#### Click (Abrir casilla)

![Alt Text](images/picar.gif)

:rocket: [Invocación](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L96)

:memo: [Función](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L282)

:zap: [Aquí se añade el efecto Jquery](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L247)



------------
#### Click derecho (Colocar o quitar bandera)

![Alt Text](images/marcar.gif)

:rocket: [Invocación](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L108)

:memo: [Función](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L316)

:zap: [Aquí se añade el efecto Jquery](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L324)



------------

#### Click con ambos botones o pulsación larga (despejar)

![Alt Text](images/despejar.gif)

:rocket: [Invocación.](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L111) Pulsación dos botones

:rocket: [Invocación](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L127). Pulsación larga

:memo: [Función](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L187)

:zap: [Aquí se añade el efecto Jquery.](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L197)


------------

#### Ganar

![Alt Text](images/ganar.gif)

:rocket: Se invoca en la captura de la exception correspondiente.

:memo: [Función](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L355)

:zap: [Muestro ventana emergente con Swal](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L299)

------------
#### Perder

![Alt Text](images/perder.gif)

:rocket: Se invoca en la captura de la exception correspondiente.

:memo: [Función ](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L355)

:zap: [Muestro ventana emergente con Swal](https://github.com/iesgrancapitan-dwec/Buscaminas-JesusMejiasLeiva/blob/master/js/gui.js#L304)
