var Service, Characteristic;

var temperatureService;
var temperature = 0;
var exec = require('child_process').exec;

var tempid = "undef";

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-rpitemp", "RpiTemp", RpiTemp);
}

function RpiTemp(log, config) {
    this.log = log;

    this.name = config["name"];
    this.manufacturer = config["manufacturer"] || "Jens Manufacturer";
    this.model = config["model"] || "Jens Model";
    this.serial = config["serial"] || "Jens Serial";
    this.tempid = config["tempid"]
}

RpiTemp.prototype = {

    getState: function (callback) {
        var that = this;

        switch(this.tempid)
        {
            case "cpu":
                var child = exec("cat /sys/class/thermal/thermal_zone0/temp", function (err, stdout, stderr) {
                    if (err !== null) {
                        that.log('Error: ' + err);
                        callback(error);

                        return;
                    } else {
                        //Divide the response by 1000 to get degrees celsius
                        that.temperature = parseFloat(stdout)/1000;
                    }
                });
                break;

            default:
                this.log('Unknown temp ID: ' + this.tempid);
                callback(error);
                return;
        }

        this.log('Sending temp: ' + this.temperature);

        temperatureService.setCharacteristic(Characteristic.CurrentTemperature, this.temperature);

        callback(null, this.temperature);
    },

    identify: function (callback) {
        this.log("Identify requested!");
        callback(); // success
    },

    getServices: function () {
        var services = [],
            informationService = new Service.AccessoryInformation();

        informationService
                .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
                .setCharacteristic(Characteristic.Model, this.model)
                .setCharacteristic(Characteristic.SerialNumber, this.serial);
        services.push(informationService);

        temperatureService = new Service.TemperatureSensor(this.name);
        temperatureService
                .getCharacteristic(Characteristic.CurrentTemperature)
                .on('get', this.getState.bind(this));
        services.push(temperatureService);

        return services;
    }
};
