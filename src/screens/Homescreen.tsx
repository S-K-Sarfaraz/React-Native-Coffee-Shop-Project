import { Dimensions, FlatList, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { useStore } from '../store/store'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { BORDERRADIUS, COLORS, FONTFAMILY, FONTSIZE, SPACING } from '../theme/theme';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import CoffeeCard from '../components/CoffeeCard';
// import { useNavigation } from '@react-navigation/native';



const getCategoryFromData = (data: any) => {
  let temp: any = {};
  for(let i = 0; i < data.length; i++) {
    if(temp[data[i].name] == undefined){
      temp[data[i].name] = 1;
    } else {
      temp[data[i].name]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift("All");
  // console.log("Category: ", categories)
  return categories;
};



const getcoffeeList = (category: any, data:any) => {
  if (category === "All") {
    return data;
  } else {
    let coffeelist = data.filter((item:any) => item.name == category);
    return coffeelist;
  }
}



const Homescreen = ({navigation}: any) => {

  const CoffeeList = useStore((state:any) => state.CoffeeList);
  // console.log('CoffeeLIST: ', CoffeeList)
  const BeanList = useStore((state:any) => state.BeanList)
  const [categories, setCategories] = useState(getCategoryFromData(CoffeeList))
  const [searchText, setSearchText] = useState('')
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0]
  });
  const [sortedCoffee, setSortedCoffee] = useState(getcoffeeList(categoryIndex.category, CoffeeList))

  const ListRef:any = useRef<FlatList>()
  const tabBarHeight = useBottomTabBarHeight();


  const searchCoffee = (search: string) => {
    if(search != '') {
      ListRef?.current?.scrollToOffset({animated: true, offset: 0})
      setCategoryIndex({
        index: 0,
        category: categories[0]
      })
      setSortedCoffee([
        ...CoffeeList.filter((item:any) => item.name.toLowerCase().includes(search.toLowerCase()))
      ])
    }
  }

  const resetSearchCoffee = () => {
    ListRef?.current?.scrollToOffset({animated: true, offset: 0})
    setCategoryIndex({
      index: 0,
      category: categories[0]
    })
    setSortedCoffee([...CoffeeList])
    setSearchText('')
  }




  return (
    <View style={styles.ScreenContainer}>  
      <StatusBar backgroundColor={COLORS.primaryBlackHex}/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ScrollViewFlex}>
        {/* Add header */}
        <HeaderBar/>

        <Text style={styles.ScreenTitle}>Find the best{'\n'}coffee for you</Text>





        {/* Search Input */}
        <View style={styles.InputContainerComponent}>
          <TouchableOpacity onPress={() => {
            searchCoffee(searchText)
          }}>
            <CustomIcon 
              style={styles.InputIcon}
              name='search'
              size={FONTSIZE.size_18}
              color={
                searchText.length > 0 ? COLORS.primaryOrangeHex : COLORS.primaryLightGreyHex
              }
            />
          </TouchableOpacity>
          <TextInput 
            placeholder='Find Your Coffee... '
            value={searchText}
            onChangeText={text => {
              searchCoffee(text),
              setSearchText(text)}
            }
            placeholderTextColor={COLORS.primaryLightGreyHex}
            style={styles.TextInputContainer}
          />
          {searchText.length > 0 ? (
              <TouchableOpacity onPress={() => resetSearchCoffee()}>
                <CustomIcon name='close' size={FONTSIZE.size_18} color={COLORS.primaryLightGreyHex} style={styles.InputIcon}/>
              </TouchableOpacity>
            ) : <></>
          }
        </View>





        {/* Category ScrollView */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.CategoryScrollViewStyle}
        >
          {
            categories.map((data,index) => (
              <View key={index.toString()} style={styles.CategoryScrollViewContiner}>
                <TouchableOpacity 
                style={styles.CategoryScrollViewItem}
                onPress={() => {
                  ListRef?.current?.scrollToOffset({animated: true, offset: 0})
                  setCategoryIndex({index: index, category: categories[index]})
                  setSortedCoffee([
                    ...getcoffeeList(categories[index], CoffeeList)
                  ])
                }}>
                  <Text style={[
                    styles.CategoryTextActive,
                    categoryIndex.index == index ? {
                      color: COLORS.primaryOrangeHex
                    } : {}
                    ]}>{data}</Text>
                  {categoryIndex.index == index? <View style={styles.ActiveCategory}/> : <></>}
                </TouchableOpacity>
              </View>
            ))
          }
        </ScrollView>





        {/* Coffee Flatlist */}
        <FlatList
          ref={ListRef}
          horizontal
          ListEmptyComponent={
            <View style={styles.NoCoffeeFoundContainer}>
              <Text style={styles.CategoryTextActive}>No Coffee Found</Text>
            </View>
          }
          showsHorizontalScrollIndicator={false}
          data={sortedCoffee}
          contentContainerStyle={styles.FlatListContainer}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <TouchableOpacity onPress={() => {
                navigation.push('Details', {index:item.index, type:item.type, id:item.id})
              }}>
                <CoffeeCard 
                  name={item.name}
                  imagelink_square={item.imagelink_square}
                  buttonPressHandler={() => {}}
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  average_rating={item.average_rating}
                  price={item.prices[2]}
                  special_ingredient={item.special_ingredient}
                  roasted={item.roasted}
                />
              </TouchableOpacity>
            );
          }}
        />  
        <Text style={styles.CoffeeBeansTitle}>Coffee Beans Title</Text>






        {/* Beans Flatlist */}

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={BeanList}
          contentContainerStyle={[styles.FlatListContainer, {marginBottom: tabBarHeight}]}
          keyExtractor={item => item.id}
          renderItem={({item}) => {
            return (
              <TouchableOpacity onPress={() => {
                navigation.push('Details', {index:item.index, type:item.type, id:item.id})
              }}>
                <CoffeeCard 
                  name={item.name}
                  imagelink_square={item.imagelink_square}
                  buttonPressHandler={() => {}}
                  id={item.id}
                  index={item.index}
                  type={item.type}
                  average_rating={item.average_rating}
                  price={item.prices[2]}
                  special_ingredient={item.special_ingredient}
                  roasted={item.roasted}
                />
              </TouchableOpacity>
            );
          }}
        />



      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({

  ScreenContainer:{
    flex:1,
    backgroundColor: COLORS.primaryBlackHex
  },

  ScrollViewFlex:{
    flexGrow: 1,
  },

  ScreenTitle:{
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_28,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30
  },

  InputContainerComponent:{
    flexDirection: 'row',
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center'
  },

  InputIcon:{
    marginHorizontal: SPACING.space_20
  },

  TextInputContainer:{
    flex:1,
    height:SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex
  },

  CategoryScrollViewStyle:{
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20
  },

  CategoryScrollViewContiner:{
    paddingHorizontal: SPACING.space_15
  },

  CategoryScrollViewItem:{
    alignItems: 'center'
  },

  ActiveCategory:{
    height:SPACING.space_10,
    width:SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },

  CategoryTextActive:{
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4
  },

  FlatListContainer:{
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  CoffeeBeansTitle:{
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.secondaryLightGreyHex,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
  },
  NoCoffeeFoundContainer:{
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_30 * 3.6,
  }
})

export default Homescreen
