import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';


interface IBGEUfResponse {
  sigla: string
}

interface IBGECityResponse {
  nome: string
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const navigation = useNavigation();
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedUf, setSelectedUf] = useState('0');

  useEffect(() => {
    axios.get<IBGEUfResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  },[]);

  useEffect(() => {
    if (selectedUf !== '0') {
      axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios?orderBy=nome`).then(response => {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
      }
      );
    }
  }, [selectedUf]);

  function handleNavigationtoPoints() {
    navigation.navigate('Points',{
      uf: selectedUf,
      city: selectedCity,
    });
  }
  return (
    <KeyboardAvoidingView style={{flex: 1}}behavior={Platform.OS == 'ios' ? 'padding': undefined}>
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width  : 273, height: 368 }}
      >
        <View style={styles.main}>
          <Image source ={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <RNPickerSelect
            placeholder={{ label: 'Selecione a UF'}}
            style={pickerSelectStyles}
            value={selectedUf}
            onValueChange={newUf => setSelectedUf(newUf)}
            items={ufs?.map(uf => ({
              label: uf,
              value: uf
            }))}
          />
          <RNPickerSelect
            placeholder={{ label: 'Selecione a Cidade'}}
            style={pickerSelectStyles}
            value={selectedCity}
            onValueChange={newCity => setSelectedCity(newCity)}
            items={cities?.map(city =>({
              label: city,
              value: city
            }))}
          />
          <RectButton style={styles.button} onPress={handleNavigationtoPoints}>
            <View style={styles.buttonIcon}>
                <Icon name="arrow-right" color="#FFF" size={24} />
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },
  
  main: {
    flex: 1,
    justifyContent: 'center',
  },
  
  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },
  
  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },
  
  footer: {},
  
  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },
  
  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
    color: '#6C6C80'
  },
});

export default Home;