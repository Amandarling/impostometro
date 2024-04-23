var ContadorConfig = function () {
    "use strict";

    var config = {
        tempoAtualizacao: 250,
        counter_initial: 0,
        counter_seconds: 0,
        counter_datetime: 0,
        midnight: 0
    };
    Object.defineProperties(config, {
        tempoAtualizacao: {
            writable: false
        }
    });

    function getConfiguration() {
        return config;
    }

    function setConfiguration(config) {
        this.config = config;
        return this.config;
    }

    return ({
        get: getConfiguration,
        set: setConfiguration
    });
};

var Contador = (function () {
    "use strict";

    function pad(n, width, z) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    function addCommas(nStr) {
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + '.' + '$2');
        }
        return x1 + '.' + pad(x2.substring(1, 3), 2);
    }

    function retornaMesSelecionado(x) {
        switch (x) {
            case '1':
                return 'janeiro';
                break;

            case '2':
                return 'fevereiro';
                break;

            case '3':
                return 'março';
                break;

            case '4':
                return 'abril';
                break;

            case '5':
                return 'maio';
                break;

            case '6':
                return 'junho';
                break;

            case '7':
                return 'julho';
                break;

            case '8':
                return 'agosto';
                break;

            case '9':
                return 'setembro';
                break;

            case '10':
                return 'outubro';
                break;

            case '11':
                return 'novembro';
                break;

            case '12':
                return 'dezembro';
                break;

            default:
                return 'janeiro';
                break;
        }
    }

    function somaSegundo(config, casas) {

        var diff = ((+config.counter_datetime - +config.midnight) / 1000);
        var proporcional = config.counter_seconds * diff;
        var valorInicial = config.counter_initial;
        valorInicial = Number(valorInicial);
        valorInicial += proporcional;

        var str = (valorInicial > 0 ? valorInicial : -valorInicial) + "";
        var zeros = "";
        for (var i = casas - str.length; i > 0; i--) zeros += "0";
        zeros += str;
        return valorInicial >= 0 ? zeros : "-" + zeros;
    }

    function obterDadosIniciais(config, url, keepstate) {
        var startTime = new Date().getTime();
        $.ajax({
            dataType: "json",
            cache: false,
            url: url,
            beforeSend: function () {
                if (typeof keepstate == "undefined")
                    config.counter_initial = 0,

                    config.counter_seconds = 0,
                    config.counter_datetime = 0;
            },
            error: function () {
                console.error("Contador - Servico indisponivel temporiariamente.");
            },
            success: function (data) {
                var endTime = new Date().getTime();
                var diffTime = endTime - startTime;
                config.counter_initial = data.Valor;
                config.counter_seconds = data.Incremento;
                config.counter_datetime = new Date(data.Data).getTime() + diffTime;
                config.midnight = new Date(data.Midnight).getTime();
            }
        });

        // Código responsável por atualizar os dados inicias do contador. Isso irá acontecer a cada : 6 horas
        var tempoAtualizarDadosIniciais = 1000 * 60 * 60 * 3;
        setTimeout(function () {
            location.reload();
            //Contador.obterDadosIniciais(config, url);
        }, tempoAtualizarDadosIniciais);
    }

    return ({
        addCommas: addCommas,
        retornaMesSelecionado: retornaMesSelecionado,
        somaSegundo: somaSegundo,
        obterDadosIniciais: obterDadosIniciais,
    });
})();


// Exibe o dia e mês atual no contador
var today = new Date();
dd = today.getDate(),
    mm = today.getMonth() + 1,
    yy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd;
}

switch (mm) {
    case 1:
        mm = 'janeiro';
        break;

    case 2:
        mm = 'fevereiro';
        break;

    case 3:
        mm = 'março';
        break;

    case 4:
        mm = 'abril';
        break;

    case 5:
        mm = 'maio';
        break;

    case 6:
        mm = 'junho';
        break;

    case 7:
        mm = 'julho';
        break;

    case 8:
        mm = 'agosto';
        break;

    case 9:
        mm = 'setembro';
        break;

    case 10:
        mm = 'outubro';
        break;

    case 11:
        mm = 'novembro';
        break;

    case 12:
        mm = 'dezembro';
        break;

    default:
        mm = 'janeiro';
        break;
}