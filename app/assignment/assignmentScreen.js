import { StyleSheet, Text, View, ImageBackground, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useCallback } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import MyStatusBar from '../../components/myStatusBar';
import { useNavigation } from 'expo-router';
import { useActivities } from '../../hooks/useActivities';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AssignmentScreen = () => {

    const navigation = useNavigation();
    const { 
        pendingActivities, 
        completedActivities, 
        loading, 
        refreshActivities, 
        markActivityAsCompleted, 
        markActivityAsPending,
        updatingActivity 
    } = useActivities();
    const [refreshing, setRefreshing] = useState(false);
    const [showCompleted, setShowCompleted] = useState(false);
    
    const activitiesToShow = showCompleted ? completedActivities : pendingActivities;

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refreshActivities();
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Data não definida';
        try {
            const date = new Date(dateString);
            return format(date, 'dd MMM yyyy', { locale: ptBR });
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return dateString;
        }
    };

    function assignmentsInfo() {
        const handleToggleActivityStatus = (activity) => {
            if (updatingActivity) return; // Evitar múltiplos cliques enquanto processa
            
            if (activity.score !== null) {
                // Atividade já está concluída, marcar como pendente
                Alert.alert(
                    "Marcar como pendente",
                    "Deseja marcar esta atividade como pendente novamente?",
                    [
                        {
                            text: "Cancelar",
                            style: "cancel"
                        },
                        {
                            text: "Confirmar",
                            onPress: async () => {
                                const success = await markActivityAsPending(activity);
                                if (success) {
                                    setShowCompleted(false); // Voltar para a lista de pendentes
                                }
                            }
                        }
                    ]
                );
            } else {
                // Atividade está pendente, marcar como concluída
                Alert.alert(
                    "Marcar como concluída",
                    "Deseja marcar esta atividade como concluída?",
                    [
                        {
                            text: "Cancelar",
                            style: "cancel"
                        },
                        {
                            text: "Confirmar",
                            onPress: async () => {
                                const success = await markActivityAsCompleted(activity);
                                if (success && !showCompleted) {
                                    // Opcionalmente, podemos mostrar a lista de concluídas
                                    // setShowCompleted(true);
                                }
                            }
                        }
                    ]
                );
            }
        };

        const renderItem = ({ item }) => (
            <View style={styles.assignmentWrapStyle}>
                <View style={styles.headerRow}>
                    <View style={styles.subjectWrapStyle}>
                        <Text style={{ ...Fonts.secondaryColor13SemiBold }}>
                            {item.subject?.name || 'Sem disciplina'}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.checkboxContainer}
                        onPress={() => handleToggleActivityStatus(item)}
                        disabled={updatingActivity}
                    >
                        {item.score !== null ? (
                            <View style={styles.checkboxChecked}>
                                <Ionicons name="checkmark" size={16} color={Colors.whiteColor} />
                            </View>
                        ) : (
                            <View style={styles.checkboxUnchecked} />
                        )}
                    </TouchableOpacity>
                </View>
                <Text style={{ marginTop: Sizes.fixPadding + 5.0, ...Fonts.blackColor14Medium }}>
                    {item.name}
                    {
                        item.avaliation === false
                            ?
                            <Text style={{ ...Fonts.redColor14Medium }}>
                                { } (Atividade sem avaliação)
                            </Text>
                            :
                            null
                    }
                </Text>
                <View style={{ marginVertical: Sizes.fixPadding, ...styles.rowAlignCenterSpaceBetween }}>
                    <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>
                        Data de início
                    </Text>
                    <Text style={{ ...Fonts.blackColor13Medium }}>
                        {formatDate(item.startDate)}
                    </Text>
                </View>
                <View style={styles.rowAlignCenterSpaceBetween}>
                    <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>
                        Data de entrega
                    </Text>
                    <Text style={{ ...Fonts.blackColor13Medium }}>
                        {formatDate(item.endDate)}
                    </Text>
                </View>
                {showCompleted && item.score !== null && (
                    <View style={[styles.rowAlignCenterSpaceBetween, { marginTop: Sizes.fixPadding }]}>
                        <Text style={{ flex: 1, ...Fonts.grayColor13Regular }}>
                            Nota
                        </Text>
                        <Text style={{ ...Fonts.primaryColor14SemiBold }}>
                            {item.score}
                        </Text>
                    </View>
                )}
            </View>
        )
        return (
            <FlatList
                data={activitiesToShow}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{ 
                    paddingTop: Sizes.fixPadding * 2.0,
                    paddingBottom: Sizes.fixPadding * 2.0,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.primaryColor]}
                    />
                }
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="assignment" size={50} color={Colors.grayColor} />
                        <Text style={{ ...Fonts.grayColor16Medium, marginTop: Sizes.fixPadding }}>
                            {showCompleted 
                                ? 'Nenhuma atividade concluída' 
                                : 'Nenhuma atividade pendente'}
                        </Text>
                    </View>
                )}
            />
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.whiteColor} onPress={() => { navigation.pop() }} />
                <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.whiteColor18SemiBold }}>
                    Atividades
                </Text>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
            <MyStatusBar />
            <ImageBackground
                source={require('../../assets/images/bgImage.png')}
                style={{ width: '100%', height: 250, flex: 1, }}
                resizeMode="stretch"
                tintColor={Colors.whiteColor}
            >
                {header()}
                <View style={styles.sheetStyle}>
                    <View style={styles.allFiltersWrapStyle}>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => setShowCompleted(false)}
                          style={{
                            backgroundColor: !showCompleted ? Colors.secondaryColor : 'transparent',
                            flex: 1,
                            alignItems: 'center',
                            ...styles.filterButtonStyle,
                          }}
                        >
                          <Text style={!showCompleted ? { ...Fonts.whiteColor13Medium } : { ...Fonts.blackColor13Medium }}>
                            Pendentes
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => setShowCompleted(true)}
                          style={{
                            backgroundColor: showCompleted ? Colors.secondaryColor : 'transparent',
                            flex: 1,
                            alignItems: 'center',
                            ...styles.filterButtonStyle,
                          }}
                        >
                          <Text style={showCompleted ? { ...Fonts.whiteColor13Medium } : { ...Fonts.blackColor13Medium }}>
                            Concluídas
                          </Text>
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color={Colors.primaryColor} />
                            <Text style={{ ...Fonts.grayColor14Medium, marginTop: Sizes.fixPadding }}>
                                Carregando atividades...
                            </Text>
                        </View>
                    ) : (
                        assignmentsInfo()
                    )}
                </View>
            </ImageBackground>
        </View>
    )
}

export default AssignmentScreen

const styles = StyleSheet.create({
    headerWrapStyle: {
        marginVertical: Sizes.fixPadding * 3.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    sheetStyle: {
        backgroundColor: Colors.whiteColor,
        borderTopLeftRadius: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        flex: 1,
        marginBottom: -(Sizes.fixPadding * 5.0),
        overflow: "hidden",
        paddingBottom: Sizes.fixPadding * 5.0,
    },
    rowAlignCenterSpaceBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    subjectWrapStyle: {
        backgroundColor: Colors.lightSecondaryColor,
        borderRadius: Sizes.fixPadding - 4.0,
        paddingVertical: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        alignSelf: 'flex-start'
    },
    assignmentWrapStyle: {
        borderColor: Colors.lightGrayColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        padding: Sizes.fixPadding + 5.0,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Sizes.fixPadding * 10,
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
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    checkboxContainer: {
        padding: 4, // Área de toque maior
    },
    checkboxUnchecked: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: Colors.grayColor,
    },
    checkboxChecked: {
        width: 20,
        height: 20,
        borderRadius: 4,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
})