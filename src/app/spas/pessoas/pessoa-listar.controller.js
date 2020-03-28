angular.module("hackaton-stefanini").controller("PessoaListarController", PessoaListarController);
PessoaListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PessoaListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;

    vm.url = "http://localhost:8080/treinamento/api/pessoas/";
    vm.urlEndereco = "http://localhost:8080/treinamento/api/enderecos/";
    vm.urlPerfil = "http://localhost:8080/treinamento/api/perfils/";

    vm.init = function () {
        
        // Carrega a lista de pessoas
        HackatonStefaniniService.listar(vm.url).then(
            function (responsePessoas) {
                if (responsePessoas.data !== undefined) {
                    vm.listaPessoas = responsePessoas.data;
                }

                // Carrega a lista de endereços para depois ser verificada no momento de remover a pessoa
                HackatonStefaniniService.listar(vm.urlEndereco).then(
                    function (responseEndereco) {
                        if (responseEndereco.data !== undefined) {
                            vm.listaEndereco = responseEndereco.data;
                        }
                    }
                );

                // Carrega a lista de perfis para depois ser verificada no momento de remover a pessoa
                HackatonStefaniniService.listar(vm.urlPerfil).then(
                    function (responsePerfil) {
                        if (responsePerfil.data !== undefined) {
                            vm.listaPerfil = responsePerfil.data;
                        }
                    }
                );

            }
        );
    };

    vm.editar = function (id) {
        if (id !== undefined)
            $location.path("EditarPessoa/" + id);
        else
            $location.path("cadastrarPessoa");
    }

    // Verifica se a pessoa possui um endereço ou um perfil. Se sim, a exclusão da pessoa não é permitida
    vm.remover = function (id) {

        var liberaExclusaoEndereco = true;
        var liberaExclusaoPerfil = true;

        angular.forEach(vm.listaEndereco, function (value, key) {
            if (value.idPessoa === id)
                liberaExclusaoEndereco = false;
        });

        angular.forEach(vm.listaPerfil, function (value, key) {
            if (value.idPessoa === id)
                liberaExclusaoPerfil = false;
        });

        if (liberaExclusaoEndereco && liberaExclusaoPerfil) {
            HackatonStefaniniService.excluir(vm.url + id).then(
                function (response) {
                    vm.init();
                }
            );
        } else if (liberaExclusaoEndereco === false) {
            alert("Pessoa com Endereço vinculado, exclusão não permitida");
        } else if (liberaExclusaoPerfil === false) {
            alert("Pessoa com Perfil vinculado, exclusão não permitida");
        }
    }

}
