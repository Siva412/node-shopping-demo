const filterProducts = (prods) => {
    return prods.map(item => {
        return {
            name: item.name,
            rating: item.rating,
            ratingCount: item.ratingCount,
            price: item.price,
            maxQuantity: item.maxQuantity,
            description: item.description,
            id: item._id
        }
    })
}

module.exports = filterProducts;