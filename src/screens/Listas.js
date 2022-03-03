import React from 'react';
import { TouchableOpacity, View, FlatList, Text, Image } from 'react-native';
import md5 from 'js-md5';

const PUBLIC_KEY = 'COLOQUE SUA KEY';
const PRIVATE_KEY = 'COLOQUE SUA KEY';

const Listas = ({ navigation }) => {
  const [data, setData] = React.useState([]);

  React.useEffect(async () => {
    const timestamp = Number(new Date());
    const hash = md5.create();
    hash.update(timestamp + PRIVATE_KEY + PUBLIC_KEY);

    try {
      const response = await fetch(
        `https://gateway.marvel.com/v1/public/characters?ts=${timestamp}&orderBy=name&limit=20&apikey=${PUBLIC_KEY}&hash=${hash.hex()}`
      );
      const responseJson = await response.json();

      console.log(JSON.stringify(responseJson.data.results));

      setData(responseJson.data.results);
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <FlatList
      style={{ padding: 10 }}
      data={data}
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
  );
};

export default Listas;
