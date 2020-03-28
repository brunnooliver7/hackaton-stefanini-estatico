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
    }

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
                }
            }
        );
    };

    vm.incluirAlterarPerfil = function() {
        if(vm.acao == "Cadastrar"){
            vm.executarIncluirPerfil();
        } else if(vm.acao == "Editar") {
            vm.executarAlterarPerfil();
        }
    }
    
    vm.executarIncluirPerfil = function(){
        var data  = new Date();
        // var mes = data.getMonth()+1;
        // //data.getDate()+ "/"+ mes +"/"+ data.getFullYear() +" - "+ data.getHours() +":"+ data.getMinutes() +":"+ data.getSeconds();
        // var dataFormatadaJava =  data.getFullYear()+"-"+mes+"-"+data.getDate()+" "+ data.getHours() +":"+ data.getMinutes() +":"+ data.getSeconds();
        vm.perfil.dataHoraInclusao =  data;
        vm.perfil.dataHoraAlteracao =  data;
        var obj = JSON.stringify(vm.perfil);
        HackatonStefaniniService.incluir(vm.url, obj).then(
            function (response) {
                if (response.status == 200)
                    vm.goToListagem();
            }
        );
    }

    vm.executarAlterarPerfil = function(){
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

    vm.formataDataJava = function(data){
        var dia = data.slice(0,2);
        var mes = data.slice(2,4);
        var ano = data.slice(4,8);
        return ano+"-"+mes+"-"+dia;
    }

    vm.formataDataTela = function(data){
        var ano = data.slice(0,4);
        var mes = data.slice(5,7);
        var dia = data.slice(8,10);
        var dataFormatada = dia+mes+ano;
        return dataFormatada;
    }

}
