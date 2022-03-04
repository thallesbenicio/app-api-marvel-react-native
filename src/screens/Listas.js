import React from 'react';
import {
  TouchableOpacity,
  View,
  FlatList,
  Text,
  Image,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Button,
} from 'react-native';
import md5 from 'js-md5';

const PUBLIC_KEY = 'COLOQUE SUA KEY';
const PRIVATE_KEY = 'COLOQUE SUA KEY';

const Listas = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const [text, setText] = React.useState('10');

  React.useEffect(async () => {
    const timestamp = Number(new Date());
    const hash = md5.create();
    hash.update(timestamp + PRIVATE_KEY + PUBLIC_KEY);

    try {
      const response = await fetch(
        `https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&orderBy=name&limit=${text}&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`
      );
      const responseJson = await response.json();

      console.log(JSON.stringify(responseJson.data.results));
      console.log(JSON.stringify(responseJson.data.results.length));
      const results = responseJson.data.results;
      setData(results);
    } catch (e) {
      console.log(e);
    }
  }, [text]);

  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={setText}
        onFocus={() => setText('')}
        value={text}
        clearTextOnFocus={true}
        placeholder="Digite a quantidade de heróis que deseja exibir"
      />

      <Text style={styles.textTotal}>
        A sua pesquisa retornou: {data.length} resultado
        {data.length > 1 ? 's' : ''}
      </Text>
      <FlatList
        style={{ padding: 10 }}
        data={data}
        refreshing={true}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('Detalhes', { hero: item })}
            >
              <Image
                source={{
                  uri: `${item.thumbnail.path}.${item.thumbnail.extension}`,
                }}
                style={{ height: 50, width: 50, borderRadius: 25 }}
              />
              <Text>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: '#F7F7F7' }} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  textTotal: {
    textAlign: 'center',
  },
});

export default Listas;
