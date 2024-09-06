# React-Native-Coffee-Shop-Project


## Home Screen

### Geting all Category Data

This function `getCategoryFromData` takes an array of objects as input and returns an array of unique category names. It also adds an "All" category at the beginning of the array.

In essence, it groups the input data by a "name" property and returns the distinct names as categories.
```
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
```

### Sorting the Coffee List


This function, `getcoffeeList`, filters a list of coffee data based on a specified category. If the category is "All", it returns the entire list. Otherwise, it returns a subset of the list where the coffee name matches the specified category. 

```
const getcoffeeList = (category: any, data:any) => {
  if (category === "All") {
    return data;
  } else {
    let coffeelist = data.filter((item:any) => item.name == category);
    return coffeelist;
  }
}
```

### Search The Coffee List
This TypeScript/React code defines a function called `searchCoffee` which takes a `search` string as input. 

The function first checks if the `search` string is not empty. If it's not empty, it performs the following actions:

1. It scrolls to the top of a `ListRef` FlatList component using the `scrollToOffset` method.
2. It updates the `categoryIndex` state to have an index of 0 and a category of the first element in the `categories` array.
3. It filters the `CoffeeList` array based on the `name` property of each item, which includes the lowercase version of the `search` string. The filtered items are then stored in the `sortedCoffee` state.

In summary, this function performs a search operation based on the `search` string and updates the state accordingly.

```
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
```

### Reset Search 

This code snippet defines a function called `resetSearchCoffee`. When this function is called, it performs the following actions:

1. Scrolls a list view to the top using the `scrollToOffset` method of a reference to a `FlatList` component.
2. Updates the `categoryIndex` state to have an `index` of 0 and a `category` of the first item in the `categories` array.
3. Resets the `sortedCoffee` state to be a copy of the `CoffeeList`.
4. Clears the `searchText` state.

Overall, this function is used to reset the search functionality in a coffee shop app by resetting the scroll position, category selection, and search text.

```
const resetSearchCoffee = () => {
    ListRef?.current?.scrollToOffset({animated: true, offset: 0})
    setCategoryIndex({
      index: 0,
      category: categories[0]
    })
    setSortedCoffee([...CoffeeList])
    setSearchText('')
}
```


## store.tsx

### Add To Cart


This code snippet is an `addToCart` function that adds an item to a shopping cart. Here's a succinct explanation:

* It checks if the item is already in the cart by matching IDs.
* If the item is already in the cart, it checks if the specific size of the item is already present. If it is, it increments the quantity. If not, it adds the new size to the item's prices array.
* It sorts the prices array by size in descending order.
* If the item is not already in the cart, it adds the entire item to the cart.

This function uses the `produce` function from the `immer` library to immutably update the state.

```
addToCart: (cartItem: any) => set(produce((state: any) => {
    let found = false;
    for(let i = 0; i < state.CartList.length; i++){
        if(state.CartList[i].id == cartItem.id){
            found = true;
            let size = false;
            for(let j = 0; j < state.CartList[i].size.length; j++){
                if(state.CartList[i].prices[j].size == cartItem.prices[0].size){
                    size = true;
                    state.CartList[i].prices[j].quantity++;
                    break;
                } 
            }
            if(!size){
                state.CartList[i].prices.push(cartItem.prices[0]);
            }
            state.CartList[i].prices.sort((a:any,b:any) => {
                if(a.size > b.size) return -1;
                if(a.size < b.size) return 1;
                return 0;
            })
            break;
        }
    }
    if(!found){
        state.CartList.push(cartItem);
    }
})),
```

### Calculate Cart Price

This TypeScript code snippet defines a function called `CalculateCartPrice` that updates the state using the `set` function from the Zustand state management library. The function uses the `produce` function from the `immer` library to create a new state object immutably.

Here's a breakdown of what the code does:

1. It initializes a variable `totalPrice` to 0.
2. It iterates over each item in the `CartList` array in the state.
3. For each item, it iterates over each price in the `prices` array of the item.
4. It calculates the temporary price by multiplying the price of each item with its quantity and adds it to the `tempPrice` variable.
5. It sets the `ItemPrice` property of the current item in the `CartList` to the formatted `tempPrice`.
6. It updates the `totalPrice` by adding the `tempPrice` to it.
7. After iterating over all items, it sets the `CartPrise` property of the state to the formatted `totalPrice`.

Overall, this code calculates the total price of all items in the shopping cart and updates the state accordingly.

```
CalculateCartPrice: () => set(produce(state => {
    let totalPrice = 0;
    for(let i = 0; i < state.CartList.length; i++){
        let tempPrice = 0;
        for(let j = 0; j < state.CartList[i].prices.length; j++){
            tempPrice = tempPrice + parseFloat(state.CartList[i].prices[j].price) * (staCartList[i].prices[j].quantity);
        }
        state.CartList[i].ItemPrice = tempPrice.toFixed(2).toString();
        totalPrice = totalPrice + tempPrice;
    }
    state.CartPrise = totalPrice.toFixed(2).toString();
})),
```

### Add To Favourite List



This code adds an item to the `FavoritesList` if it's not already a favorite. It takes two parameters: `type` (either 'Coffee' or 'Bean') and `id`. It iterates through the corresponding list (either `CoffeeList` or `BeanList`) to find the item with the matching `id`, sets its `favourite` property to `true`, and adds it to the beginning of the `FavoritesList`.

```
addToFavoritesList: (type: any, id: any) => set(produce((state: any) => {
    if(type == 'Coffee'){
        for(let i = 0; i < state.CoffeeList.length; i++){
            if(state.CoffeeList[i].id == id){
                if(state.CoffeeList[i].favourite == false){
                    state.CoffeeList[i].favourite = true;
                    state.FavoritesList.unshift(state.CoffeeList[i]);
                }
                break;
            }
        }
    }
    else if(type == 'Bean'){
        for(let i = 0; i < state.BeanList.length; i++){
            if(state.BeanList[i].id == id){
                if(state.BeanList[i].favourite == false){
                    state.BeanList[i].favourite = true;
                    state.FavoritesList.unshift(state.BeanList[i]);
                }
                break;
            }
        }
    }
}))
```

### Delete From Favourite List



This code snippet removes an item from the `FavoritesList` by its `id` and type (`'Coffee'` or `'Bean'`). It first finds the item in the corresponding list (`CoffeeList` or `BeanList`) and sets its `favourite` property to `false`. Then, it finds the item in the `FavoritesList` by its `id` and removes it using the `splice` method.

```
deleteFromFavoritesList: (type: string, id: string) => set(produce((state) => {
    if(type == 'Coffee'){
        for(let i = 0; i < state.CoffeeList.length; i++){
            if(state.CoffeeList[i].id == id){
                if(state.CoffeeList[i].favourite == true){
                    state.CoffeeList[i].favourite = false;
                }
                break;
            }
        }
    } 
    else if(type == 'Bean'){
        for(let i = 0; i < state.BeanList.length; i++){
            if(state.BeanList[i].id == id){
                if(state.BeanList[i].favourite == true){
                    state.BeanList[i].favourite = false;
                }
                break;
            }
        }
    }   
    let spliceIndex = -1;
    for(let i = 0; i < state.FavoritesList.length; i++){
        if(state.FavoritesList[i].id == id){
            spliceIndex = i;
            break;
        }
    }
    state.FavoritesList.splice(spliceIndex, 1);
}))
```