$(document).ready(function () {
    window.beneficentes = {};
    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        let cpf = document.getElementById("CPF").value
        let rawCpf = cpf.replaceAll(".", "").replace("-", "")
        let firstTotal = 0
        let secondTotal = 0
        let firstCount = 10
        let secondCount = 11
        if (rawCpf.length > 10) {
            for (var letter of rawCpf) {
                if (firstCount > 1) {
                    firstTotal += parseInt(letter) * firstCount
                }
                if (secondCount > 1) {
                    secondTotal += parseInt(letter) * secondCount
                }
                firstCount--;
                secondCount--;
            }
            if ((firstTotal * 10) % 11 == parseInt(rawCpf[9]) && (secondTotal * 10) % 11 == parseInt(rawCpf[10])) {
                const info = {
                    "NOME": $(this).find("#Nome").val(),
                        "CEP": $(this).find("#CEP").val(),
                            "CPF": rawCpf,
                                "Email": $(this).find("#Email").val(),
                                    "Sobrenome": $(this).find("#Sobrenome").val(),
                                        "Nacionalidade": $(this).find("#Nacionalidade").val(),
                                            "Estado": $(this).find("#Estado").val(),
                                                "Cidade": $(this).find("#Cidade").val(),
                                                    "Logradouro": $(this).find("#Logradouro").val(),
                                                        "Telefone": $(this).find("#Telefone").val(),
                                }
                $.ajax({
                    url: urlExistencia,
                    method: "POST",
                    data: {
                        "CPF": rawCpf,
                    },
                    error:
                        function (r) {
                            if (r.status == 400)
                                ModalDialog("Ocorreu um erro", r.responseJSON);
                            else if (r.status == 500)
                                ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                        },
                    success:
                        function (exists) {
                            if(exists == "Sucesso")
                                $.ajax({
                                    url: urlPost,
                                    method: "POST",
                                    data: info,
                                    error:
                                        function (r) {
                                            if (r.status == 400)
                                                ModalDialog("Ocorreu um erro", r.responseJSON);
                                            else if (r.status == 500)
                                                ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                                        },
                                    success:
                                        function (r) {
                                            if (window.beneficentes != {}) {
                                                for (const key in window.beneficentes) {
                                                    $.ajax({
                                                        url: urlBeneficiario,
                                                        method: "POST",
                                                        data: {
                                                            "CPF": key,
                                                            "Nome": window.beneficentes[key],
                                                            "IdCliente": r
                                                        },
                                                        error:
                                                            function (r) {
                                                                if (r.status == 400)
                                                                    ModalDialog("Ocorreu um erro", r.responseJSON);
                                                                else if (r.status == 500)
                                                                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                                                            },
                                                        success:
                                                            function (r) {
                                                                ModalDialog("Sucesso!", "Cadastro efetuado com sucesso")
                                                                $("#formCadastro")[0].reset();
                                                            }
                                                    })
                                                }

                                            } else {
                                                ModalDialog("Sucesso!", "Cadastro efetuado com sucesso")
                                                $("#formCadastro")[0].reset();
                                            }
                                        }
                                });
                            else {
                                ModalDialog("Ocorreu um erro", "CPF já cadastrado");
                            }
                        } 
                });
            } else {
                ModalDialog("Ocorreu um erro", "CPF Inválido");
            }
        }
        
    })
    
})

