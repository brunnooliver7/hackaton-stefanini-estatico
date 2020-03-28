angular.module("hackaton-stefanini").controller("MenuController", MenuController);
MenuController.$inject = ["$rootScope", "$scope", "$location",
    "$q", '$filter', '$routeParams', 'HackatonStefaniniService'];

function MenuController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    vm = this;

    vm.chamarPagina = function (pagina) {

        switch (pagina) {

            // Pessoa
            case 'cadastrarPessoa':
                $location.path("cadastrarPessoa");
                break;

            case 'EditarPessoa':
                $location.path("EditarPessoa");
                break;

            case 'listarPessoas':
                $location.path("listarPessoas");
                break;

            // Perfil
            case 'cadastrarPerfil':
                $location.path("cadastrarPerfil");
                break;

            case 'EditarPerfil':
                $location.path("EditarPerfil");
                break;
                
            case 'listarPerfis':
                $location.path("listarPerfis");
                break;

            // Endereco
            case 'cadastrarEndereco':
                $location.path("cadastrarEndereco");
                break;

            case 'EditarEndereco':
                $location.path("EditarEndereco");
                break;
                
            case 'listarEnderecos':
                $location.path("listarEnderecos");
                break;

            // Home
            case 'home':
            $location.path("/");
            break;

            default:
                $location.path("/");
                break;
        }

        //vm.executaConsultaModelo();
    };

    vm.executaConsultaModelo = function () {
        var dados = {

        };

        HackatonStefaniniService.teste(dados).then(
            function (response) {
                if (response.data !== undefined)
                    console.log(response.data);
            }
        );
    };
}
