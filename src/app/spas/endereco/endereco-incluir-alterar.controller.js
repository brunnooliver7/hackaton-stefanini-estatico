angular.module("hackaton-stefanini").controller("EnderecoIncluirAlterarController", EnderecoIncluirAlterarController);
EnderecoIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function EnderecoIncluirAlterarController(
    $rootScope,
    $scope,
    $location,
    $q,
    $filter,
    $routeParams,
    HackatonStefaniniService) {
    
    vm = this;
    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";
    vm.endereco = {
        id: null,
        cep: "",
        uf: "",
        localidade: "",
        bairro: "",
        complemento: "",
        logradouro: ""
    }

    vm.init = function () {
        console.log($routeParams);
        console.log('endereco-incluir-alterar iniciado');
        if($routeParams.idEndereco) {
            vm.tituloTela = 'Editar Endereço';
            vm.acao = 'Editar';
            vm.listarEndereco($routeParams.idEndereco);
        } else {
            vm.tituloTela = 'Cadastrar Endereço';
            vm.acao = 'Cadastrar';
        }
    };
    
    vm.listarEndereco = function (id) {
        // var deferred = $q.defer();
        // HackatonStefaniniService.listar(url).then(
        //     function (response) {
        //         if (response.data !== undefined) {
        //             deferred.resolve(response.data);
        //         }
        //     }
        // );
        // return deferred.promise;
        HackatonStefaniniService.listarId(vm.url + id).then(
            function (response) {
                if (response.data !== undefined) {
                    vm.endereco = response.data;
                }
            }
        );
    };

    vm.cancelar = function () {
        vm.retornarTelaListagem();
    };

    vm.retornarTelaListagem = function () {
        $location.path("listarEnderecos");
    };
    
    vm.incluir = function () {

        var objetoDados = angular.copy(vm.endereco);

        if (vm.acao == "Cadastrar") {
            vm.salvar(vm.urlEndereco, objetoDados).then(
                function (response) {
                    vm.retornarTelaListagem();
                });
        } else if (vm.acao == "Editarteste") {
            vm.alterar(vm.urlEndereco, objetoDados).then(
                function (response) {
                    vm.retornarTelaListagem();
                });
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

}