function modalBeneficiarios() {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade" data-backdrop="static">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">Beneficiários</h4>                                                     ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '         <div class="row">                                                                                         ' +
        '            <div class="col-md-4" >                                                                               ' +
        '                <div class="form-group">                                                                           ' +
        '                    <label for="CPFModal">CPF:</label>                                                                ' +
        '                    <input required="required" type="text" class="form-control" id="CPFModal" name="CPFModal" placeholder="Ex.: 000.000.001-91" maxlength="14" onkeypress="validaCPFModal()"> ' +
        '               </div>                                                                                              ' +
        '            </div>                                                                                                 ' +
        '            <div class="col-md-5">                                                                                 ' +
        '                <div class="form-group">                                                                           ' +
        '                    <label for="NomeModal">Nome:</label>                                                      ' +
        '                    <input required="required" type="text" class="form-control" id="NomeModal" name="NomeModal" placeholder="Ex.: João da Silva" maxlength="255"> ' +
        '                </div>                                                                                             ' +
        '            </div>                                                                                                 ' +
        '            <div class="col-md-3" style = "height:59px;position:relative">                                             ' +
        '           <button type="button" class="btn btn-sm btn-success" style="position: absolute;bottom: 0;" onclick="adicionaBeneficente()">Incluir</button>   ' +
        '            </div>                                                                                                 ' +
        '        </div>                                                                                                     ' + //end of form

        '                                                                                                                   ' + //start of table
        '                    <table class="table">                                                                          ' +
        '                        <thead>                                                                                    ' +
        '                            <tr>                                                                                   ' +
        '                                <th scope="col">CPF</th>                                                           ' +
        '                                <th scope="col">Nome</th>                                                          ' +
        '                                <th scope="col"></th>                                                              ' +
        '                            </tr>                                                                                  ' +
        '                        </thead>                                                                                   ' +
        '                    </table>                                                                                       ' +

        '                </div>                                                                                             ' + //end of body

        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
    refreshGraphics()
}

function adicionaBeneficente() {
    let cpf = document.getElementById("CPFModal").value
    let rawCpf = cpf.replaceAll(".", "").replace("-", "")
    let firstTotal = 0
    let secondTotal = 0
    let firstCount = 10
    let secondCount = 11
    let allSame = true
    let last = rawCpf[0]
    if (!window.beneficentes.hasOwnProperty(cpf.replaceAll(".", "").replace("-", ""))) {
        if (document.getElementById("NomeModal").value != '') {
            if (rawCpf.length > 10) {
                for (var letter of rawCpf) {
                    if (firstCount > 1) {
                        firstTotal += parseInt(letter) * firstCount
                    }
                    if (secondCount > 1) {
                        secondTotal += parseInt(letter) * secondCount
                    }
                    if (letter != last) {
                        allSame = false
                    }
                    firstCount--;
                    secondCount--;
                    last = letter;
                }
                if ((firstTotal * 10) % 11 == parseInt(rawCpf[9]) && (secondTotal * 10) % 11 == parseInt(rawCpf[10]) && !allSame) {
                    window.beneficentes[cpf.replaceAll(".", "").replace("-", "")] = document.getElementById("NomeModal").value
                } else {
                    ModalDialog("Ocorreu um erro", "CPF Inválido");
                }
            } else {
                ModalDialog("Ocorreu um erro", "CPF Inválido");
            }
        } else {
            ModalDialog("Ocorreu um erro", "Nome obrigatório");
        }
    } else {
        ModalDialog("Ocorreu um erro", "CPF já usado");
    }
    
    refreshGraphics();
}

