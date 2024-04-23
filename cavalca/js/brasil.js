
        (function () {
            "use strict";
            var lastTicks;
            var currentTicks;
            var interval = 0;
            var contadorWidget = new ContadorConfig().get();

            $(function () {

                var url = "pais.php";

                Contador.obterDadosIniciais(contadorWidget, url);

                setTimeout(function () {
                    currentTicks = new Date().getTime();
                    setContador();
                }, 1);

            });


            function setContador() {
                lastTicks = currentTicks;
                currentTicks = new Date().getTime();
                var updateTime = 250;
                var casas = 9;

                if (contadorWidget.counter_datetime !== 0)
                    contadorWidget.counter_datetime += interval;

                var newCount = Contador.somaSegundo(contadorWidget, casas);

                if ((+newCount > 1000000000000.00) && (1000000000000.00 + (+contadorWidget.counter_seconds * 30) > +newCount)) {
                    newCount = '1000000000000.00';
                }

                var zerosBefore = '';
                for (var i = newCount.length - 2; i <= (contadorWidget.counter_initial.length - 3) ; i++) {
                    var numInter = (i / 3);
                    if (parseInt(numInter) === parseFloat(numInter)) {
                        zerosBefore = '.' + zerosBefore;
                    }
                    zerosBefore = 0 + zerosBefore;
                }

                var _counter = $('#counter-pais');

                function buildCounter() {
                    _counter.html('');

                    var values = Contador.addCommas(newCount).split('.');
                    var _counterLabels;

                    switch (values.length) {
                        case 2:
                            _counterLabels = ['Reais', 'Centavos'];
                            break;
                        case 3:
                            _counterLabels = ['Mil', 'Reais', 'Centavos'];
                            break;
                        case 4:
                            _counterLabels = ['Milhões', 'Mil', 'Reais', 'Centavos'];
                            break;
                        case 5:
                            _counterLabels = ['Bilhões', 'Milhões', 'Mil', 'Reais', 'Centavos'];
                            break;
                        case 6:
                            _counterLabels = ['Tri', 'Bilhões', 'Milhões', 'Mil', 'Reais', 'Centavos'];
                            break;
                    }

                    $.each(values, function (i, x) {
                        var _counterGroup = document.createElement('div');
                        $(_counterGroup).attr('class', 'counter counter-group')
                            .appendTo(_counter);

                        var _counterLabel = document.createElement('span');
                        $(_counterLabel).attr('class', 'counter counter-label')
                            .html(_counterLabels[i])
                            .appendTo(_counterGroup)

                        $.each(x.split(''), function (j, z) {
                            var _counterInside = document.createElement('div');

                            $(_counterInside).attr('class', 'counter counter-inside')
                                .html(z)
                                .appendTo(_counterGroup);
                        });
                    });
                };
                buildCounter();

                var diffTicks = (currentTicks - lastTicks) - updateTime;
                interval = 250;
                interval += diffTicks;

                setTimeout(setContador, updateTime);
            }
        })();

