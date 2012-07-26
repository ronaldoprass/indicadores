google.load("visualization", "1", {packages:["corechart"]});
$(document).ready(function(){
		
	function carregaCidades(){
		$.ajax({
			url:"json/cidade.json",
			dataType:"json",
			error:function(a,b,c){
				alert("Erro ao buscar lista de cidades");
			},
			success:function(dados){
				var option = "<option value=''>Selecione uma cidade</option>";
				for( var i=0; i<dados.length; i++){
					option += "<option value='" + dados[i].municipio + "'>" + dados[i].municipio + "</option>";
				}
				$("select#cidade1").removeAttr('disabled').html(option);
				$("select#cidade2").removeAttr('disabled').html(option);
			}
		});
	}
	carregaCidades();
	
	$("#confirmaComparativo").click(function(){
		$("#resultadoComparativo").html("<div class='loadingData'>Carregando comparativo de cidades...</div>");
		var municipio01 = $("#cidade1").val();
		var municipio02 = $("#cidade2").val();
		var ocorrencia = $("#ocorrencia").val();
		carregaJson( municipio01, municipio02, ocorrencia);
	});
	
	function carregaJson( municipio01, municipio02, ocorrencia){
		if( municipio01 != '' && municipio02 != '' ){
			
			$.ajax({
				url:"json/comparativo.json",
				data:{
					param: "comp",
					muni1: municipio01,
					muni2: municipio02,
					tipo: ocorrencia
				},
				dataType:"json",
				jsonp:"callback",
				timeout:"30000",
				type:"post",
				error:function(a,b,c){
					alert("Erro ao buscar dados para comparativo");
				},
				success:function(dados){
					var arrayDados = new Array();
					arrayDados.push([
									'Periodo',
									municipio01,
									municipio02
									]);
					for( var i=0; i<dados.comparativo.length; i++){
						arrayDados.push([
										dados.comparativo[i].periodo,
										dados.comparativo[i].municipio1,
										dados.comparativo[i].municipio2
										]);
					}
					criaElemento("resultadoComparativo", arrayDados, ocorrencia);
				}
			});
			
		}else{
			$("#resultadoComparativo").html("<div class='loadingData'>Selecione os campos no filtro acima</div>");
		}
	}
	
	carregaJson('', '', '');
	
	function criaElemento(id, dados, titulo){
		var data = google.visualization.arrayToDataTable(dados);
		var options = {
		  title: titulo,
		  hAxis: {title: 'Período'},
		  legend: {
			  textStyle: {
			  	  fontSize: 11
			  }
		  },
		  colors: ['#D62222', '#499D2C'],
		};
		var chart = new google.visualization.ColumnChart(document.getElementById(id));
		chart.draw(data, options);
	}
});