function refreshGraphics() {
    $('table').children('tr').empty()
    for (const key in window.beneficentes) {
        let modal =
            '    <tr>                           ' +
            '        <th scope="row">' + key.replace(/[^\d]/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") + '</th>     ' +
            '        <td>' + window.beneficentes[key.replaceAll(".", "").replace("-", "")] + '</td>             ' +
            '        <td><button type="button" class="btn btn-sm btn-primary" onclick="alteraBeneficiario(\'' + key.replaceAll(".", "").replace("-", "") + '\')">Alterar</button> <button type="button" class="btn btn-sm btn-primary" onclick="deletaBeneficiario(\'' + key.replaceAll(".", "").replace("-", "") +'\')">Excluir</button></td>              ' +
            '    </tr>                          ';
        $('table').append(modal)
    }
}

function alteraBeneficiario(cpf) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade" data-backdrop="static">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">Beneficiários</h4>                                                     ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '         <div class="row">                                                                                         ' +
        '            <div class="col-md-4" >                                                                               ' +
        '                <div class="form-group">                                                                           ' +
        '                    <label for="CPFModalModal' + random + '">CPF:</label>                                                                ' +
        '                    <input required="required" type="text" class="form-control" id="CPFModalModal' + random + '" name="CPFModalModal' + random + '" placeholder="Ex.: 000.000.001-91" maxlength="14" onkeypress="validaCPFModalModal(\'' + random + '\')"> ' +
        '               </div>                                                                                              ' +
        '            </div>                                                                                                 ' +
        '            <div class="col-md-5">                                                                                 ' +
        '                <div class="form-group">                                                                           ' +
        '                    <label for="NomeModalModal' + random + '">Nome:</label>                                                      ' +
        '                    <input required="required" type="text" class="form-control" id="NomeModalModal' + random + '" name="NomeModalModal' + random + '" placeholder="Ex.: João da Silva" maxlength="255"> ' +
        '                </div>                                                                                             ' +
        '            </div>                                                                                                 ' +
        '            <div class="col-md-3" style = "height:59px;position:relative">                                             ' +
        '           <button type="button" class="btn btn-sm btn-success" style="position: absolute;bottom: 0;" onclick="alteraBeneficente(\''+cpf+'\',\'' + random + '\')">Alterar</button>   ' +
        '            </div>                                                                                                 ' +
        '        </div>                                                                                                     ' + //end of form
        '                </div>                                                                                             ' + //end of body

        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';
    $('body').append(texto);
    $('#' + random).modal('show');
    document.getElementById("CPFModalModal" + random).value = cpf.replace(/[^\d]/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    document.getElementById("NomeModalModal" + random).value = window.beneficentes[cpf.replaceAll(".", "").replace("-", "")]
}

function alteraBeneficente(cpf, random) {
    const cpfNovo = document.getElementById("CPFModalModal" + random).value
    if (cpf.replaceAll(".", "").replace("-", "") == cpfNovo.replaceAll(".", "").replace("-", "")) {
        window.beneficentes[cpf.replaceAll(".", "").replace("-", "")] = document.getElementById("NomeModalModal" + random).value
        refreshGraphics()
        $('#' + random).modal('hide');
    } else if (window.beneficentes.hasOwnProperty(cpfNovo.replaceAll(".", "").replace("-", ""))) {
        ModalDialog("Ocorreu um erro", "CPF já usado");
    } else {
        let rawCpf = cpfNovo.replaceAll(".", "").replace("-", "")
        let firstTotal = 0
        let secondTotal = 0
        let firstCount = 10
        let secondCount = 11
        if (document.getElementById("NomeModal").value != '') {
        if (rawCpf.length > 10) {
            for (var letter of rawCpf) {
                if (firstCount > 1) {
                    firstTotal += parseInt(letter) * firstCount
                }
                if (secondCount > 1) {
                    secondTotal += parseInt(letter) * secondCount
                }
                firstCount--;
                secondCount--;
            }
            if ((firstTotal * 10) % 11 == parseInt(rawCpf[9]) && (secondTotal * 10) % 11 == parseInt(rawCpf[10])) {
                delete window.beneficentes[cpf.replaceAll(".", "").replace("-", "")]
                window.beneficentes[document.getElementById("CPFModalModal" + random).value.replaceAll(".", "").replace("-", "")] = document.getElementById("NomeModalModal" + random).value
                refreshGraphics()
                $('#' + random).modal('hide');
                } else {
                    ModalDialog("Ocorreu um erro", "CPF Inválido");
                }
            } else {
                ModalDialog("Ocorreu um erro", "CPF Inválido");
            }
        } else {
            ModalDialog("Ocorreu um erro", "Nome obrigatório");
        }
    }
}

function deletaBeneficiario(cpf) {
    delete window.beneficentes[cpf.replaceAll(".", "").replace("-", "")]
    refreshGraphics()
}

function validaCPF() {
    let cpf = document.getElementById("CPF").value
    document.getElementById("CPF").value = cpf.replace(/[^\d]/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

function validaCPFModal() {
    let cpf = document.getElementById("CPFModal").value
    document.getElementById("CPFModal").value = cpf.replace(/[^\d]/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

function validaCPFModalModal(random) {
    let cpf = document.getElementById("CPFModalModal" + random).value
    document.getElementById("CPFModalModal" + random).value = cpf.replace(/[^\d]/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
