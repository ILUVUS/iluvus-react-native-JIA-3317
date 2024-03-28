import { TouchableOpacity, View, Text } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import { BASE_URL } from '@env'
import { useIsFocused } from '@react-navigation/native'
import { ScrollView } from 'react-native-gesture-handler'
import { RefreshControl } from 'react-native'
import { useCallback } from 'react'
import { ImageBackground } from 'react-native'
import profileBg from '../../../assets/images/profileBg.png'
import { Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import profile_icon from '../../../assets/images/profile_icon.png'
import { Keyboard } from 'react-native'
import COLORS from '../../constants/colors'
import { faAward } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { Modal } from 'react-native'
import InterestSelector from './InterestSelector'

const Profile = () => {
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const [userId, setUserId] = useState('')
    const [userInfo, setUserInfo] = useState({})
    const [refreshing, setRefreshing] = useState(false)
    const [isTopicSelectorModalVisible, setIsTopicSelectorModalVisible] =
        useState(false)
    const [verify, setVerify] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState([])

    useEffect(() => {
        console.log(selectedTopic)
    }, [selectedTopic])

    useEffect(() => {
        getVerified()
        const findUserInfoById = async () => {
            try {
                const value = await AsyncStorage.getItem('userId')
                if (value !== null) {
                    setUserId(value)
                }
            } catch (e) {
                console.log(e)
            }
        }
        findUserInfoById()
    }, [isFocused])

    const onRefresh = useCallback(() => {
        getVerified()
    }, [refreshing])

    const getVerified = async () => {
        axios({
            method: 'POST',
            url: `${BASE_URL}/user/verify`,
            data: {
                userId: await AsyncStorage.getItem('userId'),
            },
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                setVerify(true)
            })
            .catch((err) => {
                console.log(err)
                setVerify(false)
            })
    }

    useEffect(() => {
        console.log(userId)
        axios({
            method: 'GET',
            url: `${BASE_URL}/user/get?userId=${userId}`,
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => {
                console.log(res.data)
                setUserInfo(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [userId, isFocused])

    const editProfile = () => {
        setIsTopicSelectorModalVisible(true)
    }

    return (
        <View className="flex h-screen w-screen">
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                horizontal={false}
                contentContainerStyle={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexGrow: 1,
                    paddingTop: 24,
                    paddingHorizontal: 24,
                    paddingBottom: 150,
                }}
                className="h-screen w-screen overflow-auto bg-white"
                onTouchStart={Keyboard.dismiss}
            >
                <ImageBackground
                    source={profileBg}
                    resizeMode="cover"
                    imageStyle={{
                        borderRadius: 24,
                        opacity: 0.8,
                    }}
                    blurRadius={3}
                    className="mb-5 flex h-fit w-full flex-col items-center justify-center rounded-3xl  py-12 shadow-md shadow-orchid-300"
                >
                    <View className="mb-5 flex h-fit w-28 items-center justify-center rounded-full shadow shadow-orchid-600">
                        <Image
                            source={profile_icon}
                            className="h-40 w-40 rounded-full "
                        />
                    </View>

                    <View className="mb-5 flex items-center justify-center">
                        <View className="mb-1 flex flex-row gap-2">
                            <Text className="text-2xl font-semibold text-white shadow shadow-orchid-600">
                                {userInfo.lname}, {userInfo.fname}
                            </Text>
                            <Text className="text-base text-orchid-800 ">
                                {verify && (
                                    <FontAwesomeIcon
                                        icon={faAward}
                                        size={30}
                                        color={COLORS['gold'][900]}
                                    />
                                )}
                            </Text>
                        </View>
                        <Text className="text-base text-orchid-800 ">
                                {userInfo.dateOfBirth}
                        </Text>
                    </View>

                    <View className="flex flex-row items-center justify-center gap-5"></View>
                </ImageBackground>

                <View className="mb-5 flex h-fit w-full flex-col items-start justify-start rounded-3xl bg-white p-5 shadow-md shadow-slate-300">
                    <View className="mb-1 flex flex-row gap-2">
                        <Text className="mb-2 text-2xl font-bold text-orchid-900">
                            Details
                        </Text>
                        <TouchableOpacity onPress={editProfile}>
                            <Ionicons
                                name="create-outline"
                                size={26}
                                color={COLORS['orchid'][900]}
                            />
                        </TouchableOpacity>
                    </View>
                    <View className="mb-1 flex flex-row gap-2 items-center justify-center">
                    {verify && (
                        <Text className="text-base italic text-orchid-900">
                            Profesional Account
                        </Text>
                    )}
                    </View>

                    <Text className="text-base text-orchid-800 font-semibold ">
                        Interests:
                    </Text>
                    <View>
                        {selectedTopic.map((topic, index) => (
                            <View
                                key={index}
                                className="mx-1 my-2 rounded-full bg-orchid-100 px-3 py-1.5 shadow-sm items-center"
                            >
                                <Text className="text-sm text-orchid-900 justify-center items-center ">
                                    {topic.name}
                                </Text>
                            </View>
                        ))}

                    </View>
                </View>

                <Modal
                    presentationStyle="pageSheet"
                    visible={isTopicSelectorModalVisible}
                    transparent={false}
                    animationType="slide"
                >
                    {/* safe area? */}

                    <InterestSelector
                        key={Math.random()}
                        setModalVisibility={setIsTopicSelectorModalVisible}
                        selectedTopic={selectedTopic}
                        setSelectedTopic={setSelectedTopic}
                    />
                </Modal>
            </ScrollView>
        </View>
    )
}

export default Profile
