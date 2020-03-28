angular.module("hackaton-stefanini").controller("EnderecoListarController", EnderecoListarController);
EnderecoListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function EnderecoListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    
    vm = this;
    vm.url = "http://localhost:8080/treinamento/api/enderecos/";

    vm.init = function () {
        HackatonStefaniniService.listar(vm.url).then(
            function (responseEnderecos) {
                if (responseEnderecos.data !== undefined)
                    vm.listaEnderecos = responseEnderecos.data;
            }
        );
    };

    vm.editar = function (id) {
        if (id !== undefined)
            $location.path("EditarEndereco/" + id);
        else
            $location.path("cadastrarEndereco");
    }

    vm.remover = function (id) {
        HackatonStefaniniService.excluir(vm.url + id).then(
            function (response) { 
                vm.init();
            }
        )
    }

}
