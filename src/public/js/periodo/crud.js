$(document).ready(() => {

    $('#btnNuevo').click(function (event) {
        $('#btnGuardarModal').html('Crear')
        cleanModal();
        $('#modalPeriodos').modal('show')
    })

    $('.botonEditar').click(function (event) {
        var id = $(event.target).data('id');
        $.ajax({
            url: '/periodos/obtener/' + id,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).done(function (data) {
            fillModal(data);
            $('#modalPeriodos').modal('toggle');
        });
    });

    $('.botonEliminar').click(function (event) {
        var id = $(event.target).data('id');
        $.ajax({
            url: '/periodos/obtener/' + id,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).done(function (data) {
            if (data.preguntas.length > 0) {
                Swal.fire(
                    "No puede eliminar este periodo",
                    'Es utilizado por (' + data.preguntas.length + ') preguntas',
                    'warning'
                )
            } else {
                showAlertDelete(data, function () {
                    eliminar(id)
                });
            }
        });
    });

    $('#btnGuardarModal').click(function () {
        var id = $('#inputId').val();
        if (id) {
            editar(id);
        } else {
            crear();
        }
    });

    function crear() {
        let body = getDataModal()
        $.ajax({
            url: '/periodos/crear',
            method: 'POST',
            contentType: 'application/json',
            dataType: "json",
            data: JSON.stringify(body)
        }).done(function (data, textStatus, jqXHR) { //same as .success (depricated as of 1.8)
            console.log("done");
            console.log(data);
            launchAlertSuccess("Registro Existoso");
        });
    }

    function editar(id) {
        let body = getDataModal()
        $.ajax({
            url: '/periodos/editar/' + id,
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(body)
        }).done(function (data, textStatus, jqXHR) { //same as .success (depricated as of 1.8)
            console.log("done");
            console.log(data);
            launchAlertSuccess("Actualización Existoso");
        });
    }

    function eliminar(id) {
        $.ajax({
            url: '/periodos/eliminar/' + id,
            method: 'DELETE',
            contentType: 'application/json'
        }).done(function (data, textStatus, jqXHR) { //same as .success (depricated as of 1.8)
            console.log("done");
            console.log(data);
            launchAlertSuccess("Eliminacion Exitosa");
        });
    }


    function cleanModal() {
        $('#inputId').val("");
        $('#inputDescripcion').val("");
        $('#inputFechaInicio').val("");
        $('#inputFechaFin').val("");
    }

    function fillModal(obj) {
        $('#btnGuardarModal').html('Actualizar');
        $('#inputId').val(obj.id);
        $('#inputDescripcion').val(obj.descripcion);
        $('#inputFechaInicio').val(obj.fechaInicio);
        $('#inputFechaFin').val(obj.fechaFin);
    }

    function getDataModal() {
        let descripcion = $('#inputDescripcion').val();
        let fechaInicio = $('#inputFechaInicio').val();
        let fechaFin = $('#inputFechaFin').val();
        let obj = {
            descripcion: descripcion,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        }
        return obj
    }

    function launchAlertSuccess(title) {
        Swal.fire(
            title,
            '',
            'success'
        ).then((result) => {
            location.reload();
            $('#modalPeriodos').modal('hide');
        })
    }

    function showAlertDelete(data, completion) {
        Swal.fire({
            title: 'Seguro que deseas eliminar el periodo',
            html: '<strong>' + data.descripcion + '</strong>',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#aaaaaa',
            confirmButtonText: 'Si, eliminalo!'
        }).then((result) => {
            if (result.value) {
                completion()
            }
        })
    }

})