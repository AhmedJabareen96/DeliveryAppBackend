const Graph = require("../models/graph.model");
const mongoose = require('mongoose');
const { createTerminalNode, findIteratedSteinerTree } = require("./SteinerTreeIterated");
const Store = require("../models/store.model");
const DeliveryItem = require("../models/deliveryItem.model");
const Deliver = require('../models/deliver.model');
const Item = require('../models/item.model');
const Order = require('../models/order.model');
const User = require("../models/user.model");

const createDelivery = async (email, basket, startingPoint, price) => {
try{
        let items = [];
        for (let key of Object.keys(basket)) {
          items.push(parseInt(key));
        }
        const clientId = email;
        let driverId = "driverId";
        //0- assing driver id
        driverId = await chooseDriverRandom();
        //1- get terminals
        const terminals = await createTerminalNode(items);
        //2- get the graph
        const graph = await Graph.find();
        //3- create steiner tree
        const steinerTree = await findIteratedSteinerTree(graph, terminals, startingPoint);
        // 4- create storesAndItems
        const storesAndItems = await createDeliveryList(items, steinerTree, terminals);
        // 5- create storesAndLocations
        const storesAndLocations = await createStoresAndLocations(storesAndItems);
        //6- create deliveryOrder
        const deliveryOrder = await createDeliveryOrder(storesAndItems, storesAndLocations, clientId, driverId, basket, startingPoint);
        //7- update order
        const orderid = "64cfe65bc5226a95a5b9ab1c";
        const deliveryItem = await DeliveryItem.findById(orderid);
        const updatedItems = deliveryItem.items + deliveryOrder;
        const updatedItem = await DeliveryItem.findByIdAndUpdate(
          orderid,
          { items: updatedItems },
          { new: true }
        );
        
        if (!updatedItem) {
          return res.status(404).json({ message: 'Delivery item not found' });
        }
        // 8- create order and push it to manager
        await createOrderForManager(clientId, driverId, items, price);
} catch(err){
    console.log(err);
}
};


async function createDeliveryList(itemIds, steinerTree, terminals) {
    const terminalsSet = new Set(terminals);
    // remove driver point
    steinerTree.shift();
    // filter steiner tree from steiner points
    const steinerTreeFiltered = steinerTree.filter(item => terminalsSet.has(item));

    try {
        const StoresIds = steinerTreeFiltered.map(id => new mongoose.Types.ObjectId(id));
        const stores = await Store.find({ _id: { $in: StoresIds } });

        const resultStores = {};
        const foundItems = new Set();

        for (const store of stores) {
            // Find items in the current store that are in the itemIds list and not already found
            const newItems = store.items.filter(item => itemIds.includes(item) && !foundItems.has(item));

            // If the store has new items, add its ID to the result and add the items to the store's entry
            if (newItems.length > 0) {
                const storeId = String(store._id);
                resultStores[storeId] = newItems;
                newItems.forEach(item => foundItems.add(item));
            }

            // If all items are found, break the loop
            if (foundItems.size === itemIds.length) {
                break;
            }
        }

        return resultStores;
    } catch (err) {
        console.log(err);
    }
}


async function createStoresAndLocations(storesAndItems) {
    try {
      let result = {};
      const storeIdsArray = Object.keys(storesAndItems); // Use the correct parameter name
  
      // get stores
      const stores = await Store.find({ _id: { $in: storeIdsArray } }).exec();
      for (const store of stores) {
        const lat = store.lat;
        const lng = store.lng;
        result[store._id] = {
          lat: lat,
          lng: lng
        };
      }
      return result;
    } catch (error) {
      console.error('Error fetching stores:', error);
      throw error; // Rethrow the error to avoid unhandled rejection
    }
  }


  async function createDeliveryOrder(storesAndItems, storesAndLocations, clientId, driverId, basket, startingPoint) {    
try {
  let deliveryOrder = "";
  let names = {};
  let items = await Item.find();
  for(const item of items){
    names[item.id]=item.title;
  }
  for (const key in storesAndItems) {
      if (storesAndItems.hasOwnProperty(key)) {
          const array = storesAndItems[key];
          for (const element of array) {
              // create order
              let quantity = basket[element.toString()];
              const orderStr = clientId.toString() + "," + driverId.toString() + "," + names[element].toString() + "," + quantity.toString() + "," + key.toString() + "," + storesAndLocations[key].lat.toString() + "," + storesAndLocations[key].lng.toString() + "#";
              console.log('------------');
              console.log(orderStr);
              console.log("------------");
              // add to result string
              deliveryOrder += orderStr;
          }
      }
  }
  // add client's location to the order
  const orderStr = clientId.toString() + "," + driverId.toString() + "," + "Client" + "," + "0" + "," + "0" + "," + startingPoint.lat.toString() + "," + startingPoint.lng.toString() + "#";
  deliveryOrder+=orderStr;
  return deliveryOrder;
}
catch(error){
  console.log(error);
  return null;
}
}


const chooseDriverRandom = async () => {
  try{
    const drives = await Deliver.find();
    const arr = drives.map(driver => driver.email);
    const random = Math.floor(Math.random() * arr.length);
    return arr[random];
  }catch(err){
    console.log(err);
  }
}

const createOrderForManager = async (_clientId, _deliverId, _items, price) => {
  console.log("create order for manager");
  let items = _items.join(',');

  try {
    const clientId = await User.findOne({ email: _clientId });
    const deliverId = await Deliver.findOne({ email: _deliverId });
    if (!clientId) {
      throw new Error(`User with ID ${_clientId} not found.`);
    }
    if (!deliverId) {
      throw new Error(`Deliver with ID ${_deliverId} not found.`);
    }
    const order = new Order({
      clientId,
      items,
      deliverId,
      price
    });

    const savedOrder = await order.save();
    console.log(savedOrder);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {createDelivery};