google.load("visualization", "1", {packages:["corechart"]});
$(document).ready(function(){
	
	$( "input#confirmaRanking" ).click(function(){
		var dataIni = $( "select#dataInicial" ).val();
		var dataFin = $( "select#dataFinal" ).val();
		carregaDados( dataIni, dataFin );
	});
	
	hoje = new Date();
	mes = ((hoje.getMonth())+1);
	if( mes < 10 ){
		mes = "0" + mes.toString();
	}
	ano = hoje.getFullYear();
	carregaDados( "01-" + ano, mes + "-" + ano );
	
	function carregaDados( dataIni, dataFin ){
		$( "#conteudoCentro" ).html( "<div class='loadingData'>Carregando ranking...</div>" );
		$.ajax({
			url:"json/ranking.json",
			data:{
				param: "rkoco",
				ini: dataIni,
				fin: dataFin
			},
			dataType:"json",
			jsonp:"callback",
			timeout:"30000",
			type:"post",
			error:function(a,b,c){
				alert("Erro ao buscar dados do ranking");
			},
			success:function(dados){
				$( "#conteudoCentro" ).html( "" );
				for( var i=0; i<dados.ocorrencias.length; i++){
					ocorrencia = dados.ocorrencias[i].ocorrencia;
					valoresOcorrencia = dados.ocorrencias[i].dados;
					var arrayDados = new Array();
					arrayDados.push(['Cidade', 'Quantidade']);
					for( var j=0; j<valoresOcorrencia.length; j++){
						arrayDados.push([valoresOcorrencia[j].cidade, valoresOcorrencia[j].quantidade]);
					}
					var idObjeto = 'ocorrencia'+i;
					var objeto = "<div class='floatDiv' id='"+idObjeto+"'></div>";
					$( "#conteudoCentro" ).append(objeto);
					criaElemento(idObjeto, arrayDados, ocorrencia)
				}
			}
		});
	}
	
	function criaElemento(id, dados, titulo){
		var data = google.visualization.arrayToDataTable(dados);
		var options = {
		  title: titulo,
		  hAxis: {title: 'Cidades'},
		  colors: [defineCor()],
		  fontSize: 12,
		   'width':480,
		   'height':300
		};
		var chart = new google.visualization.ColumnChart(document.getElementById(id));
		chart.draw(data, options);
	}
	
	var posicaoCor = 0;
	var arrayCores = ['#D62222',
					  '#FAEA12',
					  '#499D2C',
					  '#FDB618',
					  '#D62222',
					  '#FAEA12',
					  '#499D2C',
					  '#FDB618',
					  '#D62222',
					  '#FAEA12',
					  '#499D2C',
					  '#FDB618',
					  '#D62222',
					  '#FAEA12',
					  '#499D2C',
					  '#FDB618'];
	function defineCor(){
		if( posicaoCor >= arrayCores.length ){
			posicaoCor = 0;
		}
		return arrayCores[posicaoCor++];
	}
});
