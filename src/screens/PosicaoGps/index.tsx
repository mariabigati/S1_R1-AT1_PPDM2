import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";

export default function PosicaoGpsScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );

  const [address, setAddress] =
    useState<Location.LocationGeocodedAddress | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      // status: "granted" ou "denied"
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão negada à localização do dispositivo!");
        return;
      }

      // coordenadas de latitude, longitude, altitude
      const location = await Location.getCurrentPositionAsync();
      setLocation(location);

      if (location) {
        const { latitude, longitude } = location.coords;
        console.log(latitude, longitude);

        let responseLocation = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });
        console.log(responseLocation);

        setAddress(responseLocation[0]);
        console.log(address);
      }
    }

    getCurrentLocation();
  }, []); //quando a tela for carregada, ou quando os parâmetros do seu array mudam de estado, executa suas funções

  // const locationJSON = JSON.stringify(location)
  // const fullAddress = Location.reverseGeocodeAsync(location?.coords)

  let text = "Aguardando localização...";

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <View />
      <Text style={styles.titleScreen}>Posição atual detectada</Text>
      <View>
          <Text>Coordenadas:</Text>
          <Text>{text}</Text>
      </View>
    

      <View style={styles.card}>
        <Text>Estado: {address?.region}</Text>
      </View>

      <View style={styles.card}>
        <Text>Cidade: {address?.subregion}</Text>
      </View>

      <View style={styles.card}>
        <Text>Bairro: {address?.district}</Text>
      </View>

      <View style={styles.card}>
        <Text>Rua: {address?.street}</Text>
      </View>

      <View style={styles.card}>
        <Text>Número: {address?.streetNumber}</Text>
      </View>

      <View style={styles.card}>
        <Text>CEP: {address?.postalCode}</Text>
      </View>

      {/* <Text>{address.street}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  // Container principal que centraliza todo o conteúdo na tela
  container: {
    flex: 1, // Ocupa toda a área disponível da tela
    backgroundColor: "#f6f6f6", // Cinza muito claro como fundo
    justifyContent: "center", // Centraliza os filhos verticalmente (eixo principal)
    alignItems: "center", // Centraliza os filhos horizontalmente (eixo cruzado)
  },

  // Exibe o texto do GPS ou mensagem de status
  paragraph: {
    fontSize: 18, // Tamanho médio para boa legibilidade
    textAlign: "center", // Centraliza o texto dentro do componente
    color: "#b12727", // Vermelho — chama atenção para os dados exibidos
  },

  // Espaçamento superior (reservado para um possível cabeçalho futuro)
  header: {
    paddingHorizontal: 16, // Espaço interno lateral
    paddingTop: 20, // Espaço interno superior
  },

  // Título exibido acima dos dados de localização
  titleScreen: {
    fontSize: 18, // Mesmo tamanho dos dados — ambos no centro da tela
    fontWeight: "bold", // Negrito para diferenciar do parágrafo de dados
    color: "#1E293B", // Azul-escuro quase preto — cor de texto primária
  },

  card: {
    minHeight: 92,
    minWidth: 300, // Altura mínima garante que cards curtos sejam clicáveis
    alignItems: "center", // Alinha verticalmente os filhos ao centro
    flexDirection: "row", // Coloca os filhos em linha horizontal (texto + seta)
    backgroundColor: "#FFFFFF", // Fundo branco para o card
    borderRadius: 14, // Cantos arredondados — estética moderna
    paddingHorizontal: 18, // Padding interno: espaço lateral dentro do card
    paddingVertical: 16, // Padding interno: espaço vertical dentro do card
    borderWidth: 1, // Borda fina ao redor do card
    borderColor: "#E4E8E5", // Cinza-claro para a borda — sutil, não chama atenção
  },
});
