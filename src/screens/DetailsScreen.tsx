import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {useStore} from '../store/store'
import { COLORS } from '../theme/theme'
import ImageBackgroundInfo from '../components/ImageBackgroundInfo'

const DetailsScreen = ({navigation, route}: any) => {
  // console.log("Route: ", route.params);
  
  const itemOfIndex = useStore((state: any) => (
    route.params.type == "coffee" ? state.CoffeeList : state.BeanList
  )[route.params.index])
  return (
    <View style={styles.ScreenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}
      >
        <ImageBackgroundInfo/>
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
  },
  ScrollViewFlex:{
    flexGrow: 1
  }
})

export default DetailsScreen
