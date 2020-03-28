angular.module("hackaton-stefanini").controller("PerfilIncluirAlterarController", PerfilIncluirAlterarController);
PerfilIncluirAlterarController.$inject = [
    "$rootScope",
    "$scope",
    "$location",
    "$q",
    "$filter",
    "$routeParams",
    "HackatonStefaniniService"];

function PerfilIncluirAlterarController($rootScope, $scope, $location,
    $q, $filter, $routeParams, HackatonStefaniniService) {
    
    vm = this;
    vm.url = "http://localhost:8080/treinamento/api/perfils/";
    vm.perfil = {
        id: null,
        nome: "",
        descricao: "",
        dataHoraInclusao: "",
        dataHoraAlteracao: ""
    };
    vm.dataInclusao = "";
    vm.dataAlteracao = "";

    vm.init = function () {
       if($routeParams.idPerfil) {
        vm.tituloTela = "Editar Perfil";
        vm.acao = "Editar";
        vm.listarPerfil($routeParams.idPerfil);
       } else {
        vm.tituloTela = "Cadastrar Perfil";
        vm.acao = "Cadastrar";
       }
    };

    vm.listarPerfil = function (id) {
        HackatonStefaniniService.listarId(vm.url+id).then(
            function (response) {
                if (response.data !== undefined){
                    vm.perfil = response.data;
                    vm.dataInclusao = vm.formataData(vm.perfil.dataHoraInclusao);
                    vm.dataAlteracao = vm.formataData(vm.perfil.dataHoraAlteracao);
                }
            }
        );
    };

    vm.incluirAlterarPerfil = function() {
        if (vm.acao == "Cadastrar"){
            vm.incluirPerfil();
        } else if (vm.acao == "Editar") {
            vm.alterarPerfil();
        }
    }
    
    vm.incluirPerfil = function() {
        var data  = new Date();
        vm.perfil.dataHoraInclusao =  data;
        var obj = JSON.stringify(vm.perfil);
        HackatonStefaniniService.incluir(vm.url, obj).then(
            function (response) {
                if (response.status == 200)
                    vm.goToListagem();
            }
        );
        console.log("Perfil criado");
    }

    vm.alterarPerfil = function() {
        var data = new Date;
        data = data.toISOString();
        vm.perfil.dataHoraAlteracao = data;
        vm.dataAlteracao = vm.formataData(data);
        var obj = JSON.stringify(vm.perfil);
        HackatonStefaniniService.alterar(vm.url, obj).then(
            function (response) {
                if (response.status == 200)
                    vm.goToListagem();
            }
        );
        console.log("Perfil alterado");
    }
    
    vm.cancelar = function(){
        vm.goToListagem();
    }

    vm.goToListagem = function(){
        $location.path("listarPerfis");
    }

    vm.formataData = function(data) {
        var ano = data.slice(0,4);
        var mes = data.slice(5,7);
        var dia = data.slice(8,10);

        var dataFormatada = dia + '/' + mes + '/' + ano;
        return dataFormatada;
    }

}
