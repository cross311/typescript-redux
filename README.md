# Kepler Redux Library

This library is a wrapper around redux and the normalization patterns that kepler uses to organize the state.


# Normalized State Shape

Below is an abridged example of the a state shape which is heavily inspired by Twitter's mWeb application ([Dissecting Twitter’s Redux Store)](https://medium.com/statuscode/dissecting-twitters-redux-store-d7280b62c6b1) and Redux’s state normalization documentation ([Normalizing State Shape](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html)).


    const state = {
      pages: {
        search: {
          term: 'diapers',
          page: 21,
          sort: 'price_high_to_low',
          category: 2000031,
          results: [
            '542412a16f6947018819a01c5c6ce2d2',
            'e399de20c93a47b385e4318c5aaeb632'
          ]
        }
      },
      entities: {
        collections: {
          product: {
            entities: {
              '542412a16f6947018819a01c5c6ce2d2': {
                sku: 'e399de20c93a47b385e4318c5aaeb632',
                manufacturer: 'Kirkland Signature',
                title: 'Kirkland Signature Supreme Diapers'
              },
              'e399de20c93a47b385e4318c5aaeb632': {
                sku: 'e399de20c93a47b385e4318c5aaeb632',
                manufacturer: 'Fisher-Price',
                title: 'Fisher-Price Splash & Play Bath Bar'
              }
            },
            error: {
              '542412a16f6947018819a01c5c6ce2d2': null,
              'e399de20c93a47b385e4318c5aaeb632': null
            },
            fetchStatus: {
             '542412a16f6947018819a01c5c6ce2d2': 'fetched',
             'e399de20c93a47b385e4318c5aaeb632': 'fetched'
            },
            loadedAt: {
              '542412a16f6947018819a01c5c6ce2d2': 1509406920076,
              'e399de20c93a47b385e4318c5aaeb632': 1509406920076
            },
            requestedAt: {
              '542412a16f6947018819a01c5c6ce2d2': 1509406920076,
              'e399de20c93a47b385e4318c5aaeb632': 1509406920076
            }
          }
        },
        singles: {}
      }
    }

## Entities

Regardless of how data comes back from the API, we store all of our entities in a standardized and normalized fashion. This allows us to quickly find what we are looking for, and also supports caching, which can reduce the number of API calls required. We store two types of entities, `collections` and `singles`. Any entities that will have more than one instance (e.g., products) live in the `collections` map. An entity that can only have one instance (e.g., shopping cart) lives in the `singles` map. The format for storing both collection and single entities is similar and follows the following format.

You may notice that there are no arrays in this shape. Storing each entity as a map keyed by the entity’s id allows us to quickly query the state for information. We can easily find a product with id `1a2b3c` at `state.entities.collections.product.entities.1a2b3c`.


    type collections = {
      [string]: {
        entities: {
          [any]: any
        },
        error: {
          [any]: string
        },
        fetchStatus: {
          [any]: string
        },
        loadedAt: {
          [any]: number
        }
        requestedAt: {
          [any]: number
        }
      }
    }


    type singles = {
      [any]: {
        value: any,
        error: string,
        fetchStatus: string,
        loadedAt: number,
        requestedAt: number
      }
    }

### Keys

#### entities

**value:** In the the key `entities` in the `collections` map is used to hold the actual data of the entity keyed by the entity’s id. In the `singles` map, the entity’s data is stored at the `value` key.

**error:** The `error` key is used to hold a string error, if one is encountered while fetching the entity from an API. In the `singles` map, the string is stored as a value for the `error` key. In the `collections` map, `error` key holds a map of strings with the entity’s id as the key.

**fetchStatus:** The `fetchStatus` key is used to hold a string that indicated the status of an API fetch. The acceptable values are `null` , `loading`  and `loaded`. In the `singles` map, the string is stored as a value for the `fetchStatus` key. In the `collections` map, `fetchStatus` key holds a map of strings with the entity’s id as the key.

**loadedAt:** The `loadedAt` key is used to hold a number representation of the date/time that the API returned data. In the `singles` map, the number is stored as a value for the `loadedAt` key. In the `collections` map, `loadedAt` key holds a map of numbers with the entity’s id as the key.

**requestedAt:** The `requestedAt` key is used to hold a number representation of the date/time that the API request was made. In the `singles` map, the number is stored as a value for the `requestedAt` key. In the `collections` map, `requestedAt` key holds a map of numbers with the entity’s id as the key.

## Pages

The pages map is much more flexible. Each key in this map represents a page or contrainer in the app and the value of the map is an object with any properties necessary to support the page. In the above example, the `search` page map stores the pagination, search term data and and array of ids for products.

# Reading the State

Having a normalized state shape is adventageous 
Storing data in a normalized format is designed for optimal caching and organization, but it is certainly not ideal for displaying data on UIs. This is where selectors come in. Selectors are simple functions that take in the state and return a view of the data that is appropriate for display on a UI.
Selectors can be specific or generic and they can take in additional arguments.

For example, displaying the results of a search in React is best achieved by passing an array of products to a component. We can write a simple selector to combine the results from our `pages.search` map with our `entities.collections.product` map.
