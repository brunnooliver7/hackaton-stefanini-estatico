angular.module("hackaton-stefanini").controller("PessoaIncluirAlterarController", PessoaIncluirAlterarController);
PessoaIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function PessoaIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {

    vm = this;

    vm.pessoa = {
        id: null,
        nome: "",
        email: "",
        dataNascimento: null,
        enderecos: [],
        perfils: [],
        situacao: false
    };

    vm.enderecoEditar = {
        id: null,
        idPessoa: null,
        cep: "",
        uf: "",
        localidade: "",
        bairro: "",
        logradouro: "",
        complemento: ""
    };

    vm.enderecoCriar = {
        idPessoa: null,
        cep: "",
        uf: "",
        localidade: "",
        bairro: "",
        logradouro: "",
        complemento: ""
    };

    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";
    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";
    vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/";

    vm.init = function () {

        vm.tituloTela = "Cadastrar Pessoa";
        vm.acao = "Cadastrar";

        // Recuperar a lista de perfil
        vm.listar(vm.urlPerfil).then(
            function (response) {
                if (response !== undefined) {
                    vm.listaPerfil = response;
                    if ($routeParams.idPessoa) {
                        vm.tituloTela = "Editar Pessoa";
                        vm.acao = "Editar";

                        vm.recuperarObjetoPorIDURL($routeParams.idPessoa, vm.urlPessoa).then(
                            function (pessoaRetorno) {
                                if (pessoaRetorno !== undefined) {
                                    vm.pessoa = pessoaRetorno;
                                    vm.pessoa.dataNascimento = vm.formataDataTela(pessoaRetorno.dataNascimento);
                                    vm.perfil = vm.pessoa.perfils[0];
                                }
                            }
                        );
                    }
                }
            }
        );
    };

    vm.listar = function (url) {
        var deferred = $q.defer();
        HackatonStefaniniService.listar(url).then(
            function (response) {
                if (response.data !== undefined) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.recuperarObjetoPorIDURL = function (id, url) {
        var deferred = $q.defer();
        HackatonStefaniniService.listarId(url + id).then(
            function (response) {
                if (response.data !== undefined)
                    deferred.resolve(response.data);
                else
                    deferred.resolve(vm.enderecoDefault);
            }
        );
        return deferred.promise;
    };

    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

    vm.retornarTelaListagem = function () {
        $location.path("listarPessoas");
    };

    vm.abrirModal = function (index, endereco) {

        vm.enderecoModal = vm.enderecoEditar;

        if (index !== undefined) {
            vm.indexEndereco = index;
        }

        if (endereco !== undefined && vm.acao === "Editar") {
            vm.tituloModal = "Editar Endereço";
            vm.enderecoModal.id = endereco.id;
            vm.enderecoModal.idPessoa = endereco.idPessoa;
            vm.enderecoModal.cep = endereco.cep;
            vm.enderecoModal.uf = endereco.uf;
            vm.enderecoModal.localidade = endereco.localidade;
            vm.enderecoModal.bairro = endereco.bairro;
            vm.enderecoModal.logradouro = endereco.logradouro;
            vm.enderecoModal.complemento = endereco.complemento;
        } else {
            vm.tituloModal = "Cadastrar Endereço";
            vm.enderecoModal = vm.enderecoCriar;
            vm.enderecoModal.idPessoa = vm.pessoa.id;
        }

        if (vm.pessoa.enderecos.length === 0)
            vm.pessoa.enderecos.push(vm.enderecoModal);

        $("#modalEndereco").modal();
    };

    vm.limparTela = function () {
        $("#modalEndereco").modal("toggle");
        vm.endereco = undefined;
    };

    vm.incluir = function () {

        // Formatar data nascimento de 'pessoa'
        vm.pessoa.dataNascimento = vm.formataDataJava(vm.pessoa.dataNascimento);

        // Cria o 'objetoDados' copiando o objeto 'pessoa'
        var objetoDados = angular.copy(vm.pessoa);

        // Cria lista endereco
        var listaEndereco = [];
        
        // Obtem os enderecos e injeta em 'listaEndereco'
        angular.forEach(objetoDados.enderecos, function (value, key) {
            if (value.complemento.length > 0) {
                value.idPessoa = objetoDados.id;
                listaEndereco.push(angular.copy(value));
            }
        });

        // Injeta os enderecos obtidos em 'objetoDados'
        objetoDados.enderecos = listaEndereco;

        // Se perfil existir
        if (vm.perfil !== null) {

            var isNovoPerfil = true;
            
            // Para cada perfil que a pessoa tiver...
            angular.forEach(objetoDados.perfils, function (value, key) {
                // se algum dos perfis que a pessoa possui forem iguais ao selecionado, não é um novo perfil
                if (value.id === vm.perfil.id) {
                    isNovoPerfil = false;
                }
            });

            //  Se o perfil for novo para aquela pessoa, acrescente ele na lista de perfis dela
            if (isNovoPerfil)
                objetoDados.perfils.push(vm.perfil);
        }

        if (vm.acao == "Cadastrar") {
            vm.salvar(vm.urlPessoa, objetoDados).then(
                function (pessoaRetorno) {
                    vm.retornarTelaListagem();
                }
            );
        } else if (vm.acao == "Editar") {
            vm.alterar(vm.urlPessoa, objetoDados).then(
                function (pessoaRetorno) {
                    vm.retornarTelaListagem();
                }
            );
        }
    };

    vm.salvar = function (url, objeto) {
        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.incluir(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.alterar = function (url, objeto) {
        var deferred = $q.defer();
        var obj = JSON.stringify(objeto);
        HackatonStefaniniService.alterar(url, obj).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.remover = function (objeto, tipo) {

        var url = vm.urlPessoa + objeto.id;
        if (tipo === "ENDERECO")
            url = vm.urlEndereco + objeto.id;

        vm.excluir(url).then(
            function (ojetoRetorno) {
                vm.retornarTelaListagem();
            }
        );
    };

    vm.excluir = function (url, objeto) {

        var deferred = $q.defer();
        HackatonStefaniniService.excluir(url).then(
            function (response) {
                if (response.status == 200) {
                    deferred.resolve(response.data);
                }
            }
        );
        return deferred.promise;
    }

    vm.formataDataJava = function (data) {
        var dia = data.slice(0, 2);
        var mes = data.slice(2, 4);
        var ano = data.slice(4, 8);
                
        // var date = ano + "-" + mes + "-" + dia;
        // date = toString(date);
        // date = date.toString();
        // console.log(date);
        // console.log(typeof(date));
        // return date;

        return ano + "-" + mes + "-" + dia;
    };

    vm.formataDataTela = function (data) {
        var ano = data.slice(0, 4);
        var mes = data.slice(5, 7);
        var dia = data.slice(8, 10);

        // var date = dia + mes + ano;
        // date = toString(date);
        // date = date.toString();
        // return date;

        return dia + mes + ano;
    };

    vm.listaUF = [
        { "id": "AC", "desc": "AC" },
        { "id": "AL", "desc": "AL" },
        { "id": "AM", "desc": "AM" },
        { "id": "AP", "desc": "AP" },
        { "id": "BA", "desc": "BA" },
        { "id": "CE", "desc": "CE" },
        { "id": "DF", "desc": "DF" },
        { "id": "ES", "desc": "ES" },
        { "id": "GO", "desc": "GO" },
        { "id": "MA", "desc": "MA" },
        { "id": "MG", "desc": "MG" },
        { "id": "MS", "desc": "MS" },
        { "id": "MT", "desc": "MT" },
        { "id": "PA", "desc": "PA" },
        { "id": "PB", "desc": "PB" },
        { "id": "PE", "desc": "PE" },
        { "id": "PI", "desc": "PI" },
        { "id": "PR", "desc": "PR" },
        { "id": "RJ", "desc": "RJ" },
        { "id": "RN", "desc": "RN" },
        { "id": "RO", "desc": "RO" },
        { "id": "RR", "desc": "RR" },
        { "id": "RS", "desc": "RS" },
        { "id": "SC", "desc": "SC" },
        { "id": "SE", "desc": "SE" },
        { "id": "SP", "desc": "SP" },
        { "id": "TO", "desc": "TO" },
    ];

    vm.salvarEndereco = function() {
        if (vm.enderecoModal.id) {
            vm.alterarEndereco();
        } else {
            vm.incluirEndereco();
        }
    }

    vm.alterarEndereco = function() {
        var endereco = JSON.stringify(vm.enderecoModal);
        HackatonStefaniniService.alterar(vm.urlEndereco, endereco).then(
            function (response) {
                console.log(response);
                vm.pessoa.enderecos[vm.indexEndereco] = response.data;
            }
        )
    }

    vm.incluirEndereco = function() {
        HackatonStefaniniService.incluir(vm.urlEndereco, vm.enderecoModal).then(
            function (response) {
                if (response.status == 200) {
                    vm.enderecoModal = response.data;
                    vm.pessoa.enderecos.push(vm.enderecoModal);
                }
            }
        );    
    }

}
