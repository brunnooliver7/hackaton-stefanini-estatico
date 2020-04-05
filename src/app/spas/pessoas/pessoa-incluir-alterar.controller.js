angular.module("hackaton-stefanini").controller("PessoaIncluirAlterarController", PessoaIncluirAlterarController);
PessoaIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService",
];

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
        situacao: false,
        imagem: null
    };

    vm.perfils = []

    vm.endereco = {
        idPessoa: null,
        cep: "",
        uf: "",
        localidade: "",
        bairro: "",
        logradouro: "",
        complemento: ""
    };

    vm.enderecos = []

    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";
    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";
    vm.urlPessoa = "http://localhost:8080/treinamento/api/pessoas/";

    vm.init = function () {

        if ($routeParams.idPessoa) {
            vm.tituloTela = "Editar Pessoa";
            vm.acao = "Editar";

            vm.recuperarObjetoPorIDURL($routeParams.idPessoa, vm.urlPessoa).then(
                function (pessoaRetorno) {
                    if (pessoaRetorno !== undefined) {
                        vm.pessoa = pessoaRetorno;
                        vm.enderecos = pessoaRetorno.enderecos;
                        vm.pessoa.dataNascimento = vm.formataDataTela(pessoaRetorno.dataNascimento);
                        vm.marcarPerfilCheckBox();
                    }
                }
            );
        } else {
            vm.tituloTela = "Cadastrar Pessoa";
            vm.acao = "Cadastrar";
        }

        vm.listar(vm.urlPerfil).then(
            function (response) {
                if (response !== undefined) {
                    vm.listaPerfil = response;
                }
            }
        );
    };

// ----------------------- SERVIÇO ----------------------- //

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

// ----------------------- AUXILIARES ----------------------- //

    vm.retornarTelaListagem = function () {
        $location.path("listarPessoas");
    };

    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

// ------------------------- PESSOA ------------------------- //

    vm.incluir = function () {
        
        vm.pessoa.dataNascimento = vm.formataDataJava(vm.pessoa.dataNascimento);
        
        var objetoDados = angular.copy(vm.pessoa);
        
        // Salvar pessoa para obter o ID
        if (vm.acao == "Cadastrar") {
            vm.salvar(vm.urlPessoa, objetoDados).then(
                function (pessoaRetorno) {
                    
                    vm.pessoa.id = pessoaRetorno.id;

                    // Inserir perfis
                    vm.pessoa.perfils = angular.copy(vm.perfils);

                    // Inserir enderecos
                    angular.forEach(vm.enderecos, function (endereco, i) {
                        vm.enderecos[i].idPessoa = vm.pessoa.id;
                        
                        vm.endereco.idPessoa = endereco.idPessoa;
                        vm.endereco.cep = endereco.cep;
                        vm.endereco.uf = endereco.uf;
                        vm.endereco.localidade = endereco.localidade;
                        vm.endereco.bairro = endereco.bairro;
                        vm.endereco.logradouro = endereco.logradouro;
                        vm.endereco.complemento = endereco.complemento;

                        // Salvar endereco
                        vm.salvar(vm.urlEndereco, vm.endereco).then(
                            function (response) {

                            }
                        )

                    })

                    // PUT pessoa com perfis e enderecos inseridos
                    vm.alterar(vm.urlPessoa, vm.pessoa).then(
                        function (response) {
                            vm.pessoa = response;
                            console.log(response);
                        }
                    )

                    vm.retornarTelaListagem();

                }
            );
        } 

        if (vm.acao == "Editar") {
            vm.alterar(vm.urlPessoa, objetoDados).then(
                function (pessoaRetorno) {
                    console.log(pessoaRetorno);
                }
            );
            vm.retornarTelaListagem();
        }

    };

    vm.formataDataJava = function (data) {
        var dia = data.slice(0, 2);
        var mes = data.slice(2, 4);
        var ano = data.slice(4, 8);                
        return ano + "-" + mes + "-" + dia;
    };

    vm.formataDataTela = function (data) {
        var ano = data.slice(0, 4);
        var mes = data.slice(5, 7);
        var dia = data.slice(8, 10);
        return dia + mes + ano;
    };

