angular.module("hackaton-stefanini").controller("PerfilListarController", PerfilListarController);
PerfilListarController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function PerfilListarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    
    vm = this;
    vm.url = "http://localhost:8080/treinamento/api/perfils/";

    vm.init = function () {
        HackatonStefaniniService.listar(vm.url).then(
            function (responsePerfils) {
                if (responsePerfils.data !== undefined)
                    vm.listaPerfis = responsePerfils.data;
            }
        );
    };

    vm.editar = function (id) {
        if (id !== undefined)
            $location.path("EditarPerfil/" + id);
        else
            $location.path("cadastrarPerfil");
    }

    vm.remover = function (id) {
        HackatonStefaniniService.excluir(vm.url + id).then(
            function (response) {
                vm.init();
            }
        );
    }
    
}
