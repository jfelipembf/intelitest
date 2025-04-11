import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { Colors, Fonts, Sizes } from '../../constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';

// Lista de avisos de exemplo
const announcementsList = [
  {
    id: '1',
    title: 'Reunião de Pais',
    date: '15 de Abril, 2025',
    description: 'Reunião de pais e mestres para discutir o desempenho dos alunos no primeiro bimestre. A reunião acontecerá no auditório principal da escola, das 19h às 21h. É importante a presença de todos os responsáveis.',
    image: require('../../assets/images/bgImage.png'),
    important: true,
  },
  {
    id: '2',
    title: 'Feriado Nacional',
    date: '21 de Abril, 2025',
    description: 'Não haverá aula devido ao feriado de Tiradentes. As atividades retornarão normalmente no dia seguinte.',
    image: null,
    important: false,
  },
  {
    id: '3',
    title: 'Semana de Provas',
    date: '05 a 09 de Maio, 2025',
    description: 'A semana de provas do primeiro bimestre acontecerá entre os dias 05 e 09 de maio. O calendário detalhado com os horários de cada avaliação será enviado em breve.',
    image: null,
    important: true,
  },
  {
    id: '4',
    title: 'Passeio Escolar',
    date: '25 de Abril, 2025',
    description: 'Passeio escolar ao Museu de Ciências. Os alunos devem trazer autorização assinada pelos responsáveis até o dia 20 de abril. O valor da entrada e transporte é de R$ 35,00.',
    image: require('../../assets/images/bgImage.png'),
    important: false,
  },
  {
    id: '5',
    title: 'Recesso Escolar',
    date: '15 a 30 de Julho, 2025',
    description: 'O recesso escolar de meio de ano acontecerá entre os dias 15 e 30 de julho. As aulas retornarão normalmente no dia 31 de julho.',
    image: null,
    important: false,
  },
  {
    id: '6',
    title: 'Feira de Ciências',
    date: '10 de Junho, 2025',
    description: 'A Feira de Ciências anual acontecerá no dia 10 de junho. Os alunos devem preparar seus projetos conforme as orientações dos professores de ciências.',
    image: require('../../assets/images/bgImage.png'),
    important: true,
  },
];

const AnnouncementsScreen = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  
  // Filtrar avisos com base na seleção
  const getFilteredAnnouncements = () => {
    if (selectedFilter === 'Importantes') {
      return announcementsList.filter(item => item.important);
    }
    return announcementsList;
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
      <MyStatusBar />
      <ImageBackground
        source={require('../../assets/images/bgImage.png')}
        style={{ width: '100%', height: 250, flex: 1 }}
        resizeMode="stretch"
        tintColor={Colors.whiteColor}
      >
        {header()}
        <View style={styles.sheetStyle}>
          {filterOptions()}
          {announcementsInfo()}
        </View>
      </ImageBackground>
    </View>
  );

  function filterOptions() {
    return (
      <View style={styles.allFiltersWrapStyle}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedFilter('Todos')}
          style={{
            backgroundColor: selectedFilter === 'Todos' ? Colors.secondaryColor : 'transparent',
            flex: 1,
            alignItems: 'center',
            ...styles.filterButtonStyle,
          }}
        >
          <Text style={selectedFilter === 'Todos' ? { ...Fonts.whiteColor13Medium } : { ...Fonts.blackColor13Medium }}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedFilter('Importantes')}
          style={{
            backgroundColor: selectedFilter === 'Importantes' ? Colors.secondaryColor : 'transparent',
            flex: 1,
            alignItems: 'center',
            ...styles.filterButtonStyle,
          }}
        >
          <Text style={selectedFilter === 'Importantes' ? { ...Fonts.whiteColor13Medium } : { ...Fonts.blackColor13Medium }}>
            Importantes
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function announcementsInfo() {
    const renderItem = ({ item }) => (
      <View style={styles.announcementCard}>
        <View style={styles.announcementHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: item.important ? Colors.secondaryColor : Colors.lightPrimaryColor },
              ]}
            >
              <MaterialIcons
                name="campaign"
                size={24}
                color={item.important ? Colors.whiteColor : Colors.primaryColor}
              />
            </View>
            <View style={{ marginLeft: Sizes.fixPadding }}>
              <Text style={{ ...Fonts.blackColor16SemiBold }}>{item.title}</Text>
              <Text style={{ ...Fonts.grayColor13Regular }}>{item.date}</Text>
            </View>
          </View>
          {item.important && (
            <View style={styles.importantBadge}>
              <Text style={{ ...Fonts.whiteColor11Bold, color: Colors.whiteColor }}>Importante</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.announcementDescription}>{item.description}</Text>
        
        {item.image && (
          <Image
            source={item.image}
            style={styles.announcementImage}
            resizeMode="cover"
          />
        )}
      </View>
    );

    return (
      <FlatList
        data={getFilteredAnnouncements()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Sizes.fixPadding * 2.0 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="announcement" size={50} color={Colors.grayColor} />
            <Text style={{ ...Fonts.grayColor16Medium, marginTop: Sizes.fixPadding }}>
              Nenhum aviso encontrado
            </Text>
          </View>
        )}
      />
    );
  }

  function header() {
    return (
      <View style={styles.headerWrapStyle}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color={Colors.whiteColor}
          onPress={() => {
            navigation.pop();
          }}
        />
        <Text
          style={{
            marginLeft: Sizes.fixPadding * 2.0,
            ...Fonts.whiteColor18SemiBold,
          }}
        >
          Avisos
        </Text>
      </View>
    );
  }
};

export default AnnouncementsScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    marginVertical: Sizes.fixPadding * 3.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    flex: 1,
    marginBottom: -(Sizes.fixPadding * 5.0),
    overflow: 'hidden',
    paddingBottom: Sizes.fixPadding * 5.0,
  },
  allFiltersWrapStyle: {
    borderColor: Colors.secondaryColor,
    borderWidth: 1.0,
    borderRadius: Sizes.fixPadding * 2.0,
    margin: Sizes.fixPadding * 2.0,
    marginLeft: Sizes.fixPadding,
    flexDirection: 'row',
    overflow: 'hidden',
    width: 200,
    alignSelf: 'flex-start',
  },
  filterButtonStyle: {
    paddingVertical: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding * 2.0,
  },
  announcementCard: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding * 1.5,
    marginBottom: Sizes.fixPadding * 2.0,
    borderColor: Colors.lightGrayColor,
    borderWidth: 1.0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.fixPadding,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  importantBadge: {
    backgroundColor: Colors.secondaryColor,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 7.0,
    borderRadius: Sizes.fixPadding - 5.0,
  },
  announcementDescription: {
    ...Fonts.blackColor14Regular,
    lineHeight: 22,
    marginBottom: Sizes.fixPadding,
  },
  announcementImage: {
    width: '100%',
    height: 180,
    borderRadius: Sizes.fixPadding - 2.0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Sizes.fixPadding * 10,
  },
});