// ------------------------- ENDERECO ------------------------- //

    vm.abrirModal = function (index, endereco) {

        if(vm.endereco) {
            vm.limparEndereco();
        }
        vm.enderecoModal = endereco;

        if (index !== undefined) {
            vm.indexEndereco = index;
        }

        if (endereco) {
            vm.tituloModal = "Editar Endereço";
            vm.enderecoModal.idPessoa = endereco.idPessoa;
            vm.enderecoModal.cep = endereco.cep;
            vm.enderecoModal.uf = endereco.uf;
            vm.enderecoModal.localidade = endereco.localidade;
            vm.enderecoModal.bairro = endereco.bairro;
            vm.enderecoModal.logradouro = endereco.logradouro;
            vm.enderecoModal.complemento = endereco.complemento;
        } else {
            vm.tituloModal = "Cadastrar Endereço";
            vm.enderecoModal = vm.endereco;
        }

        vm.habilitarSalvar();

        $("#modalEndereco").modal();
    };

    vm.limparTela = function () {
        $("#modalEndereco").modal("toggle");
        vm.endereco = undefined;
    };

    vm.salvarEndereco = function() {
        if (vm.tituloModal === "Editar Endereço") {
            vm.enderecos[vm.indexEndereco].idPessoa = angular.copy(vm.enderecoModal.idPessoa);
            vm.enderecos[vm.indexEndereco].cep = angular.copy(vm.enderecoModal.cep);
            vm.enderecos[vm.indexEndereco].uf = angular.copy(vm.enderecoModal.uf);
            vm.enderecos[vm.indexEndereco].localidade = angular.copy(vm.enderecoModal.localidade);
            vm.enderecos[vm.indexEndereco].bairro = angular.copy(vm.enderecoModal.bairro);
            vm.enderecos[vm.indexEndereco].logradouro = angular.copy(vm.enderecoModal.logradouro);
            vm.enderecos[vm.indexEndereco].complemento = angular.copy(vm.enderecoModal.complemento);
        } else {
            vm.enderecos.push(angular.copy(vm.enderecoModal));
        }
    }

    vm.removerEndereco = function (objeto, tipo) {
        var url = vm.urlPessoa + objeto.id;
        if (tipo === "ENDERECO")
            url = vm.urlEndereco + objeto.id;

        vm.excluir(url).then(
            function (objetoRetorno) {
                vm.init();
            }
        );
    };

    vm.limparEndereco = function () {
        vm.endereco.idPessoa = null,
        vm.endereco.cep = "",
        vm.endereco.uf = "",
        vm.endereco.localidade = "",
        vm.endereco.bairro = "",
        vm.endereco.logradouro = "",
        vm.endereco.complemento = ""
    }

    vm.buscarCep = function() {
        var data = vm.enderecoModal.cep;
        if (vm.enderecoModal.cep.length == 8) {
            HackatonStefaniniService.consultarCep(vm.urlEndereco + 'buscarCep', data).then(
                function (response) {
                    if (response) {
                        vm.enderecoModal.uf = response.data.uf
                        vm.enderecoModal.localidade = response.data.localidade
                        vm.enderecoModal.bairro = response.data.bairro
                        vm.enderecoModal.logradouro = response.data.logradouro
                        vm.enderecoModal.complemento = response.data.complemento   
                        vm.enderecoModal.idPessoa = vm.pessoa.id;
                    }
                } 
            );
        }
    }

    vm.habilitarSalvar = function() {
        vm.habilitarSalvarBtn = true
        if (vm.enderecoModal.complemento !== "") { 
            vm.habilitarSalvarBtn = false;
        }
    }

// ------------------------- PERFIL ------------------------- //

    vm.marcarPerfilCheckBox = function() {
        vm.perfilCheckBox = {};
        angular.forEach(vm.listaPerfil, function (perfil, i) {
            vm.perfilCheckBox[i] = false;
            angular.forEach(vm.pessoa.perfils, function (perfilPessoa, j) {
                if (perfil.id === perfilPessoa.id) {
                    vm.perfilCheckBox[i] = true;
                }
            })
        })
    }

    vm.salvarPerfils = function() {
        vm.perfils = [];
        angular.forEach(vm.listaPerfil, function(perfil, i) {
            if (vm.perfilCheckBox[i] === true) {
                vm.perfils.push(perfil);
            }
        })
    }

}
