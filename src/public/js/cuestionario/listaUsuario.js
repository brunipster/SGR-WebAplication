function cargarCuestionario(id, idRespuesta) {
    $.ajax({
        url: '/cuestionario/obtenerCuestionario/' + id + '?idRespuesta=' + idRespuesta,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).done(function (data) {
        fillModal(data);
        $('#modalCuestionario').modal('show');
    });
}

function fillModal(data) {
    $('#labelTituloModal').html(data.descripcion);
    $('#inputIdCuestionario').val(data.id);
    $('#inputIdCuestionarioUsuario').val(data.idRespuestaCuestionario)
    $('.preguntas').html('')
    data.preguntas.forEach(element => {
        $('.preguntas').append(
            '<div class="col-md-12 question">' +
            '<h5 id="pregunta-' + element.id + '">' + element.descripcion + '</h5>' +
            fillRespuestas(element.respuestas, element) +
            '</div>' +
            '</div>')
    });
}

function fillRespuestas(list, pregunta) {
    var respuesta = ""
    list.forEach(element => {
        if (pregunta.idRespuesta && pregunta.idRespuesta == element.id) {
            respuesta = respuesta +
                '<div class="form-check">' +
                '<input class="form-check-input radio-respuesta" type="radio" name="' + pregunta.id + '" value="' + element.id + '" checked>' +
                '<label class="form-check-label" id="' + element.id + '" for="exampleRadios1">' + element.descripcion + '</label></div>'
        } else {
            respuesta = respuesta +
                '<div class="form-check">' +
                '<input class="form-check-input radio-respuesta" type="radio" name="' + pregunta.id + '" value="' + element.id + '">' +
                '<label class="form-check-label" id="' + element.id + '" for="exampleRadios1">' + element.descripcion + '</label></div>'
        }
    });
    return respuesta
}

$(document).ready(() => {

    $('#btnGuardarModal').click(function () {
        let idCuestionario = $('#inputIdCuestionario').val();
        let idRespuestaCuestionario = $('#inputIdCuestionarioUsuario').val();
        let respuestas = getRespuestas()
        let body = {
            respuestas: respuestas,
            cuestionario: {
                idCuestionario: parseInt(idCuestionario),
                descripcion: $('#labelTituloModal').html(),
                estado: 1
            }
        }
        $.ajax({
            url: '/cuestionario/crearUsuario?idCuestionario=' + idCuestionario + '&idRespuestaCuestionario=' + idRespuestaCuestionario,
            method: 'POST',
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        }).done(function (data) {
            if (data.result == 'ok') {
                $('#modalCuestionario').modal('hide');
                location.reload();
            }
        });
    });

    function getRespuestas() {
        var respuestas = []
        $(document).find('.radio-respuesta').each(function (i) {
            let respuesta = {}
            let idPregunta = this.getAttribute("name");
            let idRespuesta = this.getAttribute("value");
            if ($(this).is(':checked')) {
                let descRespuesta = $(document).find("#" + idRespuesta).html()
                let descPregunta = $(document).find("#pregunta-" + idPregunta).html()
                respuesta = {
                    idPreguntaCuestionario: parseInt(idPregunta),
                    idRespuestaCuestionario: parseInt(idRespuesta),
                    respuestaDetalle: descRespuesta,
                    preguntaDetalle: descPregunta
                }
                respuestas.push(respuesta)
            }
        });
        return respuestas
    }
});
