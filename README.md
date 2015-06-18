# Lobby

15 channels of weather-reactive sound art in a lobby at Microsoft in Redmond, WA.

![alt text](http://columbiaweather.com/media/products/Orion/Orion2.jpg "Orion weather station")

## Links

* [Orion Weather station](http://www.columbiaweather.com/media/products/Orion/Orion%20User%20Manual.pdf)
* [Weather Microserver](http://columbiaweather.com/media/Microserver/MicroServer%20User%20Manual%20v315.pdf)

## Microserver to OSC

There is a node app that reads XML data from the weather station microserver and sends it via OSC (over UDP) to Pd.

```
$ node app.js localhost:9009 1
```
