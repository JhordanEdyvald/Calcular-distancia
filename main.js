//INICIO ELEMENTOS
  let start_input = $('#input_saida');
  let destiny_input = $('#input_destino');
  let startNumber_input = $('#numero_saida');
  let destinyNumber_input = $('#numero_destino');
  let updateBtn = $('#submit');
  const resultBox = $('.area-resposta');
  let coordnates = {};
//FIM ELEMENTOS

updateBtn.click(async function(){
  const cepStart = start_input.val();
  const cepEnd = destiny_input.val();
  const numberStart = startNumber_input.val();
  const numberEnd = destinyNumber_input.val();
  await generate_coordnate(cepStart, numberStart, cepEnd, numberEnd);
  uriBingMaps = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${coordnates.numberCoordnates.valor1}&destinations=${coordnates.numberCoordnates.valor2}&distanceUnit=km&travelMode=driving&key=As8A6TWbETZAMDMHAxl0aL7KqPNuoCihWG1Uw8FxF7I5dk6mQ6GNP-M19O0aDGkV`;
  $.ajax({
    url : uriBingMaps,
    type : 'GET',
    success : (response)=>{
      const travel_distance = response.resourceSets[0].resources[0].results[0].travelDistance;
      resultBox.html(travel_distance+' Km');
    },
  })
});
async function generate_coordnate(cepStart, numberStart, cepEnd, numberEnd){
  await coordnate_text_link(cepStart, numberStart).then(async (responseStart)=>{
    await coordnate_text_link(cepEnd, numberEnd).then(async (responseEnd)=>{
        coordnates = {
          link : {
          'firstLink' : responseStart,
          'secondLink' : responseEnd,
          },
          numberCoordnates : {},
        };
        for(var i = 1; i <= 2; i++){
          await pullCord((i == 1) ? coordnates.link.firstLink : coordnates.link.secondLink, i);
        }
    })
  });
  console.log('-1');
  
  console.log('1');
}
async function pullCord(link, time) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: link,
      type: 'GET',
      success: (Response) => {
        coordnates.numberCoordnates['valor' + time] = Response[0].lat + ',' + Response[0].lon;
        console.log('0');
        resolve();
      },
      error: (error) => {
        reject(error);
      },
    });
  });
}
function coordnate_text_link(cep,num){
  return new Promise((resolve)=>{
    $.ajax({
      url: `https://viacep.com.br/ws/${cep}/json/`,
      type: 'GET',
      success: (adress)=>{
        let adressAllGenerator = `https://nominatim.openstreetmap.org/search?q=${adress.logradouro.replace(/\s/g,'%20')},${num},%20${adress.bairro.replace(/\s/g,'%20')},%20${adress.localidade.replace(/\s/g,'%20')},%20${adress.uf},%20Brazil&format=json&limit=1`;
        resolve(adressAllGenerator);
      },
    })
  });
}
/*const viaCepUrl = 'https://viacep.com.br/ws/06656210/json/';
const bingMapsApiKey = 'As8A6TWbETZAMDMHAxl0aL7KqPNuoCihWG1Uw8FxF7I5dk6mQ6GNP-M19O0aDGkV';
const destino = 'Centro, Itapevi, SP, Brazil';

// Fazer uma solicitação para a API ViaCEP para obter o endereço correspondente ao CEP
fetch(viaCepUrl)
  .then(response => response.json())
  .then(data => {
    const origem = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}, Brazil`;

    // Fazer uma solicitação para obter a distância entre os endereços de origem e destino
    const url = `https://dev.virtualearth.net/REST/v1/Routes/DistanceMatrix?origins=${origem}&destinations=${destino}&travelMode=driving&key=${bingMapsApiKey}`;
    return fetch(url);
  })
  .then(response => response.json())
  .then(data => {
    const distancia = data.resourceSets[0].resources[0].results[0].travelDistance;
    console.log(`A distância entre o CEP 06656210 e o centro de Itapevi é de ${distancia} km.`);
  })
  .catch(error => console.error(error));*/


