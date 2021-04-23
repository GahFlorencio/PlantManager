import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native'
import { Header } from '../components/Header';
import colors from '../styles/colors';
import waterdrop from '../assets/waterdrop.png'
import { FlatList } from 'react-native-gesture-handler';
import { loadPlant, PlantProps } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';
import fonts from '../styles/fonts';
import { PlantCardSecundary } from '../components/PlantCardSecundary';

export function MyPlants() {
    const [myPlants, setMyPlants] = useState<PlantProps[]>();
    const [loading, setLoading] = useState(true)
    const [nextWatered, setNextWatered] = useState<string>()

    async function loadStorageData() {
        const plantsStoraged = await loadPlant()

        console.log(plantsStoraged[0])

        const nextTime = formatDistance(
            new Date(plantsStoraged[0].dateTimeNotification).getTime(),
            new Date().getTime(),
            { locale: pt }
        )
        setNextWatered(
            `Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}`
        )
        setMyPlants(plantsStoraged)

        setLoading(false)
    }
    useEffect(() => {
        loadStorageData()
    }, [])


    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.spotlight}>
                <Image
                    style={styles.spotlightImage}
                    source={waterdrop}
                />
                <Text style={styles.spotlightText}>

                    {nextWatered}
                </Text>
            </View>
            <View
                style={styles.plants}
            >
                <Text style={styles.plantsTitle}>
                    Proximas Regadas
                </Text>
                <FlatList
                    data={myPlants}
                    keyExtractor={(plant) => String(plant.id)}
                    renderItem={({ item }) =>
                        <PlantCardSecundary data={item} />
                    }
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flex: 1 }}

                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 50,
        backgroundColor: colors.background
    },
    spotlight: {
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    spotlightImage: {
        width: 60,
        height: 60
    },
    spotlightText: {
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
    },
    plants: {
        flex: 1,
        width: '100%'
    },
    plantsTitle: {
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
})